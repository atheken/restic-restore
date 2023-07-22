import Restic from "$lib/Restic";
import { Readable } from "stream";
import type { RequestEvent } from "./$types";
import { AuthorizeAccess } from "$lib/Helpers.server";
import { json } from "@sveltejs/kit";

export async function GET(req: RequestEvent): Promise<Response> {
  let {
    url: { pathname },
    cookies,
    params: { repoid, path, type },
  } = req;

  let auth = await AuthorizeAccess(repoid, cookies, pathname);
  if (!auth.success) {
    return Response.redirect(auth.redirect!, 302);
  }

  let repo = await Restic.Access(repoid, auth.key!);

  let name = path.split("/").pop();

  let contentType = "application/octet-stream";

  if (type == "dir") {
    name += ".tar.gz";
    contentType = "application/tar+gzip";
  }

  let filename = path
    .split("/")
    .filter((k) => k.trim() != "")
    .pop();

  let attachmentName = `${filename}-${crypto
    .randomUUID()
    .toString()
    .substring(0, 6)}-${name}`;

  let stream = await repo.StreamPath(
    path.toString(),
    type as "file" | "tar" | "tar.gz" | "zip"
  );
  if (stream) {
    let rs = Readable.toWeb(stream) as ReadableStream;

    let res = new Response(rs);

    res.headers.set(
      "Content-Disposition",
      `attachment;filename="${attachmentName}"`
    );
    res.headers.set("Content-Type", contentType);
    return res;
  } else {
    return json(
      { success: false, message: "The requested path does not exist." },
      { status: 404 }
    );
  }
}
