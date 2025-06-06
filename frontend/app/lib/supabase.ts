// app/lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = typeof window !== "undefined"
  ? window.ENV?.SUPABASE_URL
  : process.env.SUPABASE_URL;

const supabaseAnonKey = typeof window !== "undefined"
  ? window.ENV?.SUPABASE_ANON_KEY
  : process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
