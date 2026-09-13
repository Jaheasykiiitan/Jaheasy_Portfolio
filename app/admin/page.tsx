"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { ReactNode, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent, ProjectsContent } from "@/lib/admin/types";
import type { Project } from "@/lib/types";
import { projectCategories } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/*  Tiny helpers                                                        */
/* ------------------------------------------------------------------ */

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-white text-black text-xs tracking-wider uppercase">
      {msg}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-[11px] tracking-[0.3em] uppercase opacity-50">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const cls =
    "w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/40 transition placeholder-white/30";
  return (
    <label className="block space-y-1">
      <span className="text-[10px] tracking-widest uppercase opacity-40">{label}</span>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </label>
  );
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[10px] tracking-widest uppercase opacity-40">{label}</span>
      <textarea
        rows={4}
        value={items.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/40 transition font-mono"
      />
    </label>
  );
}

function MediaField({
  label,
  value,
  onChange,
  folder,
  kind = "image",
  onUploaded,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  kind?: "video" | "image";
  onUploaded?: (url: string, poster?: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const VIDEO_ACCEPT = ".mp4,.m4v,.mov,.webm,video/mp4,video/m4v,video/quicktime,video/webm";
  const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif";

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isVid = /^(mp4|m4v|mov|webm)$/.test(ext);
    if (kind === "video" && !isVid) {
      setError("That looks like an image — this field needs a video file (MP4/MOV/WebM) for playback.");
      finish(input);
      return;
    }
    if (kind === "image" && isVid) {
      setError("That looks like a video — this field needs an image (JPG/PNG/WebP) for the still frame.");
      finish(input);
      return;
    }
    setUploading(true);
    setProgress(0);
    setError(null);

    const form = new FormData();
    form.set("file", file);
    form.set("folder", folder);
    form.set("kind", kind);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const body = JSON.parse(xhr.responseText) as {
            url: string;
            poster?: string;
          };
          setError(null);
          onChange(body.url);
          onUploaded?.(body.url, body.poster);
        } catch {
          setError("Upload failed — unexpected response.");
        }
      } else {
        let msg = `Upload failed (${xhr.status}).`;
        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          if (body.error) msg = body.error;
        } catch {
          /* keep default message */
        }
        setError(msg);
      }
      finish(input);
    };
    xhr.onerror = () => {
      setError("Network error — could not reach the upload server.");
      finish(input);
    };
    xhr.onabort = () => finish(input);
    xhr.send(form);
  }

  function finish(input: HTMLInputElement) {
    setUploading(false);
    setProgress(0);
    input.value = "";
  }

  return (
    <div className="space-y-1">
      <span className="text-[10px] tracking-widest uppercase opacity-40">{label}</span>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/90 outline-none focus:border-white/40 transition"
        />
        <input
          ref={fileRef}
          type="file"
          accept={kind === "video" ? VIDEO_ACCEPT : IMAGE_ACCEPT}
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 border border-white/10 px-3 py-2 text-[10px] tracking-widest uppercase hover:bg-white/10 transition disabled:opacity-40"
        >
          {uploading ? `${progress}%` : "upload"}
        </button>
      </div>
      {uploading ? (
        <div
          role="progressbar"
          aria-label={`Uploading ${label.toLowerCase()}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-1 w-full overflow-hidden bg-white/10"
        >
          <div
            className="h-full bg-white transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
      {error ? (
        <p className="text-[10px] text-red-400">{error}</p>
      ) : null}
      {value.startsWith("/") && (
        <p className="text-[10px] opacity-30 truncate">{value}</p>
      )}
    </div>
  );
}

function objectListEdit<T extends object>(
  list: T[],
  idx: number,
  patch: Partial<T>
): T[] {
  return list.map((item, i) => (i === idx ? { ...item, ...patch } : item));
}

/* ------------------------------------------------------------------ */
/*  Main admin page                                                     */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<SiteContent | null>(null);
  const [projects, setProjects] = useState<ProjectsContent>([]);
  const [backendLabel, setBackendLabel] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [savingSite, setSavingSite] = useState(false);
  const [savingProjects, setSavingProjects] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/data");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setSite(data.site);
        setProjects(data.projects);
        setBackendLabel(data.backend?.label ?? "Local files");
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSaveSite() {
    if (!site) return;
    setSavingSite(true);
    try {
      const res = await fetch("/api/admin/save-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site }),
      });
      if (!res.ok) {
        const data = await res.json();
        flash(data.error || "save failed");
      } else {
        flash("Site content saved");
      }
    } finally {
      setSavingSite(false);
    }
  }

  async function handleSaveProjects() {
    setSavingProjects(true);
    try {
      const res = await fetch("/api/admin/save-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      if (!res.ok) {
        const data = await res.json();
        flash(data.error || "save failed");
      } else {
        flash("Projects saved");
      }
    } finally {
      setSavingProjects(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const projectRow = (p: Project, i: number) => {
    const isOpen = expandedProject === i;
    return (
      <div key={i} className="border border-white/10">
        <button
          type="button"
          onClick={() => setExpandedProject(isOpen ? null : i)}
          className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-white/5 transition text-sm"
        >
          <span className="flex gap-3 items-baseline">
            <span>{p.title || "(untitled)"}</span>
            <span className="opacity-30 text-xs">{p.year}</span>
          </span>
          <span className="opacity-30 text-xs">{isOpen ? "\u2013" : "+"}</span>
        </button>
        {isOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Title" value={p.title} onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], title: v }; setProjects(np); }} />
              <Field label="Slug" value={p.slug} onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], slug: v }; setProjects(np); }} />
              <Field label="Year" value={p.year} onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], year: v }; setProjects(np); }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Role" value={p.role} onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], role: v }; setProjects(np); }} />
              <Field label="External link (YouTube / Vimeo) — shown &amp; clickable on the card" value={p.externalUrl ?? ""} onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], externalUrl: v || undefined }; setProjects(np); }} />
            </div>
            <Field label="Description" value={p.description} multiline onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], description: v }; setProjects(np); }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="text-[10px] tracking-widest uppercase opacity-40">Category</span>
                <select
                  value={p.category}
                  onChange={(e) => { const np = [...projects]; np[i] = { ...np[i], category: e.target.value as typeof p.category }; setProjects(np); }}
                  className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/90 outline-none"
                >
                  {projectCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[10px] tracking-widest uppercase opacity-40">Layout</span>
                <select
                  value={p.layout ?? "standard"}
                  onChange={(e) => { const np = [...projects]; np[i] = { ...np[i], layout: e.target.value as typeof p.layout }; setProjects(np); }}
                  className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/90 outline-none"
                >
                  <option value="wide">wide</option>
                  <option value="tall">tall</option>
                  <option value="standard">standard</option>
                  <option value="portrait">portrait</option>
                  <option value="cinematic">cinematic</option>
                </select>
              </label>
            </div>
<MediaField
              label="Video preview — click UPLOAD to upload a file, or paste a link"
              value={p.video ?? ""}
              onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], video: v || undefined }; setProjects(np); }}
              folder={`projects/${(p.slug || `project-${i}`).slice(0, 40)}`}
              kind="video"
              onUploaded={(url, poster) => {
                if (!poster) return;
                setProjects((ps) => {
                  if (ps[i]?.poster) return ps;
                  const np = [...ps];
                  np[i] = { ...np[i], poster };
                  return np;
                });
              }}
            />
            <MediaField
              label="Poster URL"
              value={p.poster}
              onChange={(v) => { const np = [...projects]; np[i] = { ...np[i], poster: v }; setProjects(np); }}
              folder={`posters/${(p.slug || `project-${i}`).slice(0, 40)}`}
            />
            <button
              onClick={() => { if (confirm("Delete this project?")) { const np = projects.filter((_, j) => j !== i); setProjects(np); setExpandedProject(null); } }}
              className="text-[10px] tracking-widest uppercase text-red-400/70 hover:text-red-400 transition"
            >
              delete project
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-xs tracking-widest uppercase opacity-50">
        loading...
      </div>
    );
  }

  if (!site) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Toast msg={toast} />

      {/* top bar */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
          <h1 className="text-[11px] tracking-[0.3em] uppercase">Admin</h1>
          <div className="flex items-center gap-4 text-[10px] tracking-widest uppercase opacity-60">
            <span className="opacity-30 hidden sm:inline">backend: {backendLabel}</span>
            <Link href="/" className="hover:opacity-100 transition">View site</Link>
            <button onClick={handleLogout} className="hover:opacity-100 transition">Log out</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* ── SITE CONTENT ── */}
        <Section title="Identity & copy">
          <Field label="Name" value={site.site.name} onChange={(v) => setSite({ ...site, site: { ...site.site, name: v } })} />
          <Field label="Roles (comma-separated)" value={site.site.roles.join(", ")} onChange={(v) => setSite({ ...site, site: { ...site.site, roles: v.split(",").map((s) => s.trim()).filter(Boolean) } })} />
          <Field label="Tagline" value={site.site.tagline} onChange={(v) => setSite({ ...site, site: { ...site.site, tagline: v } })} />
          <Field label="Quote" value={site.site.quote} onChange={(v) => setSite({ ...site, site: { ...site.site, quote: v } })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Email" value={site.site.email} onChange={(v) => setSite({ ...site, site: { ...site.site, email: v } })} />
            <Field label="Email subject" value={site.site.emailSubject} onChange={(v) => setSite({ ...site, site: { ...site.site, emailSubject: v } })} />
          </div>
          <Field label="Availability line" value={site.site.availability} onChange={(v) => setSite({ ...site, site: { ...site.site, availability: v } })} />
          <Field label="Address / footer tag" value={site.site.address} onChange={(v) => setSite({ ...site, site: { ...site.site, address: v } })} />
        </Section>

        <Section title="Hero backdrop">
          <Field label="Eyebrow" value={site.heroBackdrop.eyebrow} onChange={(v) => setSite({ ...site, heroBackdrop: { ...site.heroBackdrop, eyebrow: v } })} />
          <Field label="Subline" value={site.heroBackdrop.subline} onChange={(v) => setSite({ ...site, heroBackdrop: { ...site.heroBackdrop, subline: v } })} />
        </Section>

        <Section title="Media — showreel & hero">
          <MediaField
            label="Showreel video URL"
            value={site.site.showreel.video}
            onChange={(v) => setSite({ ...site, site: { ...site.site, showreel: { ...site.site.showreel, video: v } } })}
            folder="showreel"
            kind="video"
            onUploaded={(url, poster) => {
              if (!poster) return;
              setSite((s) => {
                if (!s || s.site.showreel.poster) return s;
                return { ...s, site: { ...s.site, showreel: { ...s.site.showreel, poster } } };
              });
            }}
          />
          <MediaField label="Showreel poster" value={site.site.showreel.poster} onChange={(v) => setSite({ ...site, site: { ...site.site, showreel: { ...site.site.showreel, poster: v } } })} folder="showreel" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Showreel title" value={site.site.showreel.title} onChange={(v) => setSite({ ...site, site: { ...site.site, showreel: { ...site.site.showreel, title: v } } })} />
            <Field label="Showreel runtime" value={site.site.showreel.runtime} onChange={(v) => setSite({ ...site, site: { ...site.site, showreel: { ...site.site.showreel, runtime: v } } })} />
          </div>
          <MediaField
            label="Hero video"
            value={site.site.heroMedia.video}
            onChange={(v) => setSite({ ...site, site: { ...site.site, heroMedia: { ...site.site.heroMedia, video: v } } })}
            folder="hero"
            kind="video"
            onUploaded={(url, poster) => {
              if (!poster) return;
              setSite((s) => {
                if (!s || s.site.heroMedia.poster) return s;
                return { ...s, site: { ...s.site, heroMedia: { ...s.site.heroMedia, poster } } };
              });
            }}
          />
          <MediaField label="Hero poster" value={site.site.heroMedia.poster} onChange={(v) => setSite({ ...site, site: { ...site.site, heroMedia: { ...site.site.heroMedia, poster: v } } })} folder="hero" />
          <MediaField label="About frame poster" value={site.site.aboutFrame.poster} onChange={(v) => setSite({ ...site, site: { ...site.site, aboutFrame: { ...site.site.aboutFrame, poster: v } } })} folder="about" />
          <Field label="About frame caption" value={site.site.aboutFrame.caption} onChange={(v) => setSite({ ...site, site: { ...site.site, aboutFrame: { ...site.site.aboutFrame, caption: v } } })} />
        </Section>

        <Section title="Marquee strip">
          <ListEditor label="Items (one per line)" items={site.marqueeItems} onChange={(v) => setSite({ ...site, marqueeItems: v })} />
        </Section>

        <Section title="About paragraphs">
          <ListEditor label="Paragraphs (one per line)" items={site.aboutText} onChange={(v) => setSite({ ...site, aboutText: v })} />
        </Section>

        <Section title="Stats">
          {site.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Field label={`Value ${i + 1}`} value={s.value} onChange={(v) => setSite({ ...site, stats: objectListEdit(site.stats, i, { value: v }) })} />
              <Field label={`Label ${i + 1}`} value={s.label} onChange={(v) => setSite({ ...site, stats: objectListEdit(site.stats, i, { label: v }) })} />
            </div>
          ))}
        </Section>

        <Section title="Services">
          {site.services.map((s, i) => (
            <div key={i} className="space-y-2 border border-white/5 p-4">
              <div className="grid grid-cols-[3rem_1fr] gap-3">
                <Field label="Index" value={s.index} onChange={(v) => setSite({ ...site, services: objectListEdit(site.services, i, { index: v }) })} />
                <Field label="Title" value={s.title} onChange={(v) => setSite({ ...site, services: objectListEdit(site.services, i, { title: v }) })} />
              </div>
              <Field label="Description" value={s.description} multiline onChange={(v) => setSite({ ...site, services: objectListEdit(site.services, i, { description: v }) })} />
            </div>
          ))}
          <button
            onClick={() => setSite({ ...site, services: [...site.services, { index: String(site.services.length + 1).padStart(2, "0"), title: "", description: "" }] })}
            className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-80 transition"
          >
            + add service
          </button>
        </Section>

        <Section title="Skills">
          {site.skills.map((s, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name" value={s.name} onChange={(v) => setSite({ ...site, skills: objectListEdit(site.skills, i, { name: v }) })} />
              <Field label="Note" value={s.note} onChange={(v) => setSite({ ...site, skills: objectListEdit(site.skills, i, { note: v }) })} />
            </div>
          ))}
          <button
            onClick={() => setSite({ ...site, skills: [...site.skills, { name: "", note: "" }] })}
            className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-80 transition"
          >
            + add skill
          </button>
        </Section>

        <Section title="Experience">
          {site.experience.map((e, i) => (
            <div key={i} className="space-y-2 border border-white/5 p-4">
              <Field label="Title" value={e.title} onChange={(v) => setSite({ ...site, experience: objectListEdit(site.experience, i, { title: v }) })} />
              <Field label="Summary" value={e.summary} multiline onChange={(v) => setSite({ ...site, experience: objectListEdit(site.experience, i, { summary: v }) })} />
            </div>
          ))}
          <button
            onClick={() => setSite({ ...site, experience: [...site.experience, { title: "", summary: "" }] })}
            className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-80 transition"
          >
            + add experience
          </button>
        </Section>

        <Section title="Process">
          {site.process.map((s, i) => (
            <div key={i} className="space-y-2 border border-white/5 p-4">
              <div className="grid grid-cols-[3rem_1fr] gap-3">
                <Field label="Index" value={s.index} onChange={(v) => setSite({ ...site, process: objectListEdit(site.process, i, { index: v }) })} />
                <Field label="Title" value={s.title} onChange={(v) => setSite({ ...site, process: objectListEdit(site.process, i, { title: v }) })} />
              </div>
              <Field label="Description" value={s.description} multiline onChange={(v) => setSite({ ...site, process: objectListEdit(site.process, i, { description: v }) })} />
            </div>
          ))}
          <button
            onClick={() => setSite({ ...site, process: [...site.process, { index: String(site.process.length + 1).padStart(2, "0"), title: "", description: "" }] })}
            className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-80 transition"
          >
            + add process step
          </button>
        </Section>

        <Section title="Social links">
          {site.socials.map((s, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Label" value={s.label} onChange={(v) => setSite({ ...site, socials: objectListEdit(site.socials, i, { label: v }) })} />
              <Field label="Handle" value={s.handle} onChange={(v) => setSite({ ...site, socials: objectListEdit(site.socials, i, { handle: v }) })} />
              <Field label="URL" value={s.url} onChange={(v) => setSite({ ...site, socials: objectListEdit(site.socials, i, { url: v }) })} />
            </div>
          ))}
          <button
            onClick={() => setSite({ ...site, socials: [...site.socials, { label: "", handle: "", url: "" }] })}
            className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-80 transition"
          >
            + add social
          </button>
        </Section>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSaveSite}
            disabled={savingSite}
            className="px-8 py-3 bg-white text-black text-[11px] tracking-[0.3em] uppercase hover:opacity-90 transition disabled:opacity-50"
          >
            {savingSite ? "saving..." : "save site content"}
          </button>
        </div>

        {/* ── PROJECTS ── */}
        <Section title={`Projects (${projects.length})`}>
          {projectCategories.map((category) => {
            const items = projects.map((p, i) => ({ p, i })).filter(({ p }) => p.category === category);
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <h3 className="text-[11px] tracking-[0.3em] uppercase text-white/70">
                    {category} <span className="opacity-40">({items.length})</span>
                  </h3>
                  <button
                    onClick={() => {
                      const newSlug = `project-${Date.now()}`;
                      setProjects([...projects, { slug: newSlug, title: "", category, year: "2026", role: "", description: "", poster: "", layout: "standard" as const }]);
                      setExpandedProject(projects.length);
                    }}
                    className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-80 transition"
                  >
                    + add project
                  </button>
                </div>
                {items.length === 0 ? (
                  <p className="text-[11px] text-white/30">No projects yet - click &ldquo;+ add project&rdquo;.</p>
                ) : (
                  <div className="space-y-3">{items.map(({ p, i }) => projectRow(p, i))}</div>
                )}
              </div>
            );
          })}
          {(() => {
            const cats = [...projectCategories];
            const leftover = projects.map((p, i) => ({ p, i })).filter(({ p }) => !cats.includes(p.category));
            if (leftover.length === 0) return null;
            return (
              <div className="space-y-2">
                <h3 className="text-[11px] tracking-[0.3em] uppercase text-white/70 border-t border-white/10 pt-3">
                  Other <span className="opacity-40">({leftover.length})</span>
                </h3>
                <div className="space-y-3">{leftover.map(({ p, i }) => projectRow(p, i))}</div>
              </div>
            );
          })()}
        </Section>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSaveProjects}
            disabled={savingProjects}
            className="px-8 py-3 bg-white text-black text-[11px] tracking-[0.3em] uppercase hover:opacity-90 transition disabled:opacity-50"
          >
            {savingProjects ? "saving..." : "save projects"}
          </button>
        </div>
      </main>
    </div>
  );
}