import { promisify } from "util";
import fs from "fs";
import type Repo from "./models/repo";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import { randomBytes, randomUUID } from "crypto";
import path, { join } from "path";
import type { Readable } from "node:stream";
import { stdout } from "process";
import { Cryptor } from "./Cryptor";

export default class Restic {
  private static basepath = process.env?.CONFIG_PATH || "/configs";
  private static cacheDir?: string = process.env?.RESTIC_CACHE_DIR || undefined;
  private static RESTIC_MOUNT_REAP_INTERVAL = parseInt(
    process.env?.RESTIC_MOUNT_REAP_INTERVAL || "600"
  );
  private static mountPath: string =
    process.env?.RESTIC_MOUNT_DIR || "/tmp/restic-mount/";
  private static repos = new Map<string, Restic>();
  private processMonitor?: Promise<any>;
  private lastAccess = new Date();
  private configPath: string;
  private basePath = join(Restic.mountPath, randomUUID());
  private repoId: string;
  private loadedConfig: Promise<{ type: string; env: Record<string, string> }>;

  /**
   * Get a list of all the repos in the configuration directory.
   * @returns A list of configured repos.
   */
  static async ListRepos(): Promise<Repo[]> {
    let files = await fs.promises.readdir(Restic.basepath);
    return files.map((k) => {
      return { Id: k } as Repo;
    });
  }

  /**
   * Returns a new or existing repository instance.
   * @param repoId The repository for which to get an instance.
   * @param key A valid access key to unlock the configs.
   * @returns The repo, if it could be unlocked, or throws, otherwise.
   */
  static async Access(repoId: string, key: string): Promise<Restic> {
    if (await this.ValidateKey(repoId, key)) {
      let repo = Restic.repos.get(repoId);
      if (!repo) {
        repo = new this(repoId, key);
        Restic.repos.set(repoId, repo);
      }
      return repo;
    } else {
      throw "The specified key is not valid.";
    }
  }

  private constructor(repoId: string, key: string) {
    this.repoId = repoId;
    this.configPath = path.join(Restic.basepath, repoId);
    this.ensureConfig();

    this.loadedConfig = Restic.DecodeRepoConfiguration(repoId, key);
  }

  /**
   * Check to see if the config exists, and throw if it does not.
   */
  private ensureConfig() {
    if (!fs.existsSync(this.configPath))
      throw `The specified repo '${this.repoId}' does not exist.`;
  }

  /**
   * Create and monitor a mount process for this repo.
   */
  private async mount() {
    let currentMount = this.processMonitor;

    if (currentMount) {
      // There is already a launched mount process, we wait for it to become ready, or to fail.
      await currentMount;
    } else {
      this.lastAccess = new Date();
      // if this instance doesn't have a mount process, we create one:
      await fs.promises.mkdir(this.basePath, { recursive: true });
      let mountedProcess = true;

      let { env, type } = await this.loadedConfig;
      let addedProps: Record<string, string> = {
        PATH: process.env.PATH!,
      };

      if (Restic.cacheDir) {
        addedProps.RESTIC_CACHE_DIR = Restic.cacheDir;
      }

      if (type == "sftp") {
        /**
         * TODO: This should write the ssh key to somewhere on disk (or stdin, or fifo).
         * and then specify that as an additional argument
         *for the identify file.
         */
      }

      let p = spawn("restic", ["mount", "--no-lock", this.basePath], {
        env: Object.assign(env, addedProps),
        stdio: "pipe",
      });

      let handleProcessExit = () => {
        if (mountedProcess) p.kill("SIGINT");
      };

      process.on("SIGINT", handleProcessExit);

      p.on("error", () => {
        process.stdout.write(`The process exited with code: ${p.exitCode}.`);
        p.stdout.pipe(process.stdout);
        p.stderr.pipe(process.stderr);
      }).on("exit", async () => {
        mountedProcess = false;
        this.processMonitor = undefined;
        await fs.promises.rm(this.basePath, { recursive: true });
        process.off("SIGINT", handleProcessExit);
      });

      let filesAvailable = new Promise(async (res, rej) => {
        let sleep = promisify(setTimeout);
        do {
          let results = await fs.promises.readdir(this.basePath);
          if (results.length > 0) {
            res(true);
            return;
          }
          await sleep(1000);
        } while (mountedProcess);
        rej(
          `The repository '${this.repoId}' did not mount before restic exited. This can happen if the browser session ends prematurely, or there a configuration error.`
        );
      });

      //Set an interval to check to see if the repo has been accessed in the last 10 minutes, and if not, shut it down.
      let intervalId = setInterval(async () => {
        //We want to completely drop the repo out of memory so that it doesn't get reused.
        let lastAccess = (Date.now() - this.lastAccess.getTime()) / 1000;
        if (lastAccess >= Restic.RESTIC_MOUNT_REAP_INTERVAL) {
          Restic.repos.delete(this.repoId);
          clearInterval(intervalId);
          process.stdout.write(
            `Shutting down mount for '${this.repoId}' due to inactivity.`
          );
          p.kill("SIGINT");
          await p;
        }
      }, 30 * 1000);

      this.processMonitor = filesAvailable;
      await filesAvailable;
    }
  }

  /**
   * Lists the files for the specified path.
   * @param path The path for which to list files.
   * @returns
   */
  async List(path: string = ""): Promise<FileStat[]> {
    await this.mount();
    this.lastAccess = new Date();
    let lspath = join(this.basePath, path, "/");
    let results = await fs.promises.readdir(lspath);
    return await Promise.all(
      results.map(async (k) => {
        let stat = await fs.promises.stat(lspath + k);
        return {
          isDirectory: stat.isDirectory(),
          ctime: stat.ctime,
          mtime: stat.mtime,
          atime: stat.atime,
          size: stat.size,
          name: k,
          parent: path,
        };
      })
    );
  }

  /**
   *
   * @param path The directory or file that that is requested
   * @param type The type of stream requested, either "file" (the raw file stream), or an archive type (required if the path is a directory)
   * @returns The requested stream if it exists, or null if it does not.
   */
  async StreamPath(
    path: string,
    type: "file" | "tar" | "tar.gz" | "zip"
  ): Promise<Readable | null> {
    await this.mount();
    this.lastAccess = new Date();

    if (fs.existsSync(join(this.basePath, path))) {
      let task: ChildProcessWithoutNullStreams;

      if (type == "file") {
        task = spawn("/bin/cat", [path], {
          stdio: "pipe",
          cwd: this.basePath,
        });
      } else {
        task = spawn("/bin/tar", ["-cz", path], {
          stdio: "pipe",
          cwd: this.basePath,
        });
      }

      return task.stdout;
    } else {
      return null;
    }
  }

  /**
   * Check to see if the specified key can unlock the repo config.
   * @param repo The repo id to validate.
   * @param key The key to validate
   * @returns True if success, false if failure.
   */
  static async ValidateKey(repo: string, key: string): Promise<boolean> {
    try {
      await Restic.DecodeRepoConfiguration(repo, key);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Reads the repository configuration from disk and decodes it using the specified key.
   * @param name The name of the repo for which to read.
   * @param key The key of the repo to use to decode the config.
   * @returns
   */
  private static async DecodeRepoConfiguration(
    name: string,
    key: string
  ): Promise<{ type: string; env: Record<string, string> }> {
    let storagePath = join(Restic.basepath, name);
    if (!fs.existsSync(storagePath)) {
      throw "The repo specified does not exist. Please check to make sure the configuration is still available.";
    } else {
      // we only want to read the file off the disk once per launch:
      const fileContents = await fs.promises.readFile(storagePath, "utf8");
      let file = JSON.parse(fileContents) as CryptedFile;

      let keyringLookup = new Cryptor(key, file.iv, file.algorithm);

      for (var { name, key } of file.keys) {
        try {
          let payloadLookup = new Cryptor(
            await keyringLookup.DecryptString(key),
            file.iv,
            file.algorithm
          );

          let payload = await payloadLookup.DecryptString(file.payload);
          let env = JSON.parse(payload) as Record<string, string>;

          return { type: file.type, env };
        } catch {
          process.stdout.write(
            `Attempted to decrypt the '${name}' repo using the '${name}', but was not successful.`
          );
        }
      }
      // this can only be reached if the above loop does not return early.
      throw "The specified key cannot unlock the repo.";
    }
  }

  /**
   * Saves a new repo configuration with the specified options.
   * @param options
   */
  static async SaveRepo(options: CreateRepoRequest) {
    let storagePath = join(Restic.basepath, options.name);
    if (fs.existsSync(storagePath)) {
      throw "A repository with the specified name already exists, please select another and try again.";
    } else {
      try {
        let algorithm = "aes-256-cbc";
        let iv = randomBytes(16);
        let keyCryptor = new Cryptor(options.primaryKey, iv, algorithm);

        // since we are creating a new repo, we generate a key on the fly:
        let payloadKey = randomBytes(32).toString("hex");
        let payloadCryptor = new Cryptor(payloadKey, iv, algorithm);

        // This may seem a bit convoluted, but the idea is that in the future, multiple users
        // could have multiple keys to access a specified repo. The primary key is "double encrypted",
        // but more keyring entries might be added/updated using the same.
        await fs.promises.writeFile(
          storagePath,
          JSON.stringify(
            {
              version: 1,
              algorithm,
              iv: iv.toString("hex"),
              keys: [
                {
                  name: "primary",
                  key: await keyCryptor.EncryptString(payloadKey),
                },
              ],
              type: options.type,
              payload: await payloadCryptor.EncryptString(
                JSON.stringify(options.config)
              ),
            },
            null,
            "  "
          )
        );
      } catch (err) {
        stdout.write(JSON.stringify(err));
        throw "Unable to store the config, the error has been logged, please try again later.";
      }
    }
  }
}

/** The structure for the configuration file stored to disk */
interface CryptedFile {
  /** For future use, if the semantics of storing the files changes,
   * the version will indicate what decoding algorithm/semantics to use
   * to decode existing configs. */
  version: 1;
  /** The IV used for encrypting the keys and payload. (A buffer stored as 'hex') */
  iv: string;
  /** The algorithm used for encrypting the keys and the payload. (e.g. 'aes-256-cbc')*/
  algorithm: string;
  /** The actual encrypted configuration (JSON that is encrypted to a buffer and seralized as 'hex') */
  payload: string;
  /** An array of keys that can be used to decrypt the payload. Each of these have a name, and the 'key'
   * property is encrypted using an access key that is provided by the user to unlock the repo. It's an array
   * to support the rotation or addtion of keys for multiple users to be able to unlock a repo. */
  keys: KeyRingEntry[];
  /**
   * The type of repo (s3, local, rest, rclone, azure, etc..)
   */
  type: string;
}

/**
 * A named key that can be used to decrypt the repo.
 * The key to decode the key here is provided by the user when they unlock a repo.
 * This essentially ensures that no secrets are ever stored in plain text on the file system.
 */
interface KeyRingEntry {
  /** A display name for the key */
  name: string;
  /** A encryption key that is generated when a config is created, it is encrypted using a key supplied by the user during
   * repo creation, and then it is stored in this property as a buffer serialized to 'hex'. */
  key: string;
}

/** Basic file information. */
export interface FileStat {
  isDirectory: boolean;
  /** Access time */
  atime: Date;
  /** Modification time */
  mtime: Date;
  /** Creation time */
  ctime: Date;
  /** The number of bytes (or null if unknown.) */
  size: number | null;
  /** Name of this node */
  name: string;
  /** The parent directory for this node. */
  parent: string;
}

export interface CreateRepoRequest {
  /** The main access key that will be used to decrypt the configuration file when the repo is accessed. */
  primaryKey: string;
  /** The config that should be stored. This will be encrypted before being written to disk. */
  config: Map<string, string>;
  /** The type of repo (e.g. s3, local, rest, rclone, azure, gs, swift, etc.) */
  type: string;
  /** The name that will be used to identify this config on disk and in the interface. */
  name: string;
}
