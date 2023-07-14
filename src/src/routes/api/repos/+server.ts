import { json, type RequestEvent } from "@sveltejs/kit";
import Restic from "$lib/restic";

export async function GET(): Promise<Response> {
  return json(await Restic.ListRepos());
}
