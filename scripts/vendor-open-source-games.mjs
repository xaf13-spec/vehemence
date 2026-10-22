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
  ["classic-breakout", "html5-breakout"],
  ["classic-snake", "html5-snake"],
  ["space-invaders", "html5-space-invaders"],
  ["asteroids", "asteroids-infinity"],
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
      const { readFile } = await import("node:fs/promises");
      let html = await readFile(indexPath, "utf8");
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



async function vendorCookieClicker() {
  const source = {
    repository: "xaf13-spec/Cookie-Clicker-Source-Code",
    revision: "9a61267fa1586f1df7e3a8138ee4ff6a0ba164b2",
  };
  const work = await mkdtemp(join(tmpdir(), "vehemence-cookie-clicker-"));
  try {
    const archive = join(work, "source.tar.gz");
    const extracted = join(work, "source");
    await mkdir(extracted, { recursive: true });
    await fetchToFile(
      `https://codeload.github.com/${source.repository}/tar.gz/${source.revision}`,
      archive
    );
    execFileSync("tar", ["-xzf", archive, "-C", extracted, "--strip-components=1"], { stdio: "inherit" });
    const outputDir = join(root, "public", "games", "cookie-clicker");
    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    await cp(extracted, outputDir, { recursive: true });
    await rm(join(outputDir, "img", "Thumbs.db"), { force: true });

    const { readFile } = await import("node:fs/promises");
    const mainJsPath = join(outputDir, "main.js");
    let mainJs = await readFile(mainJsPath, "utf8");
    const iframeGuard = /if\s*\(top\s*!=\s*self\)\s*Game\.ErrorFrame\(\);\s*else\s*\{/;
    if (!iframeGuard.test(mainJs)) throw new Error("Cookie Clicker iframe error guard was not found; refusing to patch an unexpected source version.");
    mainJs = mainJs.replace(iframeGuard, "{");
    await writeFile(mainJsPath, mainJs, "utf8");

    const indexPath = join(outputDir, "index.html");
    let html = await readFile(indexPath, "utf8");
    html = html.replace(/<script[^>]*cookieconsent_options[\s\S]*?<\/script>\s*<script[^>]*cookieconsent\.min\.js[^>]*><\/script>/i, "");
    html = html.replace(/<!-- Facebook Pixel Code -->[\s\S]*?<!-- end code -->/i, "");
    html = html.replace(/<script[^>]*pagead\.googlesyndication\.com[^>]*><\/script>/i, "");
    await writeFile(indexPath, html, "utf8");
    await writeFile(join(outputDir, "PROVENANCE.md"), [
      "# Cookie Clicker source provenance", "",
      "- Upstream source repository: https://github.com/xaf13-spec/Cookie-Clicker-Source-Code",
      `- Pinned source revision: ${source.revision}`,
      "- Original game code, graphics, README, and copyright notice are retained.",
      "- The source is fetched during the Vehemence build and served from Vehemence's own static game path.",
      "- Cookie-consent, Facebook Pixel, and Google ad-loader snippets are removed; gameplay code and assets are otherwise retained.", ""
    ].join("\n"), "utf8");
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

async function vendor2048() {
  const work = await mkdtemp(join(tmpdir(), "vehemence-2048-"));
  try {
    const archive = join(work, "source.tar.gz");
    const extracted = join(work, "source");
    await mkdir(extracted, { recursive: true });
    await fetchToFile(
      "https://codeload.github.com/gabrielecirulli/2048/tar.gz/478b6ec346e3787f589e4af751378d06ded4cbbc",
      archive
    );
    execFileSync("tar", ["-xzf", archive, "-C", extracted, "--strip-components=1"], { stdio: "inherit" });
    const outputDir = join(root, "public", "games", "2048");
    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    await cp(join(extracted, "index.html"), join(outputDir, "index.html"));
    for (const name of ["js", "style", "meta", "favicon.ico", "LICENSE.txt", "README.md"]) {
      try { await cp(join(extracted, name), join(outputDir, name), { recursive: true }); } catch {}
    }
    try { await cp(join(extracted, "LICENSE.txt"), join(outputDir, "UPSTREAM_LICENSE.txt")); } catch {}
    await writeFile(join(outputDir, "PROVENANCE.md"), [
      "# 2048 source provenance", "",
      "- Upstream repository: https://github.com/gabrielecirulli/2048",
      "- Source is fetched from the upstream repository during build and served locally.",
      "- Retain the upstream license and notices.", ""
    ].join("\n"), "utf8");
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

await vendorCookieClicker();
await vendor2048();
await vendorEaglercraft();
await vendorLibreArcade();
console.log("Vendored pinned open-source game code for Vehemence.");
