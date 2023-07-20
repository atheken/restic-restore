import Restic from "$lib/Restic";
import { Readable } from "stream";
import { parse } from "cookie";

interface reqStruct {
  params: {
    repoid: string;
    type: "dir" | "file";
    path: string;
  };
  request: {
    headers: Headers;
  };
}

export async function GET(req: reqStruct): Promise<Response> {
  let { repoid, path, type } = req.params;
  let key = parse(req.request.headers.get("Cookie") || "")[`repoKey.${repoid}`];

  let repo = await Restic.Access(repoid, key);

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

  let stream = await repo.StreamPath(path.toString(), type, "tar.gz");
  let rs = Readable.toWeb(stream) as ReadableStream;

  let res = new Response(rs);

  res.headers.set(
    "Content-Disposition",
    `attachment;filename="${attachmentName}"`
  );
  res.headers.set("Content-Type", contentType);

  return res;
}
