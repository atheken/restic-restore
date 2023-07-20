import Restic from "$lib/Restic";
import { parse } from "cookie";
import { json } from "@sveltejs/kit";

export async function GET({ params: { repoid, path }, request: { headers } }) {
  let key = parse(headers.get("Cookie") || "")[`repoKey.${repoid}`];
  let restic = await Restic.Access(repoid, key);
  return json(await restic.List(path));
}
