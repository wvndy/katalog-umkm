import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { buatClientServer } from "@/lib/supabase/server";
import { kategoriKeSlug } from "@/lib/format";
import { toko } from "@/lib/toko";

async function ambilKategoriDariSlug(slug) {
  const supabase = buatClientServer();
  const { data } = await supabase
    .from("produk")
    .select("kategori")
    .not("kategori", "is", null);

  const daftar = Array.from(
    new Set((data ?? []).map((p) => p.kategori?.trim()).filter(Boolean))
  );

  return daftar.find((k) => kategoriKeSlug(k) === slug.toLowerCase()) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const kategori = await ambilKategoriDariSlug(slug);
    if (!kategori) {
      return {
        title: `Kategori Tidak Ditemukan | ${toko.nama}`,
      };
    }
    return {
      title: `Kategori ${kategori} | ${toko.nama}`,
      description: `Lihat semua produk dalam kategori ${kategori} di ${toko.nama}.`,
    };
  } catch {
    return { title: toko.nama };
  }
}

export default async function HalamanKategori({ params }) {
  const { slug } = await params;

  const kategoriAsli = await ambilKategoriDariSlug(slug);
  if (!kategoriAsli) {
    notFound();
  }

  const supabase = buatClientServer();
  const { data: daftarProduk } = await supabase
    .from("produk")
    .select("id, nama, harga, foto_url, kategori, stok, status_stok, harga_diskon, badge, aktif, urutan")
    .eq("kategori", kategoriAsli)
    .neq("aktif", false)
    .order("urutan", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8 py-10 sm:py-14">
      <div>
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          ← Kembali ke semua produk
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
              Kategori
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {kategoriAsli}
            </h1>
            <p className="mt-1 text-sm text-teks-lembut">
              Menampilkan {daftarProduk?.length ?? 0} produk
            </p>
          </div>
          <Tombol href={`/?kategori=${encodeURIComponent(kategoriAsli)}`} varian="garis">
            Buka di katalog dengan filter
          </Tombol>
        </div>
      </div>

      {!daftarProduk?.length ? (
        <p className="py-12 text-center text-teks-lembut">
          Belum ada produk untuk kategori ini.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {daftarProduk.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}
