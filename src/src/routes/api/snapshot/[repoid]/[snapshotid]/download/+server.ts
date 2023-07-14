import Restic from "$lib/restic";
import type { RequestEvent } from "@sveltejs/kit";

let ev: RequestEvent;

export async function GET({
  params: { repoid, snapshotid },
  url: { searchParams },
}): Promise<Response> {
  let repo = new Restic(repoid);

  let path = searchParams.get("path")!;
  let type = searchParams.get("type")!;

  let name = path.split("/").pop();

  let contentType = "application/octet-stream";

  if (type == "dir") {
    name += ".tar";
    contentType = "application/tar";
  }

  let attachmentName = `${snapshotid.substring(0, 6)}-${crypto
    .randomUUID()
    .toString()
    .substring(0, 6)}-${name}`;

  throw "not implemented.";
  //let res = new Response(await repo.ExtractStream(snapshotid, path!.toString()));

  //   res.headers.set(
  //     "Content-Disposition",
  //     `attachment;filename="${attachmentName}"`
  //   );
  //   res.headers.set("Content-Type", contentType);

  //   return res;
}
