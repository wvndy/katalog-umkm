"use client";

import { useState, useEffect } from "react";
import { ambilKeranjang, tambahKeKeranjang } from "@/lib/keranjang";

export default function TombolKeranjang({ produk }) {
  const [diKeranjang, setDiKeranjang] = useState(false);
  const [animasi, setAnimasi] = useState(false);

  useEffect(() => {
    function cek() {
      const daftar = ambilKeranjang();
      setDiKeranjang(daftar.some((item) => String(item.id) === String(produk?.id)));
    }
    cek();
    window.addEventListener("keranjang-berubah", cek);
    return () => window.removeEventListener("keranjang-berubah", cek);
  }, [produk?.id]);

  function handleTambah(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!produk?.id) return;
    tambahKeKeranjang(produk, 1);
    setDiKeranjang(true);
    setAnimasi(true);
    setTimeout(() => setAnimasi(false), 600);
  }

  const habis = produk?.status_stok === "habis" || (produk?.stok !== undefined && Number(produk.stok) <= 0);
  if (habis) return null;

  return (
    <button
      type="button"
      onClick={handleTambah}
      title={diKeranjang ? "Sudah di keranjang (klik untuk tambah)" : "Tambah ke keranjang"}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
        diKeranjang
          ? "border-utama bg-utama/10 text-utama"
          : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
      } ${animasi ? "scale-110" : ""}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      {diKeranjang ? "Di keranjang" : "Keranjang"}
    </button>
  );
}
