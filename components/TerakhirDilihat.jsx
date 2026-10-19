"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

const KUNCI_STORAGE = "katalog_terakhir_dilihat";

export default function TerakhirDilihat() {
  const [daftar, setDaftar] = useState([]);
  const [sudahMount, setSudahMount] = useState(false);

  useEffect(() => {
    setSudahMount(true);
    try {
      const data = JSON.parse(localStorage.getItem(KUNCI_STORAGE) || "[]");
      if (Array.isArray(data) && data.length > 0) {
        setDaftar(data);
      }
    } catch {
      setDaftar([]);
    }
  }, []);

  if (!sudahMount || daftar.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="judul-terakhir-dilihat" className="mt-8 flex flex-col gap-4 border-t border-garis pt-8">
      <div className="flex items-center justify-between">
        <h2 id="judul-terakhir-dilihat" className="text-xl font-bold">
          Terakhir dilihat
        </h2>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem(KUNCI_STORAGE);
              setDaftar([]);
            } catch {}
          }}
          className="text-xs text-teks-lembut underline hover:text-bahaya"
        >
          Hapus riwayat
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {daftar.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}
