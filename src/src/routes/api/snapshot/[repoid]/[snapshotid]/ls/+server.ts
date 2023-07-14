import Restic from "$lib/restic";
import { json } from "@sveltejs/kit";

export async function GET({
  params: { snapshotid, repoid },
  url: { searchParams },
}): Promise<Response> {
  let repo = new Restic(repoid);
  let path = searchParams.get("path");

  return json(await repo.ListFilesForSnapshot(snapshotid, path));
}
