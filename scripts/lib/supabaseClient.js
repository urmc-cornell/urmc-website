// Server-side administration only; never import this module from src/.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error("Admin scripts require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Anonymous keys cannot write member data.");
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
