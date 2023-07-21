import { text } from "@sveltejs/kit";

export async function GET() {
  return text(process.env?.VERSION || "unknown");
}
