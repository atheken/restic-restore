import { promisify } from "util";
import fs from "fs";
import type Repo from "./models/repo";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import { randomUUID } from "crypto";
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
