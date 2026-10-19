import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import TerakhirDilihat from "@/components/TerakhirDilihat";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { buatClientServer } from "@/lib/supabase/server";

const PER_HALAMAN = 12;

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const q = (params.q?.toString() || "").trim().slice(0, 80);
  const kategoriDipilih = (params.kategori?.toString() || "").trim();
  const urutan = (params.urut?.toString() || "terbaru").trim();
  const halamanDiminta = Number.parseInt(params.halaman?.toString() || "1", 10);
  const halaman = Number.isInteger(halamanDiminta) && halamanDiminta > 0 ? halamanDiminta : 1;

  let daftarProduk = [];
  let count = 0;
  let daftarKategori = [];
  let error = null;

  try {
    const supabase = buatClientServer();

    const { data: dataKategori } = await supabase
      .from("produk")
      .select("kategori")
      .not("kategori", "is", null);

    const setKategori = new Set();
    for (const item of dataKategori ?? []) {
      const namaKategori = item.kategori?.trim();
      if (namaKategori) setKategori.add(namaKategori);
    }
    daftarKategori = Array.from(setKategori).sort((a, b) => a.localeCompare(b, "id"));

    let query = supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori, created_at, stok, status_stok, harga_diskon, badge, aktif, urutan", { count: "exact" })
      .neq("aktif", false);

    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    if (kategoriDipilih) {
      query = query.eq("kategori", kategoriDipilih);
    }

    if (urutan === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutan === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      query = query
        .order("urutan", { ascending: true })
        .order("created_at", { ascending: false });
    }

    const dari = (halaman - 1) * PER_HALAMAN;
    const { data, count: totalBaris, error: dbError } = await query.range(
      dari,
      dari + PER_HALAMAN - 1
    );

    if (dbError) {
      error = "Gagal memuat daftar produk dari database.";
    } else {
      daftarProduk = data ?? [];
      count = totalBaris ?? 0;
    }
  } catch (err) {
    error = "Terjadi kesalahan koneksi saat memuat produk.";
  }

  const totalHalaman = Math.max(1, Math.ceil(count / PER_HALAMAN));

  function buatTautan({ halamanBaru, kategoriBaru, urutBaru, qBaru }) {
    const sp = new URLSearchParams();
    const queryTeks = qBaru !== undefined ? qBaru : q;
    const kat = kategoriBaru !== undefined ? kategoriBaru : kategoriDipilih;
    const ur = urutBaru !== undefined ? urutBaru : urutan;
    const hal = halamanBaru !== undefined ? halamanBaru : halaman;

    if (queryTeks) sp.set("q", queryTeks);
    if (kat) sp.set("kategori", kat);
    if (ur && ur !== "terbaru") sp.set("urut", ur);
    if (hal > 1) sp.set("halaman", String(hal));

    const qs = sp.toString();
    return qs ? `/?${qs}` : "/";
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

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="judul-produk" className="text-xl font-bold">
              Produk kami
            </h2>
            <p className="text-sm text-teks-lembut">
              Menampilkan {daftarProduk.length} dari {count} produk
            </p>
          </div>

          <form method="get" className="flex flex-wrap gap-2">
            {kategoriDipilih && <input type="hidden" name="kategori" value={kategoriDipilih} />}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk..."
              aria-label="Cari nama produk"
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
            <select
              name="urut"
              defaultValue={urutan}
              aria-label="Urutan produk"
              className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            >
              <option value="terbaru">Terbaru</option>
              <option value="termurah">Termurah</option>
              <option value="termahal">Termahal</option>
            </select>
            <Tombol type="submit" varian="garis">
              Terapkan
            </Tombol>
            {(q || kategoriDipilih || urutan !== "terbaru") && (
              <Tombol href="/" varian="garis">
                Reset
              </Tombol>
            )}
          </form>
        </div>

        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buatTautan({ kategoriBaru: "", halamanBaru: 1 })}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                !kategoriDipilih
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              Semua
            </Link>
            {daftarKategori.map((kategori) => {
              const aktif = kategoriDipilih === kategori;
              return (
                <Link
                  key={kategori}
                  href={buatTautan({
                    kategoriBaru: aktif ? "" : kategori,
                    halamanBaru: 1,
                  })}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                  }`}
                >
                  {kategori}
                </Link>
              );
            })}
          </div>
        )}

        {error ? (
          <div className="rounded-lg border border-bahaya bg-latar p-4 text-bahaya">
            <p className="font-semibold">{error}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="py-12 text-center text-teks-lembut">
            <p className="text-base font-semibold">Produk tidak ditemukan</p>
            <p className="mt-1 text-sm">Coba kata kunci pencarian atau kategori lain.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            {totalHalaman > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-teks-lembut">
                  Halaman {halaman} dari {totalHalaman}
                </p>
                <div className="flex gap-2">
                  {halaman > 1 ? (
                    <Tombol href={buatTautan({ halamanBaru: halaman - 1 })} varian="garis">
                      Sebelumnya
                    </Tombol>
                  ) : (
                    <span className="rounded-lg border border-garis px-4 py-2.5 text-teks-lembut opacity-50">
                      Sebelumnya
                    </span>
                  )}
                  {halaman < totalHalaman ? (
                    <Tombol href={buatTautan({ halamanBaru: halaman + 1 })} varian="garis">
                      Berikutnya
                    </Tombol>
                  ) : (
                    <span className="rounded-lg border border-garis px-4 py-2.5 text-teks-lembut opacity-50">
                      Berikutnya
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <TerakhirDilihat />
    </>
  );
}
