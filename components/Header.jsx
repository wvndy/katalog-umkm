import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolTema from "@/components/TombolTema";
import BadgeKeranjang from "@/components/BadgeKeranjang";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-teks hover:text-utama">Katalog</Link>
            <Link href="/favorit" className="text-teks-lembut hover:text-utama">Favorit</Link>
            <Link href="/bandingkan" className="text-teks-lembut hover:text-utama">Bandingkan</Link>
            <Link href="/tentang" className="text-teks-lembut hover:text-utama">Tentang</Link>
            <Link href="/keranjang" className="relative text-teks hover:text-utama">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <BadgeKeranjang />
            </Link>
          </nav>
          <div className="border-l border-garis pl-3">
            <TombolTema />
          </div>
        </div>
      </div>
    </header>
  );
}
