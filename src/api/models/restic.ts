import type Snapshot from "./snapshot";
import fs from "fs";
import type Repo from "./repo";
import { exec } from "child_process";
import { promisify } from "util";
import { Stream } from "stream";
import FileResult from "./fileResult";

export default class Restic {
  private static basepath = process.env?.CONFIG_PATH || "/configs";

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

    config.split("\n").forEach((f) => {
      let arg = f.split("=");
      env[arg[0]] = arg[1].replace(/(^["']+)|(["']+$)/g, "");
    });

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
        `restic ${command} ${snapshotId} ${args} --json --no-lock -o s3.connections=100 -o b2.connections=100`,
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
    return await this.queryRestic<Snapshot>("snapshots");
  }

  async Snapshot(snapshotid: string): Promise<Snapshot> {
    return (await this.queryRestic<Snapshot>("snapshots", snapshotid)).pop();
  }

  async ListFilesForSnapshot(
    snapshotId: string,
    path: string | undefined = null
  ): Promise<FileResult[]> {
    let paths = [];
    if (!path) {
      paths = (await this.Snapshot(snapshotId)).paths;
    } else {
      paths = [path];
    }

    let results = [];

    for (var p of paths) {
      results = results.concat(
        await this.queryRestic<FileResult>("ls", snapshotId, p)
      );
    }

    return results;
  }

  async ExtractStream(snapshotId: string, path: string): Promise<Stream> {
    throw "Restore not available";
  }

  private async RestorePath<T>(
    snapshotid: string,
    path: string
  ): Promise<ReadableStream> {
    throw "not implemented";
  }
}
