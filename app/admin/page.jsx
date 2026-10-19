import Link from "next/link";
import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatClientAuth } from "@/lib/supabase/auth";
import { formatRupiah } from "@/lib/format";

const PER_HALAMAN = 10;

export default async function HalamanAdmin({ searchParams }) {
  const params = await searchParams;
  const q = (params.q?.toString() || "").trim().slice(0, 80);
  const halamanDiminta = Number.parseInt(params.halaman?.toString() || "1", 10);
  const halaman = Number.isInteger(halamanDiminta) && halamanDiminta > 0 ? halamanDiminta : 1;

  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let query = supabase
    .from("produk")
    .select(
      "id, nama, harga, foto_url, kategori, created_at, aktif, urutan, badge, harga_diskon, stok, status_stok",
      { count: "exact" }
    );

  if (q) {
    query = query.ilike("nama", `%${q}%`);
  }

  const dari = (halaman - 1) * PER_HALAMAN;
  const {
    data: daftarProduk,
    count,
    error,
  } = await query
    .order("urutan", { ascending: true })
    .order("created_at", { ascending: false })
    .range(dari, dari + PER_HALAMAN - 1);

  const [{ count: totalProduk }, { data: semuaKategori }] = await Promise.all([
    supabase.from("produk").select("id", { count: "exact", head: true }),
    supabase.from("produk").select("kategori").not("kategori", "is", null),
  ]);

  const jumlahKategori = {};
  for (const produk of semuaKategori ?? []) {
    const kategori = produk.kategori?.trim();
    if (kategori) {
      jumlahKategori[kategori] = (jumlahKategori[kategori] || 0) + 1;
    }
  }
  const ringkasanKategori = Object.entries(jumlahKategori).sort((a, b) =>
    a[0].localeCompare(b[0], "id")
  );

  // US-41: 5 produk dengan klik pesan WhatsApp terbanyak
  let produkTerlaris = [];
  try {
    const { data: dataKlik } = await supabase.from("klik_wa").select("produk_id");
    if (dataKlik && dataKlik.length > 0) {
      const hitung = {};
      for (const row of dataKlik) {
        hitung[row.produk_id] = (hitung[row.produk_id] || 0) + 1;
      }
      const urutKlik = Object.entries(hitung)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (urutKlik.length > 0) {
        const ids = urutKlik.map(([id]) => Number(id));
        const { data: produkInfo } = await supabase
          .from("produk")
          .select("id, nama, harga, foto_url")
          .in("id", ids);

        const mapProduk = new Map((produkInfo ?? []).map((p) => [p.id, p]));
        produkTerlaris = urutKlik
          .map(([id, totalKlik]) => {
            const prod = mapProduk.get(Number(id));
            return prod ? { ...prod, totalKlik } : null;
          })
          .filter(Boolean);
      }
    }
  } catch {}

  const totalHalaman = Math.max(1, Math.ceil((count || 0) / PER_HALAMAN));

  if (count && halaman > totalHalaman) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    sp.set("halaman", String(totalHalaman));
    redirect(`/admin?${sp.toString()}`);
  }

  function tautanHalaman(nomor) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (nomor > 1) sp.set("halaman", String(nomor));
    const queryString = sp.toString();
    return queryString ? `/admin?${queryString}` : "/admin";
  }

  const pesan =
    params.pesan === "ditambah"
      ? "Produk baru berhasil ditambahkan."
      : params.pesan === "diubah"
        ? "Perubahan produk berhasil disimpan."
        : null;

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Produk</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            {totalProduk ?? 0} produk di katalog, {ringkasanKategori.length} kategori.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tombol href="/admin/produk/ekspor" varian="garis">
            Ekspor CSV
          </Tombol>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>

      {ringkasanKategori.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {ringkasanKategori.map(([kategori, jumlah]) => (
            <span
              key={kategori}
              className="rounded-full border border-garis bg-permukaan px-3 py-1 text-teks-lembut"
            >
              {kategori}: <strong className="text-teks">{jumlah}</strong>
            </span>
          ))}
        </div>
      )}

      {/* US-41: Widget Produk Terlaris (Klik WA Terbanyak) */}
      <section aria-labelledby="judul-terlaris" className="rounded-2xl border border-garis bg-permukaan p-5">
        <h2 id="judul-terlaris" className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
          Produk Paling Sering Dipesan via WhatsApp
        </h2>
        {produkTerlaris.length === 0 ? (
          <p className="mt-2 text-sm text-teks-lembut">
            Belum ada klik pemesanan WhatsApp yang tercatat. Data akan otomatis muncul setelah pengunjung menekan tombol pesan.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {produkTerlaris.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-garis bg-latar p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-utama/15 text-xs font-bold text-utama">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-teks">{item.nama}</p>
                  <p className="text-[11px] text-teks-lembut">{formatRupiah(item.harga)}</p>
                  <p className="text-[11px] font-semibold text-harga">
                    {item.totalKlik}x dipesan
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {pesan && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-utama">
          {pesan}
        </div>
      )}

      <form method="get" className="flex max-w-lg gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari nama produk..."
          aria-label="Cari nama produk"
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        <Tombol type="submit" varian="garis">
          Cari
        </Tombol>
        {q && (
          <Tombol href="/admin" varian="garis">
            Reset
          </Tombol>
        )}
      </form>

      {error ? (
        <div className="rounded-lg border border-bahaya bg-latar p-4 text-sm text-bahaya">
          Daftar produk gagal dimuat. Coba muat ulang halaman ini.
        </div>
      ) : !daftarProduk?.length ? (
        <p className="py-10 text-center text-teks-lembut">
          {q ? "Tidak ada produk yang cocok dengan pencarian." : "Belum ada produk."}
        </p>
      ) : (
        <>
          <TabelProduk daftarProduk={daftarProduk} />
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-teks-lembut">
              Halaman {halaman} dari {totalHalaman}
            </p>
            <div className="flex gap-2">
              {halaman > 1 ? (
                <Tombol href={tautanHalaman(halaman - 1)} varian="garis">
                  Sebelumnya
                </Tombol>
              ) : (
                <span className="rounded-lg border border-garis px-4 py-2.5 text-teks-lembut opacity-50">
                  Sebelumnya
                </span>
              )}
              {halaman < totalHalaman ? (
                <Tombol href={tautanHalaman(halaman + 1)} varian="garis">
                  Berikutnya
                </Tombol>
              ) : (
                <span className="rounded-lg border border-garis px-4 py-2.5 text-teks-lembut opacity-50">
                  Berikutnya
                </span>
              )}
            </div>
          </div>
        </>
      )}

      <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
        Lihat katalog publik
      </Link>
    </div>
  );
}
