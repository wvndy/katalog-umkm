import { buatClientServer } from "@/lib/supabase/server";

const UKURAN_MAKSIMAL = 2 * 1024 * 1024; // 2 MB
const TIPE_DIIZINKAN = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function unggahFotoStorage(file) {
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }

  if (file.size > UKURAN_MAKSIMAL) {
    throw new Error("Ukuran file foto maksimal 2 MB.");
  }

  if (!TIPE_DIIZINKAN.includes(file.type)) {
    throw new Error("Format file harus berupa gambar (JPG, PNG, atau WebP).");
  }

  const supabase = buatClientServer();
  const ekstensi = file.name?.split(".").pop()?.toLowerCase() || "jpg";
  const namaFile = `produk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ekstensi}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from("produk").upload(namaFile, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error("Gagal mengunggah foto ke penyimpanan server.");
  }

  const { data } = supabase.storage.from("produk").getPublicUrl(namaFile);
  return data.publicUrl;
}
