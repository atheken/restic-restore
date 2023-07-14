import Restic from "$lib/restic";
import { json } from "@sveltejs/kit";

export async function GET({
  params: { repoid, snapshotid },
}): Promise<Response> {
  let repo = new Restic(repoid);
  return json(await repo.Snapshot(snapshotid));
}
