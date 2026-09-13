import { execFile } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/admin/auth";
import { getBackend } from "@/lib/admin/backend";
import {
  MEDIA_IMAGE_EXTS,
  MEDIA_VIDEO_EXTS,
} from "@/lib/admin/types";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

function maxMediaBytes(): number {
  const raw = process.env.MAX_MEDIA_BYTES;
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 200 * 1024 * 1024;
}

const OPTIMIZED_EXTS = ["mp4", "m4v", "mov"];

async function ffmpegAvailable(): Promise<boolean> {
  try {
    await execFileAsync("ffmpeg", ["-hide_banner", "-version"], { timeout: 10_000 });
    return true;
  } catch {
    return false;
  }
}

/** True when the moov atom is already near the start of the file (faststart). */
function moovAtHead(buf: Buffer): boolean {
  const head = buf
    .subarray(0, Math.min(buf.length, 1024 * 1024))
    .toString("latin1");
  return head.includes("moov");
}

/** Re-mux the file with the moov atom moved to the front (no re-encode). */
async function optimizeFaststart(
  inputPath: string,
  ext: string
): Promise<Buffer | null> {
  const outputPath = inputPath + ".faststart";
  const formatValue = ext === "mov" ? "mov" : "mp4";
  try {
    await execFileAsync(
      "ffmpeg",
      [
        "-y", "-nostdin", "-hide_banner", "-loglevel", "error",
        "-i", inputPath,
        "-map", "0",
        "-c", "copy",
        "-movflags", "+faststart",
        "-f", formatValue,
        outputPath,
      ],
      { timeout: 180_000 }
    );
    const buf = readFileSync(outputPath);
    unlinkSync(outputPath);
    return buf;
  } catch {
    try {
      unlinkSync(outputPath);
    } catch {
      /* ignore */
    }
    return null;
  }
}

/** Extract a single still frame to use as the poster while the video buffers. */
async function renderPoster(inputPath: string, outputPath: string): Promise<boolean> {
  try {
    await execFileAsync(
      "ffmpeg",
      [
        "-y", "-nostdin", "-hide_banner", "-loglevel", "error",
        "-ss", "0.1",
        "-i", inputPath,
        "-frames:v", "1",
        "-q:v", "3",
        outputPath,
      ],
      { timeout: 60_000 }
    );
    return existsSync(outputPath);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "")
      .replace(/[^a-zA-Z0-9/_-]/g, "_")
      .replace(/^\/|\/$/g, "")
      .split("/")
      .map((segment) => segment.slice(0, 60))
      .filter(Boolean)
      .join("/")
      .slice(0, 180);
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "no file provided" }, { status: 400 });
    }

    const dotIdx = file.name.lastIndexOf(".");
    const ext = dotIdx >= 0 ? file.name.slice(dotIdx + 1).toLowerCase() : "";
    if (![...MEDIA_VIDEO_EXTS, ...MEDIA_IMAGE_EXTS].includes(ext)) {
      return NextResponse.json({ error: `file type .${ext} is not allowed` }, { status: 400 });
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60)}`;
    const relativePublicPath = `public/media/${folder || "uploads"}/${safeName}`;
    const publicUrl = `/media/${folder || "uploads"}/${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const MAX_MEDIA_BYTES = maxMediaBytes();
    if (buffer.length > MAX_MEDIA_BYTES) {
      const mb = Math.round(MAX_MEDIA_BYTES / 1024 / 1024);
      return NextResponse.json(
        { error: `file too large — max ${mb} MB via admin` },
        { status: 400 }
      );
    }

    const backend = getBackend();
    let out: Buffer = buffer;
    let posterUrl: string | undefined;

    const isVideoUpload = MEDIA_VIDEO_EXTS.includes(ext);
    if (isVideoUpload && (await ffmpegAvailable())) {
      const tmpInput = join(tmpdir(), safeName);
      try {
        writeFileSync(tmpInput, buffer);

        // 1) Faststart: move the moov atom to the front so playback starts
        //    after a small buffer, not after the whole file downloads.
        if (OPTIMIZED_EXTS.includes(ext) && !moovAtHead(buffer)) {
          const optimized = await optimizeFaststart(tmpInput, ext);
          if (optimized) out = optimized;
          // If optimization failed we fall back to the original bytes.
        }

        // 2) Auto-poster: grab a still so the frame renders instantly.
        const posterExt = "jpg";
        const posterName = `${safeName}-poster.${posterExt}`;
        const posterTmp = join(tmpdir(), posterName);
        if (await renderPoster(tmpInput, posterTmp)) {
          const posterRelative = `public/media/${folder || "uploads"}/${posterName}`;
          const posterBuffer = readFileSync(posterTmp);
          try {
            await backend.writeBuffer(posterRelative, posterBuffer, `poster: ${file.name}`);
            posterUrl = `/media/${folder || "uploads"}/${posterName}`;
          } catch {
            /* keep going without a poster */
          }
          unlinkSync(posterTmp);
        }
      } catch (err) {
        console.error("[upload] ffmpeg/post stage failed:", err);
        /* keep original bytes on any failure */
      } finally {
        try {
          unlinkSync(tmpInput);
        } catch {
          /* ignore */
        }
      }
    }

    try {
      await backend.writeBuffer(relativePublicPath, out, `upload: ${file.name}`);
    } catch (err) {
      console.error("[upload] write failed:", err);
      return NextResponse.json(
        { error: `upload failed on write (${folder}) — ${(err as Error).message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: publicUrl, poster: posterUrl });
  } catch (err) {
    console.error("[upload] unexpected error:", err);
    return NextResponse.json(
      { error: `upload failed — ${(err as Error).message}` },
      { status: 500 }
    );
  }
}