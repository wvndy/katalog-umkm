import Link from "next/link";
import { formatRupiah, kategoriKeSlug } from "@/lib/format";
import TombolFavorit from "@/components/TombolFavorit";
import TombolKeranjang from "@/components/TombolKeranjang";
import TombolBandingkan from "@/components/TombolBandingkan";

export default function KartuProduk({ produk }) {
  const slugKategori = produk.kategori ? kategoriKeSlug(produk.kategori) : null;
  const habis = produk.status_stok === "habis" || (produk.stok !== undefined && produk.stok <= 0);
  const adaDiskon = produk.harga_diskon && produk.harga_diskon < produk.harga;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition-shadow hover:shadow-sm">
      <div className="relative aspect-square w-full overflow-hidden bg-permukaan">
        <Link href={`/produk/${produk.id}`} className="block h-full w-full">
          <img
            src={produk.foto_url || "/produk/keripik.svg"}
            alt={produk.nama}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              habis ? "grayscale opacity-75" : ""
            }`}
          />
        </Link>

        {/* Badge Habis atau Promo/Baru/Terlaris */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {habis ? (
            <span className="rounded-md bg-teks px-2 py-0.5 text-xs font-bold text-white shadow">
              Habis
            </span>
          ) : (
            <>
              {produk.badge && (
                <span className="rounded-md bg-utama px-2 py-0.5 text-xs font-bold text-white shadow">
                  {produk.badge}
                </span>
              )}
              {adaDiskon && (
                <span className="rounded-md bg-bahaya px-2 py-0.5 text-xs font-bold text-white shadow">
                  Diskon
                </span>
              )}
            </>
          )}
        </div>

        <div className="absolute top-2 right-2 z-10">
          <TombolFavorit produk={produk} varian="kecil" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {produk.kategori && slugKategori ? (
          <Link
            href={`/kategori/${slugKategori}`}
            className="self-start text-xs text-teks-lembut hover:text-utama hover:underline"
          >
            {produk.kategori}
          </Link>
        ) : (
          <p className="text-xs text-teks-lembut">Umum</p>
        )}
        <h3 className="font-semibold leading-snug">
          <Link href={`/produk/${produk.id}`} className="hover:text-utama">
            {produk.nama}
          </Link>
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          {adaDiskon ? (
            <>
              <span className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
                {formatRupiah(produk.harga_diskon)}
              </span>
              <span className="text-xs text-teks-lembut line-through">
                {formatRupiah(produk.harga)}
              </span>
            </>
          ) : (
            <span className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
              {formatRupiah(produk.harga)}
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap gap-1.5">
          <TombolKeranjang produk={produk} />
          <TombolBandingkan produk={produk} />
        </div>
      </div>
    </div>
  );
}
