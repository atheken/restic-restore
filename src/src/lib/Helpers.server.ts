import type { Cookies } from "@sveltejs/kit";
import { AuthCookieHandler } from "./AuthCookieHandler";
import Restic from "./Restic";
import { base } from "$app/paths";

export async function AuthorizeAccess(
  repo: string,
  cookies: Cookies,
  pathname: string
): Promise<{
  success: boolean;
  key?: string;
  redirect?: string;
}> {
  try {
    let cookie = cookies.get(`repoKey.${repo}`) || "";
    let key = await AuthCookieHandler.Decrypt(cookie);
    return { success: await Restic.ValidateKey(repo, key), key };
  } catch {
    let params = new URLSearchParams({ returnPath: pathname });
    return { success: false, redirect: `${base}/app/auth/${repo}?${params}` };
  }
}
