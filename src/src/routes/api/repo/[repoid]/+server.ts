import { json } from "@sveltejs/kit";
import Restic from "$lib/restic";

export async function GET({ params }): Promise<Response> {
  let repo = new Restic(params.repoid);
  try {
    return json(await repo.ListSnapshots());
  } catch (err) {
    return json({ error: true, err }, { status: 503 });
  }
}
