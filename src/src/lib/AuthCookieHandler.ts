import { randomBytes } from "crypto";
import { Cryptor } from "./Cryptor";

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
