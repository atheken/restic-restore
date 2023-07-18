import { promisify } from "util";
import fs from "fs";
import type Repo from "./models/repo";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import { createCipheriv, createHash, randomBytes, randomUUID } from "crypto";
import path, { join } from "path";
import type { Readable } from "node:stream";

export default class Restic {
  private static basepath = process.env?.CONFIG_PATH || "/configs";
  private static cacheDir: string = process.env?.RESTIC_CACHE_DIR || "";
  private static mountPath: string =
    process.env?.RESTIC_MOUNT_DIR || "/tmp/restic-mount/";
  private static repos = new Map<string, Restic>();
  private mountedProcess = false;
  private configPath: string;
  private basePath = `${Restic.mountPath}${randomUUID()}`;
  repoId: string;

  static async ListRepos(): Promise<Repo[]> {
    let readdir = promisify(fs.readdir);
    let files = await readdir(Restic.basepath);

    return files.map((k) => {
      return { Id: k } as Repo;
    });
  }

  static async Access(repoId: string): Promise<Restic> {
    let repo = Restic.repos.get(repoId);
    if (!repo) {
      repo = new this(repoId);
      Restic.repos.set(repoId, repo);
    }
    return repo;
  }

  private constructor(repoId: string) {
    this.repoId = repoId;
    this.configPath = path.join(Restic.basepath, repoId);
    this.ensureConfig();
  }

  private ensureConfig() {
    if (!fs.existsSync(this.configPath))
      throw `The specified repo '${this.repoId}' does not exist.`;
  }

  private async loadConfig(): Promise<NodeJS.ProcessEnv> {
    this.ensureConfig();
    let read = promisify(fs.readFile);

    let env = JSON.parse(
      await read(this.configPath, "utf-8")
    ) as NodeJS.ProcessEnv;

    if (Restic.cacheDir) {
      env["RESTIC_CACHE_DIR"] = Restic.cacheDir;
      env["PATH"] = process.env.PATH;
    }
    return env;
  }

  private async mount() {
    if (!this.mountedProcess) {
      await fs.promises.mkdir(this.basePath, { recursive: true });

      //listen for files in the specified path.

      this.mountedProcess = true;

      let p = spawn("restic", ["mount", "--no-lock", this.basePath], {
        env: (await this.loadConfig()) as NodeJS.ProcessEnv,
      });

      process.on("SIGINT", () => {
        if (this.mountedProcess) p.kill("SIGINT");
      });

      p.on("error", () => {
        this.mountedProcess = false;
      }).on("exit", () => {
        this.mountedProcess = false;
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
          "The process is no longer mounted, and base files were never visible."
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

  static Key: Promise<Buffer> = new Promise(async (res, rej) => {
    let h = createHash("shake256", { outputLength: 32 });
    let content = process.env.RESTORE_SAVE_KEY || "";
    if (process.env.RESTORE_SAVE_KEY_FILE || "" != "") {
      content = await fs.promises.readFile(
        process.env.RESTORE_SAVE_KEY_FILE!,
        "utf8"
      );
    }

    if (content.length > 0) {
      let key = h.update(content);
      res(key.digest());
    }

    rej(
      "You must provide a key when launching this process in order to encrypt and decrypt the config files that " +
        "are stored on disk. You may use `RESTORE_SAVE_KEY_FILE` or `RESTORE_SAVE_KEY` for this purpose, depending on how your secrets are managed."
    );
  });

  static async SaveRepo(name: string, config: Map<string, string>) {
    let storagePath = join(Restic.basepath, name);
    if (fs.existsSync(storagePath)) {
      throw "A repository with the specified name already exists, please select another and try again.";
    } else {
      try {
        let key = await Restic.Key;
        let iv = randomBytes(16);
        let algorithm = "aes-256-cbc";
        let cipher = createCipheriv(algorithm, key, iv);

        fs.createWriteStream(storagePath);
        let data = cipher.update(JSON.stringify(config), "utf8", "hex");
        data += cipher.final();

        await fs.promises.writeFile(
          storagePath,
          JSON.stringify({ iv: iv.toString("hex"), algorithm, payload: data })
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
}

interface CryptedFile {
  iv: string;
  algorithm: string;
  payload: string;
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
