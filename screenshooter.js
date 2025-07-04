#!/usr/bin/env node
/*
 * Website Screenshot Generator 📸
 * --------------------------------
 * A simple Node.js CLI tool that captures PNG screenshots of any list of URLs
 * using headless Chrome (Puppeteer).
 *
 * USAGE:
 *   node screenshooter.js [options] <url1> <url2> ...
 *
 * OPTIONS:
 *   -o <dir>   Output directory (default: screenshots)
 *   -w <px>    Viewport width in pixels (default: 1366)
 *   -h <px>    Viewport height in pixels (default: 768)
 *   -f         Capture full‑page screenshot instead of just the viewport
 *
 * EXAMPLES:
 *   node screenshooter.js https://example.com https://openai.com
 *   node screenshooter.js -o shots -w 1920 -h 1080 -f https://www.facebook.com
 *
 * REQUIREMENTS:
 *   1. Node.js ≥ 18
 *   2. npm i puppeteer
 *
 * SECURITY NOTE:
 *   The script launches Chrome in headless mode with the --no-sandbox flag for
 *   ease of use. Remove this flag or run inside a container if you need stricter
 *   isolation.
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  // ---------------- Command‑line parsing ----------------
  const args = process.argv.slice(2);
  const opts = {
    width: 1366,
    height: 768,
    fullPage: false,
    output: "screenshots",
  };
  const urls = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "-o":
        opts.output = args[++i] || opts.output;
        break;
      case "-w":
        opts.width = parseInt(args[++i]) || opts.width;
        break;
      case "-h":
        opts.height = parseInt(args[++i]) || opts.height;
        break;
      case "-f":
        opts.fullPage = true;
        break;
      default:
        urls.push(arg);
    }
  }

  if (urls.length === 0) {
    console.error("\nUsage: node screenshooter.js [options] <url1> <url2> ...\n" +
      "\nOptions:\n" +
      "  -o <dir>   Output directory (default: screenshots)\n" +
      "  -w <px>    Viewport width (default: 1366)\n" +
      "  -h <px>    Viewport height (default: 768)\n" +
      "  -f         Capture full‑page screenshot\n");
    process.exit(1);
  }

  // -------------- Prepare output directory --------------
  fs.mkdirSync(opts.output, { recursive: true });

  // -------------- Launch headless Chrome ----------------
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: opts.width, height: opts.height });

  // -------------------- Capture loop --------------------
  for (const url of urls) {
    try {
      console.log(`Capturing ${url} ...`);
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      // Sanitize URL to file name
      const fileName = path.join(
        opts.output,
        url
          .replace(/(^\w+:|^)\/\//, "")
          .replace(/[^\w.-]+/g, "_")
          .replace(/(_$)/, "") + `.png`
      );

      await page.screenshot({ path: fileName, fullPage: opts.fullPage });
      console.log(`✅ Saved -> ${fileName}`);
    } catch (err) {
      console.error(`❌ Error capturing ${url}: ${err.message}`);
    }
  }

  // ---------------------- Cleanup -----------------------
  await browser.close();
})(); 