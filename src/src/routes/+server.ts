import url from "url";
import type { RequestEvent } from "./$types";

export function GET(req: RequestEvent) {
  let out = url.resolve(req.url.toString(), "./app");
  return Response.redirect(out, 302);
}

export const trailingSlash = "always";
