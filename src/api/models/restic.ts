import type Snapshot from "./snapshot";
import type SnapshotEntry from "./snapshotEntry";
import fs from "fs";
import type Repo from "./repo";
import { exec } from "child_process";
import { promisify } from "util";
import { Stream } from "stream";

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

  private async listSnapshots(
    snapshotId: string | null = null
  ): Promise<Snapshot[]> {
    try {
      let pexec = promisify(exec);

      let env = await this.loadConfig();

      let { stderr, stdout } = await pexec(
        `restic snapshots ${
          snapshotId || ""
        } --json --no-lock -o s3.connections=50 -o b2.connections=50`,
        {
          env,
        }
      );
      return JSON.parse(stdout);
    } catch (err) {
      throw err;
    }
  }

  async ListSnapshots(): Promise<Snapshot[]> {
    return await this.listSnapshots();
  }

  async Snapshot(snapshotid: string): Promise<Snapshot> {
    return (await this.listSnapshots(snapshotid)).pop();
  }

  async ListFilesForSnapshot(
    snapshotId: string,
    path: string | undefined
  ): Promise<SnapshotEntry[]> {
    return [];
  }

  async ExtractStream(snapshotId: string, path: string): Promise<Stream> {
    throw "Restore not available";
  }

  private async QueryRestic<T>(args: string[]): Promise<T[]> {
    return [];
  }

  private async RestorePath<T>(
    snapshotid: string,
    path: string
  ): Promise<ReadableStream> {
    throw "not implemented";
  }
}
