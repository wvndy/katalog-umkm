import { buatClientServer } from "@/lib/supabase/server";
import { toko as tokoCadangan } from "@/lib/toko";

export async function ambilPengaturanToko() {
  try {
    const supabase = buatClientServer();
    const { data } = await supabase
      .from("pengaturan_toko")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (data && data.nama) {
      return {
        nama: data.nama,
        tagline: data.tagline || tokoCadangan.tagline,
        nomorWhatsApp: data.nomor_whatsapp || tokoCadangan.nomorWhatsApp,
        alamat: data.alamat || tokoCadangan.alamat,
        jamBuka: data.jam_buka || tokoCadangan.jamBuka,
      };
    }
  } catch {}
  return tokoCadangan;
}
