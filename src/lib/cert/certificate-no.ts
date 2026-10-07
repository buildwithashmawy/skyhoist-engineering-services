/**
 * Pick the next certificate number by incrementing the highest trailing
 * numeric sequence among existing numbers (preserving prefix + zero padding).
 */
export function nextCertificateNo(existing: string[]): string {
  const occupied = new Set(
    existing.map((n) => n.trim().toLowerCase()).filter(Boolean),
  );

  let best: { prefix: string; num: number; width: number } | null = null;
  for (const raw of existing) {
    const value = raw.trim();
    const match = /^(.*?)(\d+)$/.exec(value);
    if (!match) continue;
    const prefix = match[1] ?? "";
    const digits = match[2] ?? "0";
    const num = Number.parseInt(digits, 10);
    if (!Number.isFinite(num)) continue;
    if (!best || num > best.num) {
      best = { prefix, num, width: digits.length };
    }
  }

  if (!best) {
    let n = 1;
    while (occupied.has(String(n))) n += 1;
    return String(n);
  }

  let next = best.num + 1;
  for (;;) {
    const body =
      String(next).length > best.width
        ? String(next)
        : String(next).padStart(best.width, "0");
    const proposed = `${best.prefix}${body}`;
    if (!occupied.has(proposed.toLowerCase())) return proposed;
    next += 1;
  }
}
