import Link from "next/link";
import { toko } from "@/lib/toko";
import Tombol from "@/components/Tombol";

export const metadata = {
  title: `Tentang Kami | ${toko.nama}`,
  description: `Profil usaha, alamat, dan kontak resmi ${toko.nama}.`,
};

export default function HalamanTentang() {
  const urlWa = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(
    `Halo ${toko.nama}, saya ingin bertanya tentang produk dan layanan toko.`
  )}`;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-10 sm:py-14">
      <div>
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          ← Kembali ke katalog
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Tentang {toko.nama}
        </h1>
        <p className="mt-3 text-lg text-teks-lembut">{toko.tagline}</p>
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-garis bg-permukaan p-6 sm:p-8">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
            Alamat Toko
          </h2>
          <p className="mt-1 text-base font-medium text-teks">{toko.alamat}</p>
        </div>

        <div className="border-t border-garis pt-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
            Jam Operasional
          </h2>
          <p className="mt-1 text-base font-medium text-teks">{toko.jamBuka}</p>
        </div>

        <div className="border-t border-garis pt-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
            Kontak WhatsApp
          </h2>
          <p className="mt-1 text-base font-medium text-teks">+{toko.nomorWhatsApp}</p>
          <div className="mt-4">
            <a
              href={urlWa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div>
        <Tombol href="/" varian="garis">
          Jelajahi Produk
        </Tombol>
      </div>
    </div>
  );
}
