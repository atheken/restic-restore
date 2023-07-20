import Restic, { type CreateRepoRequest } from "$lib/Restic";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(req: RequestEvent) {
  let payload = (await req.request.json()) as CreateRepoRequest;

  try {
    await Restic.SaveRepo(payload);
    return json({
      success: true,
    });
  } catch (err) {
    return json({ success: false, err }, { status: 400 });
  }
}
