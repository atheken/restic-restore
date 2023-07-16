import Restic from "$lib/restic";
import { Readable } from "stream";

interface paramsStruct {
  params: {
    repoid: string;
    type: "dir" | "file";
    path: string;
  };
}

export async function GET(params: paramsStruct): Promise<Response> {
  let { repoid, path, type } = params.params;

  let repo = new Restic(repoid);

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
