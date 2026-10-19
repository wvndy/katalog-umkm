import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import TombolFavorit from "@/components/TombolFavorit";
import AsistenAIProduk from "@/components/AsistenAIProduk";
import KartuProduk from "@/components/KartuProduk";
import CatatTerakhirDilihat from "@/components/CatatTerakhirDilihat";
import { buatClientServer } from "@/lib/supabase/server";
import { formatRupiah, kategoriKeSlug } from "@/lib/format";
import { toko } from "@/lib/toko";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const supabase = buatClientServer();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url, aktif")
      .eq("id", id)
      .maybeSingle();

    if (!produk || produk.aktif === false) {
      return {
        title: `Produk Tidak Ditemukan | ${toko.nama}`,
      };
    }

    const deskripsi = produk.deskripsi || `${produk.nama} tersedia di ${toko.nama}.`;

    return {
      title: `${produk.nama} | ${toko.nama}`,
      description: deskripsi,
      openGraph: {
        title: `${produk.nama} | ${toko.nama}`,
        description: deskripsi,
        images: produk.foto_url ? [{ url: produk.foto_url }] : [],
      },
    };
  } catch {
    return {
      title: toko.nama,
    };
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  const supabase = buatClientServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // US-32: Produk nonaktif menampilkan tidak ditemukan
  if (error || !produk || produk.aktif === false) {
    notFound();
  }

  const habis =
    produk.status_stok === "habis" ||
    (produk.stok !== undefined && Number(produk.stok) <= 0);

  const adaDiskon =
    produk.harga_diskon && Number(produk.harga_diskon) < Number(produk.harga);

  let produkTerkait = [];
  if (produk.kategori) {
    const { data: terkait } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", produk.id)
      .neq("aktif", false)
      .order("created_at", { ascending: false })
      .limit(3);

    produkTerkait = terkait ?? [];
  }

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      <CatatTerakhirDilihat produk={produk} />
      <article className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-garis bg-permukaan">
          <img
            src={produk.foto_url || "/produk/keripik.svg"}
            alt={produk.nama}
            className={`h-full w-full object-cover ${habis ? "grayscale opacity-75" : ""}`}
          />
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {habis ? (
              <span className="rounded-md bg-teks px-2.5 py-1 text-xs font-bold text-white shadow">
                Habis
              </span>
            ) : (
              <>
                {produk.badge && (
                  <span className="rounded-md bg-utama px-2.5 py-1 text-xs font-bold text-white shadow">
                    {produk.badge}
                  </span>
                )}
                {adaDiskon && (
                  <span className="rounded-md bg-bahaya px-2.5 py-1 text-xs font-bold text-white shadow">
                    Diskon
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            ← Kembali ke katalog
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {produk.kategori ? (
              <Link
                href={`/kategori/${kategoriKeSlug(produk.kategori)}`}
                className="rounded-full border border-garis bg-permukaan px-3 py-1 text-xs font-semibold text-teks-lembut hover:border-utama hover:text-utama"
              >
                {produk.kategori}
              </Link>
            ) : (
              <span className="rounded-full border border-garis bg-permukaan px-3 py-1 text-xs font-semibold text-teks-lembut">
                Umum
              </span>
            )}
            <div className="flex items-center gap-2">
              <TombolFavorit produk={produk} varian="besar" />
              <TombolBagikan namaProduk={produk.nama} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {produk.nama}
          </h1>

          <div className="flex flex-wrap items-baseline gap-3">
            {adaDiskon ? (
              <>
                <p className="rounded-md bg-harga-latar px-3 py-1 text-2xl font-extrabold text-harga">
                  {formatRupiah(produk.harga_diskon)}
                </p>
                <span className="text-base text-teks-lembut line-through">
                  {formatRupiah(produk.harga)}
                </span>
              </>
            ) : (
              <p className="rounded-md bg-harga-latar px-3 py-1 text-2xl font-extrabold text-harga">
                {formatRupiah(produk.harga)}
              </p>
            )}
          </div>

          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi || "Tidak ada deskripsi khusus untuk produk ini."}
          </p>

          <div className="mt-2 flex flex-col gap-6">
            <TombolWhatsApp produk={produk} />
            <AsistenAIProduk idProduk={produk.id} namaProduk={produk.nama} />
          </div>
        </div>
      </article>

      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-terkait" className="flex flex-col gap-4 border-t border-garis pt-8">
          <h2 id="judul-terkait" className="text-xl font-bold">
            Produk terkait di kategori {produk.kategori}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
