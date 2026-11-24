import { isAxiosError } from "axios";

export { cn } from "cn";

// PARSERS
type ParsedUserAgent = {
  browser: string;
  os: string;
};

type Rule = readonly [name: string, pattern: RegExp];

// Order matters: many browsers include "Chrome" and "Safari" in their UA,
// so the more specific tokens must be checked first.
const BROWSERS: readonly Rule[] = [
  ["Edge", /Edg(?:e|A|iOS)?\//],
  ["Opera", /OPR\/|Opera/],
  ["Firefox", /Firefox\/|FxiOS\//],
  ["Chrome", /Chrome\/|CriOS\//],
  ["Safari", /Safari\//],
];

// Android UAs contain "Linux", and iOS UAs contain "like Mac OS X",
// so those are checked before Linux and macOS.
const SYSTEMS: readonly Rule[] = [
  ["Windows", /Windows NT/],
  ["Android", /Android/],
  ["iOS", /iPhone|iPad|iPod/],
  ["macOS", /Macintosh|Mac OS X/],
  ["Chrome OS", /CrOS/],
  ["Linux", /Linux|X11/],
];

function findMatch(rules: readonly Rule[], ua: string): string {
  for (const [name, pattern] of rules) {
    if (pattern.test(ua)) return name;
  }
  return "Unknown";
}

export function parseUserAgent(userAgent?: string | null): ParsedUserAgent {
  const ua = userAgent ?? "";
  return {
    browser: findMatch(BROWSERS, ua),
    os: findMatch(SYSTEMS, ua),
  };
}

// FORMATTERS
// Decimal formatting stays entirely in string space to avoid losing precision.
export function formatDecimal(value: string): string {
  const match = value.trim().match(/^([+-]?)(\d+)(?:\.(\d*))?$/);
  if (!match) return value;

  const [, sign, whole, fraction = ""] = match;
  const padded = `${fraction}0000`;
  let thousandths = Number(`${whole}${padded.slice(0, 3)}`);
  if (padded[3] >= "5") thousandths += 1;

  const formattedWhole = String(Math.floor(thousandths / 1000));
  const formattedFraction = String(thousandths % 1000).padStart(3, "0");
  const isZero = thousandths === 0;
  return `${sign === "-" && !isZero ? "-" : ""}${formattedWhole}.${formattedFraction}`;
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.error ?? "Operation failed. Please try again later."
    );
  }
  return "Operation failed. Please try again later.";
}
