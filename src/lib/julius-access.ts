import { createHash, scrypt, timingSafeEqual } from "node:crypto";

export const JULIUS_PATH = "/work/julius-design-system";
export const JULIUS_UNLOCK_PATH = "/work/julius-unlock";
export const JULIUS_COOKIE = "julius-access";

// Only a salted, slow password-derived token's hash is stored in source.
// The verifier itself cannot be used as an access cookie.
const salt = "36dd8608fc3e4a92366ff0269c925c49";
const verifier = Buffer.from("35836e59d12152d2d2f7f1c48ff68fbb4749119c20334dc365e709acf04dc388", "hex");

export function hasJuliusAccess(token: string | undefined): boolean {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return timingSafeEqual(createHash("sha256").update(token).digest(), verifier);
}

export async function unlockJulius(password: string): Promise<string | null> {
  if (!password || password.length > 256) return null;
  const token = await new Promise<string>((resolve, reject) => {
    scrypt(password, salt, 32, (error, key) => {
      if (error) reject(error);
      else resolve(key.toString("hex"));
    });
  });
  return hasJuliusAccess(token) ? token : null;
}

export function isJuliusAsset(pathname: string): boolean {
  return pathname === "/projects/julius-design-system" || pathname.startsWith("/projects/julius-design-system/");
}
