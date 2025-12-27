import crypto from 'crypto';

export async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
  const verifyAlgorithm = "sha256";
  const hmac = crypto.createHmac(verifyAlgorithm, secret);
  const digest = Buffer.from(
    `${verifyAlgorithm}=${hmac.update(body).digest("hex")}`,
    "utf8"
  );
  const checksum = Buffer.from(signature, "utf8");

  if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
    return false;
  }
  return true;
}