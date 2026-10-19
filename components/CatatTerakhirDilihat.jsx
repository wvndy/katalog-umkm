"use client";

import { useEffect } from "react";

const KUNCI_STORAGE = "katalog_terakhir_dilihat";
const BATAS_MAKSIMAL = 6;

export default function CatatTerakhirDilihat({ produk }) {
  useEffect(() => {
    if (!produk?.id) return;

    try {
      const dataLama = JSON.parse(localStorage.getItem(KUNCI_STORAGE) || "[]");
      const filtered = Array.isArray(dataLama)
        ? dataLama.filter((item) => String(item.id) !== String(produk.id))
        : [];

      const dataBaru = [
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          foto_url: produk.foto_url,
          kategori: produk.kategori,
        },
        ...filtered,
      ].slice(0, BATAS_MAKSIMAL);

      localStorage.setItem(KUNCI_STORAGE, JSON.stringify(dataBaru));
    } catch {
      // Abaikan jika localStorage tidak didukung atau penuh
    }
  }, [produk]);

  return null;
}
