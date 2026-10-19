import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolTema from "@/components/TombolTema";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/" className="text-teks hover:text-utama">
              Katalog
            </Link>
            <Link href="/favorit" className="text-teks-lembut hover:text-utama">
              Favorit
            </Link>
            <Link href="/tentang" className="text-teks-lembut hover:text-utama">
              Tentang
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
