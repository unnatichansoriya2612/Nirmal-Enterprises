import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing from .env");
}

if (!supabasePublishableKey) {
  throw new Error(
    "SUPABASE_PUBLISHABLE_KEY is missing from .env"
  );
}

const supabaseAuth = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export default supabaseAuth;