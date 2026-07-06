// PAI° ONE — User Data API
// Handles saving and loading real user financial data to/from Supabase
// BLAINK° Technologies LLC

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  // Get the user's auth token from the request header
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Verify the token and get the user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // GET — load this user's saved data
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("user_data")
      .select("payload")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows found, that's fine
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ payload: data?.payload || null });
  }

  // POST — save this user's data
  if (req.method === "POST") {
    const { payload } = req.body;
    if (!payload) {
      return res.status(400).json({ error: "No payload provided" });
    }

    // Upsert — insert if first time, update if already exists
    const { error } = await supabase
      .from("user_data")
      .upsert({
        user_id: user.id,
        payload,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
