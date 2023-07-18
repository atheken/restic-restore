import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(req: RequestEvent) {
  let payload = await req.request.json();
  console.log(payload);
  return json({
    success: true,
  });
}
