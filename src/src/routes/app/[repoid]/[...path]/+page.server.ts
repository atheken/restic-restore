import Restic from "$lib/Restic";
import { parse } from "cookie";

export async function load({ params, request: { headers } }) {
  let key = parse(headers.get("Cookie") || "")[`repoKey.${params.repoid}`];

  // we should handle urlencoded parts...
  let path = params.path.split("/").filter((l) => l.trim() != "");
  let restic = await Restic.Access(params.repoid, key);

  return { files: restic.List(path.join("/")) };
}
