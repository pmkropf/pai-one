// PAI° ONE — Unified API
// Handles AI chat, auth, and user data — all in one function
// BLAINK° Technologies LLC

const https = require("https");

function httpsRequest(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: data ? { ...headers, "Content-Length": Buffer.byteLength(data) } : headers,
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => raw += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch(e) { resolve({ status: res.statusCode, data: { error: raw.substring(0, 200) } }); }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ status: "PAI API running", endpoints: ["ai", "auth", "data"] });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch(e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { type } = body || {};

  // ── AI CHAT ──
  if (type === "ai" || !type) {
    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Anthropic key not configured" });
    const h = {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    };
    try {
      const r = await httpsRequest("POST", "https://api.anthropic.com/v1/messages", h, body.payload || body);
      return res.status(r.status).json(r.data);
    } catch(e) {
      return res.status(500).json({ error: "AI request failed", detail: String(e) });
    }
  }

  // ── AUTH ──
  if (type === "auth") {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: "Supabase not configured", hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_KEY });
    }
    const { action, email, password, token } = body;
    const baseH = { "Content-Type": "application/json", "apikey": SUPABASE_KEY };
    try {
      if (action === "signup") {
        const r = await httpsRequest("POST", `${SUPABASE_URL}/auth/v1/signup`, baseH, { email, password });
        return res.status(r.status).json(r.data);
      }
      if (action === "signin") {
        const r = await httpsRequest("POST", `${SUPABASE_URL}/auth/v1/token?grant_type=password`, baseH, { email, password });
        return res.status(r.status).json(r.data);
      }
      if (action === "signout") {
        await httpsRequest("POST", `${SUPABASE_URL}/auth/v1/logout`, { ...baseH, "Authorization": `Bearer ${token}` }, {});
        return res.status(200).json({ success: true });
      }
      if (action === "getuser") {
        const r = await httpsRequest("GET", `${SUPABASE_URL}/auth/v1/user`, { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }, null);
        return res.status(r.status).json(r.data);
      }
      return res.status(400).json({ error: `Unknown auth action: ${action}` });
    } catch(e) {
      return res.status(500).json({ error: "Auth failed", detail: String(e) });
    }
  }

  // ── USER DATA ──
  if (type === "data") {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
    if (!SUPABASE_URL || !SUPABASE_KEY) return res.status(500).json({ error: "Supabase not configured" });
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    // Verify token
    const userR = await httpsRequest("GET", `${SUPABASE_URL}/auth/v1/user`, { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}` }, null);
    if (!userR.data?.id) return res.status(401).json({ error: "Invalid token" });
    const userId = userR.data.id;

    if (body.action === "load") {
      const r = await httpsRequest("GET",
        `${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}&select=payload`,
        { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        null
      );
      const rows = Array.isArray(r.data) ? r.data : [];
      return res.status(200).json({ payload: rows[0]?.payload || null });
    }

    if (body.action === "save") {
      const r = await httpsRequest("POST",
        `${SUPABASE_URL}/rest/v1/user_data`,
        {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        { user_id: userId, payload: body.payload, updated_at: new Date().toISOString() }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Unknown data action" });
  }

  return res.status(400).json({ error: "Missing or unknown type field" });
};
