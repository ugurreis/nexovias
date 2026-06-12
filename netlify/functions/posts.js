// Netlify Function — post persistence via Supabase (Postgres).
// Server-side only: the service key never reaches the browser, so the table can
// keep RLS on with no public policies (the service role bypasses RLS).
//   GET  ?ws=<workspace>            -> { posts: [...] }
//   POST  body { posts:[...] }      -> replace the workspace set (upsert + prune)
// Best-effort: if Supabase isn't configured it returns 503 and the frontend
// keeps using localStorage.

const json = (statusCode, data, origin) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(data),
});

function client() {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
}

const rowToPost = (r) => r.data;
const postToRow = (p, ws) => ({
  id: String(p.id),
  workspace: ws,
  status: p.status || 'draft',
  scheduled_at: p.scheduledAt || null,
  created_at: p.createdAt || new Date().toISOString(),
  data: p,
});

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '*';
  if (event.httpMethod === 'OPTIONS') return json(204, {}, origin);

  const sb = client();
  if (!sb) return json(503, { error: 'not_configured', detail: 'SUPABASE_URL / SUPABASE_SERVICE_KEY missing' }, origin);

  const ws = String((event.queryStringParameters && event.queryStringParameters.ws) || 'demo').slice(0, 64);

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await sb.from('posts').select('data').eq('workspace', ws).order('created_at', { ascending: false });
      if (error) return json(500, { error: 'db', detail: error.message }, origin);
      return json(200, { posts: (data || []).map(rowToPost).filter(Boolean) }, origin);
    }

    if (event.httpMethod === 'POST') {
      let b = {};
      try { b = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'bad_json' }, origin); }
      const incoming = Array.isArray(b.posts) ? b.posts.filter((p) => p && p.id) : [];
      const rows = incoming.map((p) => postToRow(p, ws));

      if (rows.length) {
        const { error: upErr } = await sb.from('posts').upsert(rows, { onConflict: 'id' });
        if (upErr) return json(500, { error: 'db_upsert', detail: upErr.message }, origin);
      }
      // Prune rows that are no longer present for this workspace.
      const { data: existing, error: exErr } = await sb.from('posts').select('id').eq('workspace', ws);
      if (!exErr && existing) {
        const keep = new Set(incoming.map((p) => String(p.id)));
        const drop = existing.map((r) => r.id).filter((id) => !keep.has(id));
        if (drop.length) await sb.from('posts').delete().eq('workspace', ws).in('id', drop);
      }
      return json(200, { ok: true, count: rows.length }, origin);
    }

    return json(405, { error: 'method_not_allowed' }, origin);
  } catch (e) {
    return json(500, { error: 'exception', detail: String(e).slice(0, 200) }, origin);
  }
};
