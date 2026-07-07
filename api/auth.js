// PAI° ONE — Auth API
// BLAINK° Technologies LLC

const https = require("https");

function httpsPost(url, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "POST",
      headers: { ...headers, "Content-Length": Buffer.byteLength(data) },
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => raw += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch(e) { resolve({ status: res.statusCode, data: { error: raw } }); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "GET",
      headers,
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => raw += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch(e) { resolve({ status: res.statusCode, data: { error: raw } }); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ status: "Auth API running" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: "Supabase not configured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch(e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { action, email, password, token } = body || {};

  try {
    if (action === "signup") {
      const h = { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY };
      const r = await httpsPost(`${SUPABASE_URL}/auth/v1/signup`, h, { email, password });
      return res.status(r.status).json(r.data);
    }

    if (action === "signin") {
      const h = { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY };
      const r = await httpsPost(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, h, { email, password });
      return res.status(r.status).json(r.data);
    }

    if (action === "signout") {
      const h = { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${token}` };
      await httpsPost(`${SUPABASE_URL}/auth/v1/logout`, h, {});
      return res.status(200).json({ success: true });
    }

    if (action === "getuser") {
      const h = { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${token}` };
      const r = await httpsGet(`${SUPABASE_URL}/auth/v1/user`, h);
      return res.status(r.status).json(r.data);
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });

  } catch (err) {
    return res.status(500).json({ error: "Request failed", detail: String(err) });
  }
};
