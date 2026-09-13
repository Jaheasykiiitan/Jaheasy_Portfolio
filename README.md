# JAHEASY — Portfolio

Premium cinematic portfolio for filmmaker JAHEASY. Built with Next.js (App Router), Tailwind CSS v4 and Motion.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

There are two ways, and they always edit the same files:

**1. Admin panel (recommended)** — go to `http://<yoursite>/admin`, log in with `ADMIN_PASSWORD`, and edit every text field, media URL, and project through forms. Media can be uploaded directly (drag a file into the upload button).

**2. By hand** — the content lives in two JSON files that drive the whole site:

- `content/site.json` — name, tagline, quote, email, hero/showreel/about media, marquee, about, stats, services, skills, experience, process, social links.
- `content/projects.json` — the portfolio grid. Add/edit/delete project objects; the asymmetric layout follows each project's `layout` (`wide | tall | standard | portrait | cinematic`). `category` must be one of: Films, Cinematography, YouTube, Commercials, Social Content, AI Videos.

Keep your own media in `public/media/…` and reference it as `/media/…`.

## How the admin saves

Two backends, chosen by environment:

- **Local (default)** — saves are written straight to `content/` and `public/media/`. Perfect for `npm run dev` and small Node servers. On the live site the change appears after a rebuild/redeploy.
- **GitHub** — set `GITHUB_TOKEN` and `GITHUB_REPO=owner/name`, and every save becomes a commit to that repo. On Vercel/Netlify the push triggers an automatic redeploy — edits go live by themselves. The token needs Contents read+write on the repo only.

## Deploying

Standard Next.js deploy. Set these env vars on the host:

| Var             | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `ADMIN_PASSWORD` | Guards `/admin`. Required.                         |
| `GITHUB_TOKEN`   | Optional. Enables the GitHub save backend.         |
| `GITHUB_REPO`    | Optional. `owner/name` of the repo to commit to.   |
| `MAX_MEDIA_BYTES`| Optional. Upload size cap in bytes (default `209715200`, i.e. 200 MB). |

**Upload-size caveat on serverless hosts:** Vercel/Netlify cap request bodies (~4.5 MB on Vercel, images usually fine, large video files are not). Keep uploads under ~200 MB for local/self-hosted; on Vercel, upload posters/small files through the admin and host feature films somewhere (YouTube, Vimeo, your own storage) then paste the `.mp4` URL into the field instead.

**Upload-size caveat on serverless hosts:** Vercel/Netlify cap request bodies (~4.5 MB on Vercel, images usually fine, large video files are not). Keep uploads under ~25 MB for local/self-hosted; on Vercel, upload posters/small files through the admin and host feature films somewhere (YouTube, Vimeo, your own storage) then paste the `.mp4` URL into the field instead.