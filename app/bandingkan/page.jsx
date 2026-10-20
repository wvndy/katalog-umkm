"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ambilBandingkan, kosongkanBandingkan } from "@/lib/bandingkan";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";

export default function HalamanBandingkan() {
  const [daftar, setDaftar] = useState([]);
  const [sudahMount, setSudahMount] = useState(false);

  useEffect(() => {
    function muat() {
      setDaftar(ambilBandingkan());
      setSudahMount(true);
    }
    muat();
    window.addEventListener("bandingkan-berubah", muat);
    return () => window.removeEventListener("bandingkan-berubah", muat);
  }, []);

  if (!sudahMount) {
    return <div className="py-16 text-center text-teks-lembut">Memuat...</div>;
  }

  if (daftar.length < 2) {
    return (
      <div className="flex flex-col gap-6 py-10 sm:py-14">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          ← Kembali ke katalog
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">Bandingkan Produk</h1>
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-garis bg-permukaan p-8">
          <p className="text-lg font-bold">Pilih 2 produk untuk dibandingkan</p>
          <p className="text-sm text-teks-lembut">
            Tekan tombol &ldquo;Bandingkan&rdquo; pada kartu produk di katalog untuk memilih produk. Saat ini baru {daftar.length} produk dipilih.
          </p>
          <Tombol href="/">Jelajahi Produk</Tombol>
        </div>
      </div>
    );
  }

  const [a, b] = daftar;
  const baris = [
    { label: "Foto", render: (p) => <img src={p.foto_url || "/produk/keripik.svg"} alt={p.nama} className="h-32 w-32 rounded-xl bg-permukaan object-cover" /> },
    { label: "Nama", render: (p) => <Link href={`/produk/${p.id}`} className="font-bold hover:text-utama">{p.nama}</Link> },
    { label: "Kategori", render: (p) => <span className="text-teks-lembut">{p.kategori || "Umum"}</span> },
    {
      label: "Harga",
      render: (p) => (
        <div className="flex flex-col gap-1">
          {p.harga_diskon && p.harga_diskon < p.harga ? (
            <>
              <span className="font-bold text-harga">{formatRupiah(p.harga_diskon)}</span>
              <span className="text-sm text-teks-lembut line-through">{formatRupiah(p.harga)}</span>
            </>
          ) : (
            <span className="font-bold text-harga">{formatRupiah(p.harga)}</span>
          )}
        </div>
      ),
    },
    { label: "Deskripsi", render: (p) => <p className="text-sm text-teks-lembut leading-relaxed">{p.deskripsi || "Tidak ada deskripsi."}</p> },
  ];

  return (
    <div className="flex flex-col gap-8 py-10 sm:py-14">
      <div>
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          ← Kembali ke katalog
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">Bandingkan Produk</h1>
          <button
            type="button"
            onClick={() => { kosongkanBandingkan(); setDaftar([]); }}
            className="text-sm font-semibold text-bahaya underline hover:opacity-80"
          >
            Hapus pilihan
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-garis">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold w-28">Aspek</th>
              <th className="px-4 py-3 font-semibold">Produk 1</th>
              <th className="px-4 py-3 font-semibold">Produk 2</th>
            </tr>
          </thead>
          <tbody>
            {baris.map((row) => (
              <tr key={row.label} className="border-t border-garis">
                <td className="px-4 py-3 font-semibold text-teks-lembut align-top">{row.label}</td>
                <td className="px-4 py-3 align-top">{row.render(a)}</td>
                <td className="px-4 py-3 align-top">{row.render(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
