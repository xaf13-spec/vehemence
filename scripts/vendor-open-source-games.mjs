import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const upstream = "EaglercraftZ-Devs/EaglercraftZ-Source";
const revision = "86b3ce071fd5f5ef7478d5766fe2d38ba613c5fc";
const outputDir = join(root, "public", "games", "eaglercraft");
const clientUrl = `https://raw.githubusercontent.com/${upstream}/${revision}/javascript/EaglercraftZ_1.20_Offline_en_US.html`;
const licenseUrl = `https://raw.githubusercontent.com/${upstream}/${revision}/license.mit`;

async function fetchText(url, minimumLength = 1) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`Could not download open-source game file (${response.status}): ${url}`);
  const text = await response.text();
  if (text.length < minimumLength) throw new Error(`Downloaded game file was unexpectedly small: ${url}`);
  return text;
}

await mkdir(outputDir, { recursive: true });
const client = await fetchText(clientUrl, 10_000_000);
if (!/<!doctype html|<html/i.test(client.slice(0, 500))) {
  throw new Error("The downloaded Eaglercraft client is not an HTML document.");
}
const license = await fetchText(licenseUrl, 500);
await writeFile(join(outputDir, "index.html"), client, "utf8");
await writeFile(join(outputDir, "LICENSE.txt"), license, "utf8");
await writeFile(
  join(outputDir, "PROVENANCE.md"),
  [
    "# Eaglercraft source provenance",
    "",
    "- Upstream repository: https://github.com/EaglercraftZ-Devs/EaglercraftZ-Source",
    `- Pinned upstream commit: ${revision}`,
    "- Client file: javascript/EaglercraftZ_1.20_Offline_en_US.html",
    "- The client is downloaded at build time and served locally by Vehemence.",
    "- License text is retained in LICENSE.txt. Review upstream notices for third-party components and game assets.",
    ""
  ].join("\\n"),
  "utf8"
);
console.log("Vendored the pinned open-source Eaglercraft client.");
