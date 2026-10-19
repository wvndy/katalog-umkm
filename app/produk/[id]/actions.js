"use server";

import { buatClientServer } from "@/lib/supabase/server";
import { tanyaJawabProdukAI } from "@/lib/gemini";

const riwayatTanyaAI = globalThis.__riwayatTanyaAI || new Map();
globalThis.__riwayatTanyaAI = riwayatTanyaAI;

const BATAS_TANYA = 6;
const JENDELA_TANYA_MS = 60 * 1000;

function cekRateLimitTanya(identitas) {
  const sekarang = Date.now();
  const daftar = (riwayatTanyaAI.get(identitas) || []).filter(
    (waktu) => sekarang - waktu < JENDELA_TANYA_MS
  );

  if (daftar.length >= BATAS_TANYA) {
    return false;
  }

  daftar.push(sekarang);
  riwayatTanyaAI.set(identitas, daftar);
  return true;
}

export async function tanyaAsistenProdukAksi(prevState, formData) {
  const idProduk = formData.get("id_produk")?.toString()?.trim();
  const pertanyaan = formData.get("pertanyaan")?.toString()?.trim();

  if (!pertanyaan) {
    return { error: "Silakan ketik pertanyaan terlebih dahulu." };
  }

  if (pertanyaan.length > 200) {
    return {
      error: "Pertanyaan terlalu panjang. Maksimal 200 karakter agar jawaban lebih akurat.",
    };
  }

  if (pertanyaan.length < 3) {
    return { error: "Pertanyaan terlalu pendek." };
  }

  const idPengguna = "anonim";
  if (!cekRateLimitTanya(idPengguna)) {
    return {
      error: "Anda terlalu sering bertanya. Tunggu 1 menit sebelum mengirim pertanyaan lagi.",
    };
  }

  try {
    const supabase = buatClientServer();
    const { data: produk, error: dbError } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, kategori, status_stok")
      .eq("id", idProduk)
      .maybeSingle();

    if (dbError || !produk) {
      return { error: "Data produk tidak ditemukan untuk dijawab oleh AI." };
    }

    const jawaban = await tanyaJawabProdukAI(produk, pertanyaan);
    return { jawaban, pertanyaanTerakhir: pertanyaan, error: null };
  } catch (err) {
    return {
      error:
        err.message ||
        "Gagal mendapatkan respon dari AI. Coba tanyakan hal lain atau tanyakan via WhatsApp.",
    };
  }
}
