import Restic from "$lib/Restic";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST(req: RequestEvent) {
  let payload = (await req.request.json()) as {
    name: string;
    accessKey: string;
    config: Map<string, string>;
  };

  try {
    await Restic.SaveRepo(payload.name, payload.accessKey, payload.config);
    return json({
      success: true,
    });
  } catch (err) {
    return json({ success: false, err }, { status: 400 });
  }
}
