import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const LISTING_IMAGES_BUCKET = "listing-images";

let supabaseAdmin: SupabaseClient | null | undefined;

export function getSupabaseAdmin() {
  if (supabaseAdmin !== undefined) {
    return supabaseAdmin;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    supabaseAdmin = null;
    return supabaseAdmin;
  }

  supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}
