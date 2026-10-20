"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ambilKeranjang, ubahJumlahKeranjang, hapusDariKeranjang, kosongkanKeranjang, hitungTotalHarga } from "@/lib/keranjang";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";

export default function HalamanKeranjang() {
  const [daftar, setDaftar] = useState([]);
  const [sudahMount, setSudahMount] = useState(false);

  useEffect(() => {
    function muat() {
      setDaftar(ambilKeranjang());
      setSudahMount(true);
    }
    muat();
    window.addEventListener("keranjang-berubah", muat);
    return () => window.removeEventListener("keranjang-berubah", muat);
  }, []);

  const totalHarga = daftar.reduce((t, item) => t + item.harga * item.jumlah, 0);

  function buatPesanWA() {
    let pesan = "Halo, saya ingin memesan:\n\n";
    daftar.forEach((item, idx) => {
      pesan += `${idx + 1}. ${item.nama} — ${item.jumlah}x ${formatRupiah(item.harga)} = ${formatRupiah(item.harga * item.jumlah)}`;
      if (item.catatan) pesan += ` (${item.catatan})`;
      pesan += "\n";
    });
    pesan += `\nTotal: ${formatRupiah(totalHarga)}`;
    return `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
  }

  function handleKosongkan() {
    if (window.confirm("Kosongkan seluruh keranjang?")) {
      kosongkanKeranjang();
      setDaftar([]);
    }
  }

  if (!sudahMount) {
    return <div className="py-16 text-center text-teks-lembut">Memuat keranjang...</div>;
  }

  return (
    <div className="flex flex-col gap-8 py-10 sm:py-14">
      <div>
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          ← Kembali ke katalog
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">Keranjang Belanja</h1>
          {daftar.length > 0 && (
            <button type="button" onClick={handleKosongkan} className="text-sm font-semibold text-bahaya underline hover:opacity-80">
              Kosongkan
            </button>
          )}
        </div>
      </div>

      {daftar.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-garis bg-permukaan p-8">
          <p className="text-lg font-bold">Keranjang masih kosong</p>
          <p className="text-sm text-teks-lembut">Tambahkan produk dari katalog untuk mulai belanja.</p>
          <Tombol href="/">Jelajahi Produk</Tombol>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {daftar.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-garis bg-latar p-4">
                <Link href={`/produk/${item.id}`} className="shrink-0">
                  <img src={item.foto_url || "/produk/keripik.svg"} alt="" className="h-16 w-16 rounded-lg bg-permukaan object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/produk/${item.id}`} className="font-semibold hover:text-utama line-clamp-1">
                    {item.nama}
                  </Link>
                  <p className="text-sm text-teks-lembut">{formatRupiah(item.harga)} / item</p>
                  {item.catatan && <p className="text-xs text-teks-lembut">Catatan: {item.catatan}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => ubahJumlahKeranjang(item.id, item.jumlah - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar font-bold hover:border-utama">
                    −
                  </button>
                  <span className="w-8 text-center font-bold">{item.jumlah}</span>
                  <button type="button" onClick={() => ubahJumlahKeranjang(item.id, item.jumlah + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar font-bold hover:border-utama">
                    +
                  </button>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-harga">{formatRupiah(item.harga * item.jumlah)}</span>
                  <button type="button" onClick={() => hapusDariKeranjang(item.id)} className="text-xs text-bahaya underline hover:opacity-80">
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-6">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Total ({daftar.reduce((t, i) => t + i.jumlah, 0)} item)</span>
              <span className="text-xl font-extrabold text-harga">{formatRupiah(totalHarga)}</span>
            </div>
            <a
              href={buatPesanWA()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap"
            >
              Pesan Semua via WhatsApp
            </a>
          </div>
        </>
      )}
    </div>
  );
}
