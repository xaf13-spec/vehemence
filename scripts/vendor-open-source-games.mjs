import { cp, mkdtemp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const eaglercraft = {
  repository: "EaglercraftZ-Devs/EaglercraftZ-Source",
  revision: "86b3ce071fd5f5ef7478d5766fe2d38ba613c5fc",
  file: "javascript/EaglercraftZ_1.20_Offline_en_US.html",
};
const libreArcade = {
  repository: "linkingtechnologies/libre-arcade",
  revision: "a5bddc0655f151b518d173d27cf93a20ef3203bf",
};
const selectedGames = [
  ["hextris-open", "hextris"],
  ["klondike", "klondike"],
  ["for-science", "for-science"],
  ["donkey-bolonkey", "donkey-bolonkey"],
  ["psypong3d", "psypong3d"],
  ["wok-open", "wok"],
  ["yanoid", "yanoid"],
  ["glparchis", "glparchis"],
  ["bubble-train", "bubble-train"],
  ["nova-pinball", "nova-pinball"],
  ["mechanical-night-pinball", "mechanical-night-pinball"],
  ["comet-pinball", "comet-pinball"],
  ["disk-field", "disk-field"],
  ["the-lost-path", "the-lost-path"],
];

async function fetchText(url, minimumLength = 1) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`Could not download open-source game file (${response.status}): ${url}`);
  const text = await response.text();
  if (text.length < minimumLength) throw new Error(`Downloaded game file was unexpectedly small: ${url}`);
  return text;
}

async function fetchToFile(url, destination) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`Could not download open-source archive (${response.status}): ${url}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function vendorEaglercraft() {
  const outputDir = join(root, "public", "games", "eaglercraft");
  const base = `https://raw.githubusercontent.com/${eaglercraft.repository}/${eaglercraft.revision}`;
  const client = await fetchText(`${base}/${eaglercraft.file}`, 10_000_000);
  if (!/<!doctype html|<html/i.test(client.slice(0, 500))) {
    throw new Error("The downloaded Eaglercraft client is not an HTML document.");
  }
  const license = await fetchText(`${base}/license.mit`, 500);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "index.html"), client, "utf8");
  await writeFile(join(outputDir, "LICENSE.txt"), license, "utf8");
  await writeFile(
    join(outputDir, "PROVENANCE.md"),
    [
      "# Eaglercraft source provenance",
      "",
      `- Upstream repository: https://github.com/${eaglercraft.repository}`,
      `- Pinned upstream commit: ${eaglercraft.revision}`,
      `- Client file: ${eaglercraft.file}`,
      "- The client is downloaded at build time and served locally by Vehemence.",
      "- Review the retained upstream license and third-party notices before redistributing changes.",
      ""
    ].join("\n"),
    "utf8"
  );
}

async function vendorLibreArcade() {
  const work = await mkdtemp(join(tmpdir(), "vehemence-libre-arcade-"));
  try {
    const archive = join(work, "source.tar.gz");
    const extracted = join(work, "source");
    await mkdir(extracted, { recursive: true });
    await fetchToFile(
      `https://codeload.github.com/${libreArcade.repository}/tar.gz/${libreArcade.revision}`,
      archive
    );
    execFileSync("tar", ["-xzf", archive, "-C", extracted, "--strip-components=1"], { stdio: "inherit" });

    for (const [slug, folder] of selectedGames) {
      const sourceRoot = join(extracted, folder);
      const sourcePublic = join(sourceRoot, "public");
      const outputDir = join(root, "public", "games", slug);
      await rm(outputDir, { recursive: true, force: true });
      await mkdir(outputDir, { recursive: true });
      await cp(sourcePublic, outputDir, { recursive: true });

      for (const name of await readdir(sourceRoot)) {
        if (!/^(LICENSE|COPYING|NOTICE|CREDITS|ATTRIBUTION|THIRD_PARTY_NOTICES|ASSETS_LICENSE|MUSIC-CREDITS)(\.|$)/i.test(name) &&
            !/^(LICENSES|THIRD_PARTY)$/i.test(name)) continue;
        await cp(join(sourceRoot, name), join(outputDir, `UPSTREAM_${name}`), { recursive: true });
      }

      const indexPath = join(outputDir, "index.html");
      let html = await fetchText(`file://${indexPath}`).catch(async () => null);
      // Local files are read through Node's filesystem below; fetch is intentionally not used for file URLs.
      const { readFile } = await import("node:fs/promises");
      html = await readFile(indexPath, "utf8");
      html = html.replace(/<script\b(?=[^>]*(?:goatcounter|gc\.zgo\.at|google-analytics|googletagmanager))[^>]*>[\s\S]*?<\/script\s*>/gi, "");
      html = html.replace(/<a\b(?=[^>]*href=["'][^"']*(?:github\.com\/linkingtechnologies\/libre-arcade|linkingtechnologies\.github\.io\/libre-arcade)[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi, "");
      await writeFile(indexPath, html, "utf8");
      await writeFile(
        join(outputDir, "PROVENANCE.md"),
        [
          "# Game source provenance",
          "",
          `- Upstream repository: https://github.com/${libreArcade.repository}`,
          `- Pinned upstream commit: ${libreArcade.revision}`,
          `- Upstream game folder: ${folder}/`,
          "- Game files are copied into Vehemence's public static assets during the build.",
          "- Upstream license, attribution, and third-party notice files are retained beside the game files.",
          ""
        ].join("\n"),
        "utf8"
      );
    }
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

await vendorEaglercraft();
await vendorLibreArcade();
console.log("Vendored pinned open-source game code for Vehemence.");
