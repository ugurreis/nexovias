# PostVias Backend — Setup

Real AI for PostVias: **OpenAI** captions, **fal.ai (FLUX)** image generation,
**Supabase** persistence — all behind **Netlify Functions** so no API key is ever
exposed to the browser. The site degrades gracefully: with no keys set, PostVias
falls back to its on-device caption generator and localStorage, exactly as before.

## Architecture

```
Browser (PostVias.html)
   │  fetch /api/*   (same origin — no keys in the client)
   ▼
Netlify Functions (netlify/functions/*.js)
   ├─ generate-caption.js  → OpenAI Chat Completions
   ├─ generate-image.js    → fal.ai FLUX  (→ optional copy to Supabase Storage)
   └─ posts.js             → Supabase Postgres (replace-on-save)
```

## 1. Provision the services

| Service | Get | Used for |
|---|---|---|
| OpenAI | API key — https://platform.openai.com/api-keys | Captions |
| fal.ai | API key — https://fal.ai/dashboard/keys | Image generation |
| Supabase | New project — https://supabase.com → Project Settings → API | Posts + image storage |

In Supabase, open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
It creates the `posts` table (RLS on, no public policies) and a public-read
`generated` storage bucket.

## 2. Set environment variables in Netlify

Site → **Site settings → Environment variables** → add (see [`.env.example`](.env.example)):

```
OPENAI_API_KEY        = sk-...
FAL_KEY               = ...
SUPABASE_URL          = https://<project>.supabase.co
SUPABASE_SERVICE_KEY  = <service_role secret>      # server-side only
# optional:
OPENAI_MODEL=gpt-4o-mini
FAL_MODEL=fal-ai/flux/schnell
SUPABASE_BUCKET=generated
```

Redeploy (push to `main`, or "Trigger deploy"). Netlify auto-installs the
`@supabase/supabase-js` dependency from `package.json`.

> Each capability is independent. Set only `OPENAI_API_KEY` and you get real
> captions; image generation and cloud sync stay off until their keys exist.

## 3. Local development (optional)

```bash
npm install
npm i -g netlify-cli
cp .env.example .env   # fill in your keys
netlify dev            # serves the site + functions at http://localhost:8888
```

## Endpoints

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/generate-caption` | `{ link?, hasMedia?, topic?, brand?, platforms?, tone? }` | `{ caption }` |
| POST | `/api/generate-image` | `{ prompt, ratio? }` (`square`/`portrait`/`story`/`landscape`/`wide`) | `{ imageUrl, persisted }` |
| GET  | `/api/posts?ws=demo` | — | `{ posts: [...] }` |
| POST | `/api/posts?ws=demo` | `{ posts: [...] }` | `{ ok, count }` |

A `503 { error: "not_configured" }` from any endpoint means its key isn't set —
the frontend silently falls back.

## Security notes

- All third-party keys live **only** in Netlify env vars / functions. The browser
  never receives them.
- The Supabase **service_role** key is used only inside `posts.js` / `generate-image.js`.
  Never put it in the client or in `index.html` / `PostVias.html`.
- `posts` table has RLS enabled with no public policies → the anon key cannot
  read/write it; only the service role (server-side) can.
- Generated-image bucket is public-read only (uploads are server-side).
- Generation endpoints are unauthenticated by design (public demo). If you expose
  this to real traffic, add rate limiting / an auth check before going to production.
