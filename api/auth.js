// PAI° ONE — Auth API
// Handles signup and signin server-side
// BLAINK° Technologies LLC

module.exports = async function handler(req, res) {
  // Allow GET for testing
  if (req.method === "GET") {
    return res.status(200).json({ status: "Auth API is running" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({
      error: "Supabase not configured",
      hasUrl: !!SUPABASE_URL,
      hasKey: !!SUPABASE_ANON_KEY
    });
  }

  // Parse body safely
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch(e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const { action, email, password, token } = body || {};

  if (!action) {
    return res.status(400).json({ error: "Missing action field" });
  }

  try {
    // SIGN UP
    if (action === "signup") {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      return res.status(r.status).json(data);
    }

    // SIGN IN
    if (action === "signin") {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      return res.status(r.status).json(data);
    }

    // SIGN OUT
    if (action === "signout") {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${token}`,
        },
      });
      return res.status(200).json({ success: true });
    }

    // GET USER
    if (action === "getuser") {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await r.json();
      return res.status(r.status).json(data);
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });

  } catch (err) {
    return res.status(500).json({
      error: "Auth request failed",
      detail: String(err),
      action
    });
  }
};
