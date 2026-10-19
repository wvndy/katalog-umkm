import { createClient } from "@supabase/supabase-js";

/**
 * Koneksi Supabase untuk server (Server Component, Server Action, Route Handler).
 * Memakai SUPABASE_SECRET_KEY untuk melewati RLS — gunakan hanya untuk membaca data publik.
 */
export function buatClientServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Environment variable SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi. " +
        "Salin .env.example menjadi .env.local dan isi nilainya."
    );
  }

  return createClient(url, key);
}

