export const TOKEN_DECIMALS = Number(import.meta.env.VITE_TOKEN_DECIMALS ?? 12);

export function formatAmountFromBaseUnits(
  quantity: string | bigint,
  decimals: number = TOKEN_DECIMALS
): string {
  const q = typeof quantity === "bigint" ? quantity : BigInt(quantity || 0);
  const isNegative = q < 0n;
  const abs = isNegative ? -q : q;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const fraction = abs % base;
  const fractionStr = fraction.toString().padStart(decimals, "0");

  // Convert to number and format with 2 decimal places
  const numValue = Number(`${whole}.${fractionStr}`) * (isNegative ? -1 : 1);
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    n
  );
}

export function formatDateShort(tsMs: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(tsMs);
}

export function startOfISOWeek(tsMs: number): number {
  const d = new Date(tsMs);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}
