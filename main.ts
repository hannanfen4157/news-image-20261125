// Entry program for news-image-20261125.
//
// The image entry.png beside this file is the front page summing up the
// world news of Wednesday 25 November 2026. This program copies it to the
// output directory the grader reads, then checks the copy is complete.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

// Sanity check the shipped image before copying: it must be a real PNG,
// not a truncated or misnamed file. The PNG signature is 8 fixed bytes.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const header = readFileSync(source, { flag: "r" });
if (!header.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png is not a PNG file");
}

// The grader sets MAKEFUN_OUTPUT_DIR; /output is the documented default.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(resolve(outDir), "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// The copy must be whole: a truncated image would fail the gate, so refuse
// to report success unless every byte arrived.
const sourceSize = statSync(source).size;
const targetSize = statSync(target).size;
if (sourceSize !== targetSize) {
  throw new Error(
    `entry.png copy incomplete: wrote ${targetSize} bytes, expected ${sourceSize}`,
  );
}

console.log(`wrote ${target} (${targetSize} bytes)`);
