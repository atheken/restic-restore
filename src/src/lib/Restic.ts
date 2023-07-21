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
  private static mountPath: string =
    process.env?.RESTIC_MOUNT_DIR || "/tmp/restic-mount/";
  private static repos = new Map<string, Restic>();
  private mountedProcess = false;
  private configPath: string;
  private basePath = `${Restic.mountPath}${randomUUID()}`;
  repoId: string;
  private loadedConfig: Promise<{ type: string; env: Record<string, string> }>;

  static async ListRepos(): Promise<Repo[]> {
    let readdir = promisify(fs.readdir);
    let files = await readdir(Restic.basepath);

    return files.map((k) => {
      return { Id: k } as Repo;
    });
  }

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

    this.loadedConfig = Restic.DecodeRepo(repoId, key);
  }

  private ensureConfig() {
    if (!fs.existsSync(this.configPath))
      throw `The specified repo '${this.repoId}' does not exist.`;
  }

  private async mount() {
    if (!this.mountedProcess) {
      await fs.promises.mkdir(this.basePath, { recursive: true });

      //listen for files in the specified path.

      this.mountedProcess = true;

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
      });

      let handleProcessExit = () => {
        if (this.mountedProcess) p.kill("SIGINT");
      };

      process.on("SIGINT", handleProcessExit);

      p.on("error", () => {
        p.stdout.pipe(process.stdout);
        p.stderr.pipe(process.stderr);
        this.mountedProcess = false;
      }).on("exit", () => {
        this.mountedProcess = false;
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
        } while (this.mountedProcess);
        rej(
          `The repository '${this.repoId}' did not mount before restic exited. This can happen if the browser session ends prematurely, or there a configuration error.`
        );
      });

      await filesAvailable;
    }
  }

  async List(path: string = ""): Promise<FileStat[]> {
    await this.mount();
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

  async StreamPath(
    path: string,
    type: "dir" | "file",
    archiveType: "tar" | "tar.gz" | "zip" = "tar.gz"
  ): Promise<Readable> {
    let task: ChildProcessWithoutNullStreams;

    if (type == "dir") {
      task = spawn("/bin/tar", ["-cz", path], {
        stdio: "pipe",
        cwd: this.basePath,
      });
    } else {
      task = spawn("/bin/cat", [path], {
        stdio: "pipe",
        cwd: this.basePath,
      });
    }

    return task.stdout;
  }

  static async ValidateKey(repo: string, key: string): Promise<boolean> {
    try {
      let result = await this.DecodeRepo(repo, key);
      return true;
    } catch (err) {
      return false;
    }
  }

  private static async DecodeRepo(
    name: string,
    key: string
  ): Promise<{ type: string; env: Record<string, string> }> {
    let storagePath = join(Restic.basepath, name);
    if (!fs.existsSync(storagePath)) {
      throw "The repo specified does not exist. Please check to make sure the configuration is still available.";
    } else {
      try {
        let file = JSON.parse(
          await fs.promises.readFile(storagePath, "utf8")
        ) as CryptedFile;

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
        throw "The specified key cannot unlock the repo.";
      } catch (err) {
        throw err;
      }
    }
  }

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

interface CryptedFile {
  version: 1;
  iv: string;
  algorithm: string;
  payload: string;
  keys: KeyRingEntry[];
  type: string;
}

interface KeyRingEntry {
  name: string;
  key: string;
}

export interface FileStat {
  isDirectory: boolean;
  atime: Date;
  mtime: Date;
  ctime: Date;
  size: number;
  name: string;
  parent: string;
}

export interface CreateRepoRequest {
  primaryKey: string;
  config: Map<string, string>;
  type: string;
  name: string;
}
