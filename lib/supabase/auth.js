import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Koneksi Supabase dengan sesi admin (Server Action / Server Component).
 * Memakai SUPABASE_PUBLISHABLE_KEY dan cookie browser via @supabase/ssr.
 */
export async function buatClientAuth() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Environment variable SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diisi. " +
        "Salin .env.example menjadi .env.local dan isi nilainya."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Abaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}

