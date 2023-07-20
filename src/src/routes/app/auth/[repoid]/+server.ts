import { AuthCookieHandler } from "$lib/AuthCookieHandler";
import Restic from "$lib/Restic.js";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(req: RequestEvent): Promise<Response> {
  let {
    params: { repoid },
    request,
  } = req;

  let values = (await request.json()) as {
    key: string;
    redirect: string | null;
  };

  let cookie = [
    `repoKey.${repoid}=${await AuthCookieHandler.Encrypt(values.key)}`,
    "HttpOnly",
    "secure",
    "path=/",
    "Expires=0", // Set to a session cookie (expires when the browser is closed)
    "SameSite=strict",
  ].join(";");

  if (await Restic.ValidateKey(repoid!, values.key)) {
    return json(
      { success: true },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } else {
    return json(
      {
        success: false,
        message: "The specified key is not valid for the given repository.",
      },
      { status: 403 }
    );
  }
}
