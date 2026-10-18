// Post-build checks: internal links/assets resolve, every sponsored link has
// rel="sponsored noopener", every page has the footer disclaimer, and page sizes.
// Usage: npm run build && npm run check   (add --external to also HEAD-check external links)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../_site/", import.meta.url).pathname;
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); } })(root);
const html = files.filter((f) => f.endsWith(".html"));
const siteUrl = (process.env.SITE_URL || "https://pcstoscott.pages.dev").replace(/\/$/, "");
const prefix = ("/" + (process.env.PATH_PREFIX || "/") + "/").replace(/\/+/g, "/");
let errors = 0, external = new Set();
const fail = (m) => { errors++; console.error("ERROR", m); };

for (const f of html) {
  const s = readFileSync(f, "utf8"), rel = relative(root, f);
  if (!s.includes("not affiliated with or endorsed by the U.S. Air Force")) fail(`${rel}: footer disclaimer missing`);
  for (const m of s.matchAll(/<(a|link|img|script)\b[^>]*?\s(?:href|src)="([^"]+)"[^>]*>/g)) {
    const url = m[2];
    if (/^(mailto:|tel:|#|data:)/.test(url)) continue;
    if (/^https?:\/\//.test(url)) { if (!url.startsWith(siteUrl)) external.add(url); continue; }
    let clean = decodeURI(url.split("#")[0].split("?")[0]);
    if (prefix !== "/" && clean.startsWith(prefix)) clean = "/" + clean.slice(prefix.length);
    let target = join(root, clean);
    if (clean.endsWith("/")) target = join(target, "index.html");
    if (!existsSync(target)) fail(`${rel}: broken internal link ${url}`);
  }
  // Any anchor inside a sponsor element or marked data-sponsored must carry rel="sponsored noopener".
  for (const m of s.matchAll(/<a\b[^>]*\bdata-sponsored\b[^>]*>/g)) if (!/rel="sponsored noopener"/.test(m[0])) fail(`${rel}: sponsored link without rel: ${m[0]}`);
  for (const blk of s.matchAll(/<(aside|li) class="(sponsor[^"]*)"[\s\S]*?<\/\1>/g))
    if (!blk[2].includes("sponsor--empty")) for (const a of blk[0].matchAll(/<a\b[^>]*>/g)) if (!/rel="sponsored noopener"/.test(a[0])) fail(`${rel}: paid placement link without rel: ${a[0]}`);
}

if (process.argv.includes("--external")) {
  for (const u of external) {
    try {
      const r = await fetch(u, { method: "GET", redirect: "follow", headers: { "user-agent": "Mozilla/5.0 link-check" }, signal: AbortSignal.timeout(15000) });
      console.log(r.ok ? "ok " : "WARN", r.status, u);
    } catch (e) { console.log("WARN ERR", u, e.message); }
  }
}

console.log("\nPage sizes (uncompressed HTML):");
for (const f of html) console.log(`  ${(statSync(f).size / 1024).toFixed(1).padStart(6)} KB  ${relative(root, f)}`);
const css = files.filter((f) => f.endsWith(".css"));
for (const f of css) console.log(`  ${(statSync(f).size / 1024).toFixed(1).padStart(6)} KB  ${relative(root, f)}`);
console.log(`\n${html.length} pages, ${external.size} unique external links, ${errors} error(s).`);
process.exit(errors ? 1 : 0);
