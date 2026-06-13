const SUPABASE_URL = 'https://kneqsnlxuunbgpjrvyjv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZXFzbmx4dXVuYmdwanJ2eWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMzI0NjAsImV4cCI6MjA5NjgwODQ2MH0.Y5xqs7BcESwmknc9kU_z4aCeGKkDTQkIqJGqf6Vo3YE';

const _H = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json'
};

// Call RPC function (views/likes/dislikes)
async function ssRpc(fnName, params) {
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/rpc/' + fnName, {
      method: 'POST', headers: _H, body: JSON.stringify(params || {})
    });
    if (!res.ok) {
      console.warn('Supabase RPC failed:', fnName, res.status, await res.text());
      return null;
    }
    const text = await res.text();
    if (!text || text === 'null') return null;
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? (parsed[0] ?? null) : parsed;
  } catch(e) { console.warn('Supabase error:', fnName, e); return null; }
}

// Get stats for ONE article slug
async function ssGetStats(slug) {
  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/article_stats?slug=eq.' + encodeURIComponent(slug) + '&select=views,likes,dislikes',
      { headers: _H }
    );
    const data = await res.json();
    return data[0] || { views: 0, likes: 0, dislikes: 0 };
  } catch(e) { return { views: 0, likes: 0, dislikes: 0 }; }
}

// Get stats for ALL articles
async function ssGetAllStats() {
  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/article_stats?select=slug,views,likes,dislikes',
      { headers: _H }
    );
    return await res.json();
  } catch(e) { return []; }
}

// ── DEBATE VOTES (direct REST, no RPC function needed) ──

// INSERT one vote directly — returns true if success
async function ssVote(debateId, side) {
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/debate_votes', {
      method: 'POST',
      headers: { ..._H, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ debate_id: debateId, side: side })
    });
    if (!res.ok) {
      console.warn('Vote insert failed:', res.status, await res.text());
      return false;
    }
    return true;
  } catch(e) { console.warn('Vote error:', e); return false; }
}

// GET vote counts for one debate — returns { a, b, total }
async function ssGetDebateVotes(debateId) {
  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/debate_votes?debate_id=eq.' + debateId + '&select=side',
      { headers: _H }
    );
    if (!res.ok) return { a: 0, b: 0, total: 0 };
    const rows = await res.json();
    const a = rows.filter(r => r.side === 'A').length;
    const b = rows.filter(r => r.side === 'B').length;
    return { a, b, total: a + b };
  } catch(e) { return { a: 0, b: 0, total: 0 }; }
}

// GET total votes across ALL debates
async function ssGetTotalVotes() {
  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/debate_votes?select=id&limit=0',
      { headers: { ..._H, 'Prefer': 'count=exact' } }
    );
    if (!res.ok) return 0;
    const range = res.headers.get('content-range') || '';
    const parts = range.split('/');
    return parseInt(parts[parts.length - 1]) || 0;
  } catch(e) { return 0; }
}

// Format numbers
function ssFmt(n) {
  n = parseInt(n) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return '' + n;
}

window.SS = {
  rpc:             ssRpc,
  getStats:        ssGetStats,
  getAllStats:      ssGetAllStats,
  fmt:             ssFmt,
  vote:            ssVote,
  getDebateVotes:  ssGetDebateVotes,
  getTotalVotes:   ssGetTotalVotes
};
