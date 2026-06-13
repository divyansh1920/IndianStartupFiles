// ═══════════════════════════════════════════════════════
// supabase-stats.js  — include in every page
// GET YOUR CREDENTIALS: Supabase → Project Settings → API
// ═══════════════════════════════════════════════════════

const SUPABASE_URL = 'https://kneqsnlxuunbgpjrvyjv.supabase.co'; // ← REPLACE THIS
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZXFzbmx4dXVuYmdwanJ2eWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMzI0NjAsImV4cCI6MjA5NjgwODQ2MH0.Y5xqs7BcESwmknc9kU_z4aCeGKkDTQkIqJGqf6Vo3YE';           // ← REPLACE THIS

const _H = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json'
};

// Call a Supabase stored procedure
async function ssRpc(fnName, params) {
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/rpc/' + fnName, {
      method: 'POST',
      headers: _H,
      body: JSON.stringify(params || {})
    });
    if (!res.ok) {
      const errText = await res.text();
      console.warn('Supabase RPC failed:', fnName, res.status, errText);
      return null;
    }
    const text = await res.text();
    if (!text || text === 'null') return null;
    const parsed = JSON.parse(text);
    // Supabase sometimes wraps scalar returns in array — unwrap it
    return Array.isArray(parsed) ? (parsed[0] ?? null) : parsed;
  } catch(e) {
    console.warn('Supabase error:', fnName, e);
    return null;
  }
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
  } catch(e) {
    return { views: 0, likes: 0, dislikes: 0 };
  }
}

// Get stats for ALL articles (used on listing page)
async function ssGetAllStats() {
  try {
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/article_stats?select=slug,views,likes,dislikes',
      { headers: _H }
    );
    return await res.json();
  } catch(e) {
    return [];
  }
}

// Format: 1500 → "1.5K", 1200000 → "1.2M"
function ssFmt(n) {
  n = parseInt(n) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
  return '' + n;
}

// Get total debate votes across all debates
async function ssGetTotalVotes() {
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/rpc/get_total_votes', {
      method: 'POST',
      headers: _H,
      body: JSON.stringify({})
    });
    if (!res.ok) return 0;
    const text = await res.text();
    return parseInt(text) || 0;
  } catch(e) { return 0; }
}

// Expose on window so all pages can use it
window.SS = { rpc: ssRpc, getStats: ssGetStats, getAllStats: ssGetAllStats, fmt: ssFmt, getTotalVotes: ssGetTotalVotes };
