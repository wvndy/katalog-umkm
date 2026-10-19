import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { buatClientServer } from "@/lib/supabase/server";

export default async function HalamanKatalog() {
  let daftarProduk = [];
  let error = null;

  try {
    const supabase = buatClientServer();
    const { data, error: dbError } = await supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .order("created_at", { ascending: false });

    if (dbError) {
      error = dbError.message;
    } else {
      daftarProduk = data ?? [];
    }
  } catch (err) {
    error = err.message || "Terjadi kesalahan saat mengambil data produk.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Gagal memuat produk</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-12 text-center text-teks-lembut">Belum ada produk</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
