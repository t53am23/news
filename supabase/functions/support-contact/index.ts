import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, json } from "../_shared/normalizers.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.subject || !body?.message) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) {
    return json({ ok: true, mode: "dry-run", message: "Supabase credentials not configured. Form payload validated only." });
  }

  const supabase = createClient(supabaseUrl, serviceRole);
  const { error } = await supabase.from("support_messages").insert({
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
    created_at: new Date().toISOString()
  });

  if (error) return json({ error: error.message }, { status: 500 });
  return json({ ok: true });
});
