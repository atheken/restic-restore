import { randomBytes } from "crypto";
import { Cryptor } from "./Cryptor";

/**
 * Handles auth cookies that contain unlock keys that will be used when accessing repos.
 *
 * This handler, by design, will use new IVs and Encryption Keys whenever the process is recreated. This is a trade-off that means that
 * cookies may need to be reauthenticated during a user's session if the process where to be restarted. However, this also means that
 * a cookie that was stolen has a limited lifetime and restarting the service invalidates all existing sessions. Since there is no secret configured
 * on the server, it would require compromising the javascript code to be able to decode the access key that is provided by the user
 * (and only then, only during reauthentication).
 */
export class AuthCookieHandler {
  private static IV = randomBytes(16);
  private static SessionKey = randomBytes(56).toString("hex");

  public static async Decrypt(cookieValue: string): Promise<string> {
    return await new Cryptor(
      this.SessionKey,
      this.IV,
      "aes-256-cbc"
    ).DecryptString(cookieValue);
  }

  public static async Encrypt(cookieValue: string): Promise<string> {
    return await new Cryptor(
      this.SessionKey,
      this.IV,
      "aes-256-cbc"
    ).EncryptString(cookieValue);
  }
}
