import { AuthorizeAccess } from "$lib/Helpers.server";
import Restic from "$lib/Restic";
import { json, text } from "@sveltejs/kit";

export async function GET({ params: { repoid, path }, url, cookies }) {
  try {
    let auth = await AuthorizeAccess(repoid, cookies, url.pathname);
    if (auth.success) {
      let restic = await Restic.Access(repoid, auth.key!);
      return json(await restic.List(path));
    } else {
      return text(auth.redirect!, { status: 403 });
    }
  } catch (err) {
    return json(
      {
        success: false,
        message:
          "There was an error while attemping to list the files, please verify your authentication and try again.",
      },
      { status: 503 }
    );
  }
}
