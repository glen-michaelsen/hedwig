/**
 * Fetches every distinct page the muuv.dk redirects point at, and lists
 * any that don't answer 200. Run it against production after a merge
 * (Spotlight articles and Discover pages only exist in production's data).
 *
 * Usage: node scripts/check-muuv-targets.mjs [https://trenodo.com]
 */
import { MUUV_EXACT } from "../lib/muuv/redirects-map.mjs";

const base = (process.argv[2] ?? "https://trenodo.com").replace(/\/+$/, "");
const targets = [...new Set([...Object.values(MUUV_EXACT), "/knowledge", "/spotlight", "/tutoring", "/account/login", "/discover"])];

const failures = [];
let done = 0;
async function check(target) {
  const response = await fetch(base + target, { redirect: "follow" }).catch((error) => ({ status: String(error) }));
  if (response.status !== 200) failures.push(`${response.status}  ${target}`);
  done++;
}

// A few at a time, so a check doesn't look like a flood.
for (let i = 0; i < targets.length; i += 6) await Promise.all(targets.slice(i, i + 6).map(check));

console.log(`${done} targets checked on ${base}.`);
if (failures.length) {
  console.log(failures.join("\n"));
  process.exit(1);
}
console.log("All answer 200.");
