// Netlify Function — AI image generation via fal.ai (FLUX schnell by default).
// Server-side only: the FAL key never reaches the browser. If Supabase Storage
// is configured the image is copied there for permanent hosting (fal.ai URLs
// are temporary); otherwise the fal.ai URL is returned directly.

const json = (statusCode, data, origin) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(data),
});

// Map a friendly ratio to a fal.ai image_size preset.
const SIZE = {
  square: 'square_hd',
  portrait: 'portrait_4_3',
  story: 'portrait_16_9',
  landscape: 'landscape_4_3',
  wide: 'landscape_16_9',
};

async function persistToSupabase(url, prompt) {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  const bucket = process.env.SUPABASE_BUCKET || 'generated';
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  try {
    const { createClient } = require('@supabase/supabase-js');
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get('content-type') || 'image/jpeg';
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
    const path = `ai/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const up = await sb.storage.from(bucket).upload(path, buf, { contentType: ct, upsert: false });
    if (up.error) return null;
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (e) {
    return null;
  }
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '*';
  if (event.httpMethod === 'OPTIONS') return json(204, {}, origin);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' }, origin);

  const key = process.env.FAL_KEY;
  if (!key) return json(503, { error: 'not_configured', detail: 'FAL_KEY missing' }, origin);

  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'bad_json' }, origin); }

  const prompt = String(b.prompt || '').slice(0, 1000).trim();
  if (!prompt) return json(400, { error: 'missing_prompt' }, origin);
  const image_size = SIZE[b.ratio] || 'square_hd';
  const model = process.env.FAL_MODEL || 'fal-ai/flux/schnell';

  try {
    const r = await fetch(`https://fal.run/${model}`, {
      method: 'POST',
      headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, image_size, num_images: 1, enable_safety_checker: true }),
    });
    if (!r.ok) {
      const t = await r.text();
      return json(502, { error: 'upstream', status: r.status, detail: t.slice(0, 300) }, origin);
    }
    const data = await r.json();
    const falUrl = data.images?.[0]?.url;
    if (!falUrl) return json(502, { error: 'no_image' }, origin);
    const persisted = await persistToSupabase(falUrl, prompt);
    return json(200, { imageUrl: persisted || falUrl, persisted: !!persisted, prompt }, origin);
  } catch (e) {
    return json(502, { error: 'fetch_failed', detail: String(e).slice(0, 200) }, origin);
  }
};
