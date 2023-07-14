import type FileResult from "./models/fileResult";
import type Repo from "./models/repo";
import type Snapshot from "./models/snapshot";

async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit | undefined = undefined
): Promise<T> {
  let res = await fetch(input, init);
  if (res.ok) {
    return (await res).json() as T;
  } else {
    throw new Error(await (await res).text());
  }
}

export default class ApiClient {
  static async Repos(): Promise<Repo[]> {
    return await fetchJson<Repo[]>("/api/repos");
  }

  static async Snapshots(repoId: string): Promise<Snapshot[]> {
    return await fetchJson<Snapshot[]>(`/api/repo/${repoId}`);
  }

  static async Snapshot(repoId: string, snapshotId: string): Promise<Snapshot> {
    return await fetchJson<Snapshot>(
      `/api/snapshot/${repoId}/${snapshotId}/info`
    );
  }

  static async FileList(
    repoId: string,
    snapshotId: string,
    path: string | undefined | null = null
  ): Promise<FileResult[]> {
    var search = new URLSearchParams({ path: path || "" });
    return await fetchJson<FileResult[]>(
      `/api/snapshot/${repoId}/${snapshotId}/ls?${search}`
    );
  }
}
