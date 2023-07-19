import Restic from "$lib/Restic";
import { json } from "@sveltejs/kit";

export async function GET({ params: { repoid, path } }) {
  let restic = await Restic.Access(repoid);
  return json(await restic.List(path));
}
