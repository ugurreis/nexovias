// Netlify Function — AI caption generation via OpenAI.
// Server-side only: the API key never reaches the browser. If the key is not
// configured it returns 503 so the frontend can fall back to its on-device
// generator. The site keeps working with or without a backend.

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

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '*';
  if (event.httpMethod === 'OPTIONS') return json(204, {}, origin);
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' }, origin);

  const key = process.env.OPENAI_API_KEY;
  if (!key) return json(503, { error: 'not_configured', detail: 'OPENAI_API_KEY missing' }, origin);

  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'bad_json' }, origin); }

  const link = String(b.link || '').slice(0, 500);
  const topic = String(b.topic || '').slice(0, 800);
  const hasMedia = !!b.hasMedia;
  const brand = String(b.brand || 'our brand').slice(0, 80);
  const platforms = Array.isArray(b.platforms) ? b.platforms.slice(0, 9).join(', ') : '';
  const tone = String(b.tone || 'confident, helpful, modern').slice(0, 80);

  const sys = `You are a senior social media copywriter for "${brand}". Write ONE short, scroll-stopping social post. Voice: ${tone}. Rules: a strong hook on the first line, then a value line, then a soft CTA. Use at most 1-2 tasteful emojis. End with 2-4 relevant hashtags on the last line. Plain text only — no markdown, no surrounding quotes. Keep it under ~280 characters when reasonable.`;
  let user;
  if (link) user = `Write a post promoting this link: ${link}${topic ? `\nContext: ${topic}` : ''}\nNaturally include the link in the post.`;
  else if (hasMedia) user = `Write a post to accompany an uploaded image/video.${topic ? ` Context: ${topic}` : ''}`;
  else user = `Write a post about: ${topic || 'a product update'}`;
  if (platforms) user += `\nTarget platforms: ${platforms}.`;

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
        temperature: 0.9,
        max_tokens: 240,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return json(502, { error: 'upstream', status: r.status, detail: t.slice(0, 300) }, origin);
    }
    const data = await r.json();
    let caption = String(data.choices?.[0]?.message?.content || '').trim().replace(/^["']|["']$/g, '');
    if (link && caption && !caption.includes(link)) caption += `\n${link}`;
    return json(200, { caption, model: data.model }, origin);
  } catch (e) {
    return json(502, { error: 'fetch_failed', detail: String(e).slice(0, 200) }, origin);
  }
};
