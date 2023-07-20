import { AuthorizeAccess } from "$lib/Helpers.server";
import Restic from "$lib/Restic";
import { json, text } from "@sveltejs/kit";

export async function GET({ params: { repoid, path }, url, cookies }) {
  let auth = await AuthorizeAccess(repoid, cookies, url.pathname);
  if (auth.success) {
    let restic = await Restic.Access(repoid, auth.key!);
    return json(await restic.List(path));
  } else {
    return text(auth.redirect!, { status: 403 });
  }
}
