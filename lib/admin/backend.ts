import { promises as fs } from "node:fs";
import path from "node:path";
import type { BackendInfo } from "@/lib/admin/types";

export interface AdminBackend {
  name: "local" | "github";
  info: BackendInfo;
  /** Read a repo-relative file (e.g. "content/site.json"). Null if missing. */
  readFile(relativePath: string): Promise<string | null>;
  /** Write/overwrite a text file and commit it (github) / flush to disk (local). */
  writeFile(relativePath: string, content: string, message: string): Promise<void>;
  /** Write a binary file (media uploads). */
  writeBuffer(relativePath: string, buffer: Buffer, message: string): Promise<void>;
}

const REPO_PATH_PREFIX = "";

function repoEnv() {
  const repo = process.env.GITHUB_REPO ?? "";
  const token = process.env.GITHUB_TOKEN ?? "";
  const m = /^([^/]+)\/([^/]+)$/.exec(repo);
  if (!m) return null;
  return { owner: m[1], repo: m[2], token };
}

/* ------------------------------------------------------------------ */
/*  Local filesystem backend — used in dev / self-hosted Node server.  */
/* ------------------------------------------------------------------ */

class LocalBackend implements AdminBackend {
  name = "local" as const;
  info: BackendInfo = {
    name: "local",
    label: "Local files (this machine)",
    hint: "Saves are written straight to the project files (content/ and public/media/). They appear on the live site after a rebuild/redeploy.",
  };

  private abs(relativePath: string): string {
    const clean = relativePath.replace(/^[/\\]+/, "");
    if (clean.startsWith("content/") || clean === "content") {
      return path.join(process.cwd(), "content", clean.slice("content".length).replace(/^[/\\]+/, ""));
    }
    if (clean.startsWith("public/") || clean === "public") {
      return path.join(process.cwd(), "public", clean.slice("public".length).replace(/^[/\\]+/, ""));
    }
    throw new Error(`local backend: only content/ and public/ paths are allowed (got ${relativePath})`);
  }

  async readFile(relativePath: string): Promise<string | null> {
    try {
      return await fs.readFile(this.abs(relativePath), "utf8");
    } catch {
      return null;
    }
  }

  async writeFile(relativePath: string, content: string, message: string): Promise<void> {
    void message;
    const target = this.abs(relativePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, "utf8");
  }

  async writeBuffer(relativePath: string, buffer: Buffer, message: string): Promise<void> {
    void message;
    const target = this.abs(relativePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, buffer);
  }
}

/* ------------------------------------------------------------------ */
/*  GitHub backend — commits content to the repo via the Contents API. */
/*  Works on Vercel/Netlify: the push triggers an automatic redeploy,  */
/*  so saved edits go live without touching the build.                 */
/* ------------------------------------------------------------------ */

class GitHubBackend implements AdminBackend {
  name = "github" as const;
  info: BackendInfo = {
    name: "github",
    label: "GitHub (repo commit → auto redeploy)",
    hint: "Every save commits the change to your repo. On Vercel/Netlify the push triggers a redeploy, so edits go live automatically.",
  };

  private env: { owner: string; repo: string; token: string };

  constructor() {
    this.env = repoEnv()!;
  }

  private apiUrl(filePath: string): string {
    const p = [REPO_PATH_PREFIX, filePath].filter(Boolean).join("/");
    return `https://api.github.com/repos/${this.env.owner}/${this.env.repo}/contents/${p}`;
  }

  private async gh<T>(url: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
    const res = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${this.env.token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "jaheasy-portfolio-admin",
        ...init.headers,
      },
    });
    const text = await res.text();
    let body: T;
    try {
      body = JSON.parse(text) as T;
    } catch {
      body = undefined as T;
    }
    return { status: res.status, body };
  }

  async readFile(relativePath: string): Promise<string | null> {
    const filePath = [REPO_PATH_PREFIX, relativePath].filter(Boolean).join("/");
    const res = await fetch(`https://api.github.com/repos/${this.env.owner}/${this.env.repo}/contents/${filePath}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${this.env.token}`,
        Accept: "application/vnd.github.raw+json",
        "User-Agent": "jaheasy-portfolio-admin",
      },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
    }
    return await res.text();
  }

  private async currentSha(filePath: string): Promise<string | undefined> {
    const filePathWithPrefix = [REPO_PATH_PREFIX, filePath].filter(Boolean).join("/");
    const res = await fetch(`https://api.github.com/repos/${this.env.owner}/${this.env.repo}/contents/${filePathWithPrefix}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${this.env.token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "jaheasy-portfolio-admin",
      },
    });
    if (res.status === 404) return undefined;
    if (!res.ok) return undefined;
    const json = (await res.json()) as { sha?: string };
    return json.sha;
  }

  private async put(
    filePath: string,
    contentBase64: string,
    message: string
  ): Promise<void> {
    const body: { message: string; content: string; sha?: string } = {
      message,
      content: contentBase64,
    };
    const sha = await this.currentSha(filePath);
    if (sha) body.sha = sha;
    const { status, body: out } = await this.gh<{ message?: string }>(this.apiUrl(filePath), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (status !== 200 && status !== 201) {
      throw new Error(`GitHub commit failed (${status}): ${out?.message ?? "unknown"}`);
    }
  }

  async writeFile(relativePath: string, content: string, message: string): Promise<void> {
    await this.put(relativePath, Buffer.from(content, "utf8").toString("base64"), message);
  }

  async writeBuffer(relativePath: string, buffer: Buffer, message: string): Promise<void> {
    await this.put(relativePath, buffer.toString("base64"), message);
  }
}

/* ------------------------------------------------------------------ */

let cached: AdminBackend | null = null;

export function getBackend(): AdminBackend {
  if (cached) return cached;
  if (repoEnv()) {
    cached = new GitHubBackend();
  } else {
    cached = new LocalBackend();
  }
  return cached;
}