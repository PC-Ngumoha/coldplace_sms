export { cn } from "cn";

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
