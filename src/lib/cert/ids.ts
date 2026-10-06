import { createHash } from "crypto";

export function stableUserId(username: string) {
  const hex = createHash("sha256")
    .update(`skyhoist-cert-user:${username.toLowerCase()}`)
    .digest("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}
