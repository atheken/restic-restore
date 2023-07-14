import url from "url";

export function GET(req) {
  let out = url.resolve(req.url.toString(), "./app");
  return Response.redirect(out, 302);
}
