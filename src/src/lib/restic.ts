import { promisify } from "util";
import fs from "fs";
import type Repo from "./models/repo";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import { randomUUID } from "crypto";
import { join } from "path";

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

    let env = {};

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

      this.mountProcess = spawn("restic", ["mount", this.basePath], {
        env: await this.loadConfig(),
      });

      let readMessage =
        "When finished, quit with Ctrl-c here or umount the mountpoint.";
    }
  }

  async List(path: string = ""): Promise<FileStat[]> {
    await this.mount();
    let lspath = join(this.basePath, path, "/");
    let results = await fs.promises.readdir(lspath);
    return (
      await Promise.all(
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
      )
    ).sort((l, r) => r.mtime.getTime() - l.mtime.getTime());
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
