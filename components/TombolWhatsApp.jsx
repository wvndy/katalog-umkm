"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [catatanVarian, setCatatanVarian] = useState("");

  const habis =
    produk?.status_stok === "habis" ||
    (produk?.stok !== undefined && Number(produk.stok) <= 0);

  const hargaSatuan =
    produk?.harga_diskon && produk.harga_diskon < produk.harga
      ? produk.harga_diskon
      : produk?.harga || 0;

  const totalHarga = hargaSatuan * jumlah;

  let teksPesan = `Halo, saya ingin memesan ${jumlah}x ${produk?.nama}`;
  if (catatanVarian.trim()) {
    teksPesan += ` (varian/catatan: ${catatanVarian.trim()})`;
  }
  teksPesan += ` dengan total ${formatRupiah(totalHarga)}.`;

  const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teksPesan)}`;

  function handleKlikPesan() {
    // US-40: Catat klik tanpa menghambat navigasi dan tanpa data pribadi
    try {
      if (produk?.id) {
        fetch("/api/klik-wa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produk_id: produk.id }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }

  if (habis) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-garis bg-permukaan p-5 text-center">
        <span className="rounded-lg bg-teks-lembut/15 py-3 text-sm font-bold text-teks-lembut">
          Stok Habis Sementara
        </span>
        <p className="text-xs text-teks-lembut">
          Mohon maaf, produk ini sedang tidak tersedia untuk dipesan.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-garis bg-permukaan p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold">Jumlah pesanan</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            onClick={() => setJumlah((j) => Math.max(1, j - 1))}
            disabled={jumlah <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold transition-colors hover:border-utama disabled:opacity-40"
          >
            -
          </button>
          <span className="w-8 text-center font-bold">{jumlah}</span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            onClick={() => setJumlah((j) => j + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold transition-colors hover:border-utama"
          >
            +
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-teks-lembut">
        Pilihan varian atau catatan (opsional)
        <input
          type="text"
          value={catatanVarian}
          onChange={(e) => setCatatanVarian(e.target.value)}
          placeholder="Contoh: rasa pedas, ukuran L, dll."
          className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </label>

      <div className="flex items-center justify-between border-t border-garis pt-3 text-sm">
        <span className="text-teks-lembut">Total perkiraan:</span>
        <span className="text-base font-extrabold text-harga">{formatRupiah(totalHarga)}</span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleKlikPesan}
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
