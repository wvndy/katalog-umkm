import { buatClientAuth } from "@/lib/supabase/auth";

export async function catatLog(adminEmail, aksi, rincian = "") {
  try {
    const supabase = await buatClientAuth();
    await supabase.from("log_aktivitas").insert({
      admin_email: adminEmail,
      aksi,
      rincian: rincian || null,
    });
  } catch {
    // Gagal mencatat log tidak boleh menghentikan aksi utama
  }
}
