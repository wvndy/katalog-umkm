"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { ambilFavorit, simpanFavorit } from "@/components/TombolFavorit";

export default function HalamanFavorit() {
  const [daftar, setDaftar] = useState([]);
  const [sudahMount, setSudahMount] = useState(false);

  useEffect(() => {
    function muat() {
      setDaftar(ambilFavorit());
      setSudahMount(true);
    }
    muat();
    window.addEventListener("favorit-berubah", muat);
    return () => window.removeEventListener("favorit-berubah", muat);
  }, []);

  function kosongkan() {
    if (window.confirm("Hapus semua produk dari daftar favorit?")) {
      simpanFavorit([]);
      setDaftar([]);
    }
  }

  if (!sudahMount) {
    return (
      <div className="py-16 text-center text-teks-lembut">
        Memuat daftar favorit...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-10 sm:py-14">
      <div>
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          ← Kembali ke katalog
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Produk Favorit
            </h1>
            <p className="mt-1 text-sm text-teks-lembut">
              {daftar.length} produk tersimpan di browser ini
            </p>
          </div>
          {daftar.length > 0 && (
            <button
              type="button"
              onClick={kosongkan}
              className="text-sm font-semibold text-bahaya underline underline-offset-4 hover:opacity-80"
            >
              Kosongkan semua favorit
            </button>
          )}
        </div>
      </div>

      {daftar.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-garis bg-permukaan p-8">
          <p className="text-lg font-bold">Belum ada produk favorit</p>
          <p className="text-sm text-teks-lembut">
            Tekan ikon hati pada produk apa pun untuk menyimpannya di sini agar mudah ditemukan lagi.
          </p>
          <Tombol href="/">Jelajahi Produk</Tombol>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {daftar.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}
