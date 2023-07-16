import { promisify } from "util";
import fs from "fs";
import type Repo from "./models/repo";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import { randomUUID } from "crypto";
import { join } from "path";
import type { Readable } from "node:stream";

export default class Restic {
  private static basepath = process.env?.CONFIG_PATH || "/configs";
  private static cacheDir: string = process.env?.RESTIC_CACHE_DIR || "";
  private static mountPath: string =
    process.env?.RESTIC_MOUNT_DIR || "/tmp/restic-mount/";
  private static repos = new Map<string, Restic>();
  private mountProcess?: ChildProcessWithoutNullStreams;
  private configPath: string;
  private basePath = `${Restic.mountPath}${randomUUID()}`;

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

  constructor(configPath: string) {
    this.configPath = Restic.basepath + "/" + configPath;
  }

  private async loadConfig(): Promise<NodeJS.ProcessEnv> {
    let read = promisify(fs.readFile);

    let config = await read(this.configPath, "utf-8");

    let env: NodeJS.ProcessEnv = {};

    config
      .split("\n")
      .filter((k) => k.trim() != "" && !k.startsWith("#"))
      .forEach((f) => {
        let arg = f.split("=");
        env[arg[0]] = arg[1].replace(/(^["']+)|(["']+$)/g, "");
      });

    if (Restic.cacheDir) {
      env["RESTIC_CACHE_DIR"] = Restic.cacheDir;
      env["PATH"] = process.env.PATH;
    }

    return env;
  }

  private async mount() {
    if (!this.mountProcess) {
      await fs.promises.mkdir(this.basePath, { recursive: true });

      //listen for files in the specified path.
      let filesAvailable = new Promise(async (res, rej) => {
        let sleep = promisify(setTimeout);
        do {
          let results = await fs.promises.readdir(this.basePath);
          if (results.length > 0) {
            res(null);
            break;
          }
          await sleep(1000);
        } while (true);
      });

      let proc = spawn("restic", ["mount", this.basePath], {
        env: (await this.loadConfig()) as NodeJS.ProcessEnv,
      });

      await Promise.any([this.mountProcess, filesAvailable]);

      if (proc.exitCode || 0 !== 0) {
        throw "The mount process failed, and we therefore do not have files to show.";
      }
      this.mountProcess = proc;
    }
  }

  async Close() {
    this.mountProcess?.kill("SIGINT");
    this.mountProcess = undefined;
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
          parent: lspath,
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
      task = spawn("/bin/tar", ["-cz", join(this.basePath, path)], {
        stdio: "pipe",
      });
    } else {
      task = spawn("/bin/cat", [join(this.basePath, path)], {
        stdio: "pipe",
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
