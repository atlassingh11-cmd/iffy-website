import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const budgetBytes = 180 * 1024;
const html = readFileSync(new URL("../out/index.html", import.meta.url), "utf8");
const scriptTags = [
  ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi),
];
const legacyScriptSources = scriptTags
  .filter((match) => /\bnomodule\b/i.test(match[0]))
  .map((match) => match[1]);
const scriptSources = scriptTags
  .filter((match) => !/\bnomodule\b/i.test(match[0]))
  .map((match) => match[1]);

const assets = scriptSources.map((source) => {
  const path = new URL(`../out${source.split("?")[0]}`, import.meta.url);
  return { source, gzipBytes: gzipSync(readFileSync(path)).length };
});
const totalBytes = assets.reduce((sum, asset) => sum + asset.gzipBytes, 0);

for (const asset of assets) {
  console.log(`${asset.gzipBytes}\t${asset.source}`);
}
console.log(`Initial homepage script gzip: ${totalBytes} bytes`);
if (legacyScriptSources.length > 0) {
  console.log(
    `Excluded ${legacyScriptSources.length} legacy nomodule fallback from the modern-browser initial budget.`,
  );
}

if (totalBytes > budgetBytes) {
  console.error(
    `Homepage script budget exceeded: ${totalBytes} > ${budgetBytes} bytes.`,
  );
  process.exitCode = 1;
}
