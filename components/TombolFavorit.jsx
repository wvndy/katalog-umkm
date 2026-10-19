"use client";

import { useState, useEffect } from "react";

const KUNCI_FAVORIT = "katalog_favorit";

export function ambilFavorit() {
  try {
    const raw = localStorage.getItem(KUNCI_FAVORIT);
    const data = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function simpanFavorit(daftar) {
  try {
    localStorage.setItem(KUNCI_FAVORIT, JSON.stringify(daftar));
    window.dispatchEvent(new Event("favorit-berubah"));
  } catch {}
}

export default function TombolFavorit({ produk, varian = "kecil" }) {
  const [adalahFavorit, setAdalahFavorit] = useState(false);

  useEffect(() => {
    function cekStatus() {
      const daftar = ambilFavorit();
      setAdalahFavorit(daftar.some((item) => String(item.id) === String(produk?.id)));
    }

    cekStatus();
    window.addEventListener("favorit-berubah", cekStatus);
    return () => window.removeEventListener("favorit-berubah", cekStatus);
  }, [produk?.id]);

  function toggleFavorit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!produk?.id) return;

    const daftar = ambilFavorit();
    const sudahAda = daftar.some((item) => String(item.id) === String(produk.id));

    if (sudahAda) {
      const baru = daftar.filter((item) => String(item.id) !== String(produk.id));
      simpanFavorit(baru);
      setAdalahFavorit(false);
    } else {
      const itemBaru = {
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        foto_url: produk.foto_url,
        kategori: produk.kategori,
      };
      simpanFavorit([itemBaru, ...daftar]);
      setAdalahFavorit(true);
    }
  }

  if (varian === "besar") {
    return (
      <button
        type="button"
        onClick={toggleFavorit}
        aria-label={adalahFavorit ? "Hapus dari favorit" : "Tambah ke favorit"}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
          adalahFavorit
            ? "border-bahaya bg-latar text-bahaya hover:bg-permukaan"
            : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={adalahFavorit ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        {adalahFavorit ? "Tersimpan di Favorit" : "Simpan ke Favorit"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFavorit}
      aria-label={adalahFavorit ? "Hapus dari favorit" : "Tambah ke favorit"}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-latar/80 text-teks backdrop-blur transition-transform hover:scale-110"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={adalahFavorit ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        className={`h-4 w-4 ${adalahFavorit ? "text-bahaya fill-bahaya" : "text-teks"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
