/**
 * compress-images.mjs
 * Converts all JPG/PNG images in public/images to WebP (quality 80).
 * Originals are kept with a .orig extension for safety.
 * After running, update any CSS/JS references that use the old filenames.
 *
 * Run from the aerogarage folder:
 *   node scripts/compress-images.mjs
 */
import sharp from "sharp";
import { readdir, rename, stat } from "fs/promises";
import { join, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = join(__dirname, "../public/images");
const QUALITY   = 82; // 80-85 is the sweet spot — near-lossless perception

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + " KB";
}

async function main() {
  const allFiles = await walkDir(INPUT_DIR);
  const targets  = allFiles.filter((f) => /\.(jpe?g|png)$/i.test(f));

  let totalBefore = 0;
  let totalAfter  = 0;
  const results   = [];

  for (const src of targets) {
    const ext     = extname(src);
    const webpOut = src.replace(/\.(jpe?g|png)$/i, ".webp");
    const origBak = src + ".orig";        // keep original

    const statBefore = await stat(src);
    totalBefore += statBefore.size;

    await sharp(src)
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(webpOut);

    const statAfter = await stat(webpOut);
    totalAfter += statAfter.size;

    // Rename original → .orig so the .jpg/.png path is now free if needed
    await rename(src, origBak);

    const pct = (((statBefore.size - statAfter.size) / statBefore.size) * 100).toFixed(1);
    results.push({
      file:   src.replace(INPUT_DIR, "").replace(/\\/g, "/"),
      before: await formatBytes(statBefore.size),
      after:  await formatBytes(statAfter.size),
      saving: pct + "%",
    });

    console.log(`✅ ${basename(src).padEnd(40)} ${await formatBytes(statBefore.size)} → ${await formatBytes(statAfter.size)} (-${pct}%)`);
  }

  console.log("\n── Summary ──────────────────────────────────────────");
  console.log(`Images processed : ${results.length}`);
  console.log(`Total before     : ${await formatBytes(totalBefore)}`);
  console.log(`Total after      : ${await formatBytes(totalAfter)}`);
  console.log(`Total saved      : ${await formatBytes(totalBefore - totalAfter)} (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`);
  console.log("\n⚠️  Originals saved as <filename>.orig — delete them once you've confirmed everything looks good.");
  console.log("⚠️  Update any .jpg/.jpeg/.png references in CSS and JSX to the new .webp paths.");
}

main().catch((err) => {
  console.error("Compression failed:", err);
  process.exit(1);
});
