import { createClient } from "@supabase/supabase-js";

const isStaging = process.env.REACT_APP_USE_STAGING === "true";

const supabaseUrl = isStaging
  ? process.env.REACT_APP_STAGING_SUPABASE_URL
  : process.env.REACT_APP_SUPABASE_URL;

const supabaseAnonKey = isStaging
  ? process.env.REACT_APP_STAGING_SUPABASE_ANON_KEY
  : process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
