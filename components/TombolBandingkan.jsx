"use client";

import { useState, useEffect } from "react";
import { ambilBandingkan, toggleBandingkan } from "@/lib/bandingkan";

export default function TombolBandingkan({ produk }) {
  const [dipilih, setDipilih] = useState(false);

  useEffect(() => {
    function cek() {
      const daftar = ambilBandingkan();
      setDipilih(daftar.some((item) => String(item.id) === String(produk?.id)));
    }
    cek();
    window.addEventListener("bandingkan-berubah", cek);
    return () => window.removeEventListener("bandingkan-berubah", cek);
  }, [produk?.id]);

  function handle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!produk?.id) return;
    toggleBandingkan(produk);
  }

  return (
    <button
      type="button"
      onClick={handle}
      title={dipilih ? "Hapus dari perbandingan" : "Bandingkan produk ini"}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
        dipilih
          ? "border-utama bg-utama/10 text-utama"
          : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
      {dipilih ? "Dipilih" : "Bandingkan"}
    </button>
  );
}
