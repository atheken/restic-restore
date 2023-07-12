import type Snapshot from "./models/snapshot";
import fs from "fs";
import type Repo from "./models/repo";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import type { Readable } from "stream";
import type FileResult from "./models/fileResult";

export default class Restic {
  private static basepath = process.env?.CONFIG_PATH || "/configs";
  private static cacheDir: string = process.env?.RESTIC_CACHE_DIR || "";

  static async ListRepos(): Promise<Repo[]> {
    let readdir = promisify(fs.readdir);
    let files = await readdir(Restic.basepath);

    return files.map((k) => {
      return { Id: k } as Repo;
    });
  }

  configPath: string;

  constructor(configPath: string) {
    this.configPath = Restic.basepath + "/" + configPath;
  }

  async loadConfig(): Promise<NodeJS.ProcessEnv> {
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

  private async queryRestic<T>(
    command: "ls" | "snapshots",
    snapshotId: string | "" = "",
    args: string | "" = ""
  ): Promise<T[]> {
    try {
      let pexec = promisify(exec);

      let env = await this.loadConfig();

      let { stderr, stdout } = await pexec(
        `restic ${command} ${snapshotId} ${args} --json --no-lock -o s3.connections=50 -o b2.connections=50`,
        {
          env,
        }
      );
      // this is a bit of a hack because the output from the
      // restic commands is not normalized to
      // line-oriented or object-oriented, so we sniff it first.
      if (stdout.startsWith("[")) {
        return JSON.parse(stdout);
      } else {
        return stdout
          .split("\n")
          .filter((k) => k.trim() != "")
          .map((f) => JSON.parse(f));
      }
    } catch (err) {
      throw err;
    }
  }

  async ListSnapshots(): Promise<Snapshot[]> {
    return (await this.queryRestic<Snapshot>("snapshots")).reverse();
  }

  async Snapshot(snapshotid: string): Promise<Snapshot> {
    let s = await this.queryRestic<Snapshot>("snapshots", snapshotid);
    return s.pop()!;
  }

  async ListFilesForSnapshot(
    snapshotId: string,
    path: string | undefined | null = null
  ): Promise<FileResult[]> {
    if (!path) {
      path = "/";
    }

    return (await this.queryRestic<FileResult>("ls", snapshotId, path)).filter(
      (k) => k.struct_type != "snapshot"
    );
  }

  async ExtractStream(
    snapshotId: string,
    path: string,
    archiveType: "tar" | "zip" = "tar"
  ): Promise<Readable> {
    let env = await this.loadConfig();

    let proc = spawn(
      "restic",
      [
        "dump",
        "-a",
        archiveType,
        snapshotId,
        path,
        "--no-lock",
        "-o",
        "rclone.connections=50",
        "-o",
        "s3.connections=50",
        "-o",
        "b2.connections=50",
      ],
      {
        env,
      }
    );

    return proc.stdout;
  }
}
