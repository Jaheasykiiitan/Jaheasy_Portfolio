const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const REPO = process.cwd();
const MEDIA = path.join(REPO, "public", "media");
const BACKUP = path.join(REPO, "backup-originals");
const MANIFEST = path.join(BACKUP, "manifest.json");
const VIDEO_RE = /\.(mp4|m4v|mov|webm)$/i;

const loadManifest = () => {
  try { return JSON.parse(fs.readFileSync(MANIFEST, "utf8")); } catch { return {}; }
};
const saveManifest = (m) => {
  fs.mkdirSync(BACKUP, { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(m, null, 2));
};
const walk = (dir) => {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (VIDEO_RE.test(e.name)) out.push(p);
  }
  return out;
};
const moovAtHead = (f) => {
  const fd = fs.openSync(f, "r");
  const len = Math.min(fs.statSync(f).size, 1048576);
  const b = Buffer.alloc(len);
  fs.readSync(fd, b, 0, len, 0);
  fs.closeSync(fd);
  return b.toString("latin1").includes("moov");
};
const mb = (n) => (n / 1048576).toFixed(1);

// ignore the backup folder
try {
  const gi = fs.readFileSync(path.join(REPO, ".gitignore"), "utf8");
  if (!/^backup-originals\/?$/m.test(gi)) {
    fs.appendFileSync(path.join(REPO, ".gitignore"), "\nbackup-originals/\n");
    console.log("added backup-originals/ to .gitignore");
  }
} catch { /* no .gitignore */ }

const manifest = loadManifest();
const files = walk(MEDIA);
console.log(`found ${files.length} videos\n`);

let savedBefore = 0, savedAfter = 0, compressed = 0, skipped = 0, failed = 0;

for (const f of files) {
  const rel = path.relative(REPO, f);
  const name = path.basename(f);
  const size = fs.statSync(f).size;
  savedBefore += size;

  const m = manifest[rel];
  if (m && size === m.encodedSize) {
    console.log(`skip     ${name} (${mb(size)} MB, already compressed)`);
    savedAfter += size;
    skipped++;
    continue;
  }

  const bpath = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(bpath), { recursive: true });
  if (!fs.existsSync(bpath)) {
    fs.copyFileSync(f, bpath);
    console.log(`backup   ${name} -> backup-originals/${rel}`);
  }

  const tmp = f + ".tmp.mp4";
  try {
    execFileSync("ffmpeg", [
      "-y", "-nostdin", "-hide_banner", "-loglevel", "error",
      "-i", f,
      "-map", "0:v:0", "-map", "0:a?",
      "-vf", "scale='min(1920,iw)':-2",
      "-c:v", "libx264", "-preset", "fast", "-crf", "23",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "128k", "-ac", "2",
      "-movflags", "+faststart",
      "-f", "mp4", tmp,
    ], { stdio: "pipe", timeout: 1800000 });

    const newSize = fs.statSync(tmp).size;
    if (newSize > 0 && newSize < size && moovAtHead(tmp)) {
      fs.renameSync(tmp, f);
      const pct = (100 * (1 - newSize / size)).toFixed(0);
      console.log(`DONE     ${name}  ${mb(size)} -> ${mb(newSize)} MB  (-${pct}%)`);
      savedAfter += newSize;
      manifest[rel] = { originalSize: size, encodedSize: newSize, at: new Date().toISOString() };
      saveManifest(manifest);
      compressed++;
    } else {
      try { fs.unlinkSync(tmp); } catch {}
      console.log(`keep     ${name} (re-encode not smaller: ${mb(size)} -> ${mb(newSize)} MB)`);
      savedAfter += size;
      manifest[rel] = { originalSize: size, encodedSize: size, at: new Date().toISOString() };
      saveManifest(manifest);
      skipped++;
    }
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch {}
    console.log(`FAILED   ${name} - ${String(e.message).split("\n")[0]}`);
    savedAfter += size;
    failed++;
  }
}

console.log(`\ncompressed: ${compressed} | skipped/kept: ${skipped} | failed: ${failed}`);
console.log(`total: ${mb(savedBefore)} MB -> ${mb(savedAfter)} MB  (saved ${mb(savedBefore - savedAfter)} MB)`);