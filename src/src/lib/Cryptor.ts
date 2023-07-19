import { createCipheriv, createDecipheriv, createHash } from "node:crypto";

export class Cryptor {
  private algorithm: string;
  private iv: Buffer;
  private key: Buffer;

  constructor(key: string, iv: string | Buffer, algorithm: string) {
    this.algorithm = algorithm;
    let h = createHash("shake256", { outputLength: 32 });
    let hash = h.update(key);
    this.key = hash.digest();
    if (iv instanceof Buffer) {
      this.iv = iv;
    } else {
      this.iv = Buffer.from(iv, "hex");
    }
  }

  async EncryptString(data: string): Promise<string> {
    let cipher = createCipheriv(this.algorithm, this.key, this.iv);
    let content = cipher.update(Buffer.from(data, "utf8"));
    return Buffer.concat([content, cipher.final()]).toString("hex");
  }

  async DecryptString(data: string): Promise<string> {
    let cipher = createDecipheriv(this.algorithm, this.key, this.iv);
    let content = cipher.update(Buffer.from(data, "hex"));
    return Buffer.concat([content, cipher.final()]).toString("utf8");
  }
}
