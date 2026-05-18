import crypto from "crypto";
export const hashSHA256 = (texto: string): string => {
  return crypto.createHash("sha256").update(texto).digest("hex");
};
