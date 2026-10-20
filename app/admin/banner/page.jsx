import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import FormTambahBanner from "@/components/FormTambahBanner";
import { buatClientAuth } from "@/lib/supabase/auth";
import { toggleBanner, hapusBanner } from "@/app/admin/banner/actions";

export default async function HalamanBanner() {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: bannerList } = await supabase
    .from("banner")
    .select("id, judul, teks, gambar_url, tautan, aktif, created_at")
    .order("created_at", { ascending: false });

  const daftarBanner = bannerList ?? [];

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />

      <div>
        <h1 className="text-2xl font-extrabold">Banner Promo</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          {daftarBanner.length} banner terdaftar. Banner aktif akan tampil di halaman utama.
        </p>
      </div>

      <FormTambahBanner />

      {daftarBanner.length === 0 ? (
        <p className="py-10 text-center text-teks-lembut">
          Belum ada banner. Tambahkan banner pertama di atas.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {daftarBanner.map((banner) => (
            <div
              key={banner.id}
              className="flex flex-col gap-3 rounded-xl border border-garis bg-permukaan p-4"
            >
              {banner.gambar_url && (
                <img
                  src={banner.gambar_url}
                  alt={banner.judul}
                  className="h-32 w-full rounded-lg object-cover"
                />
              )}

              <div className="flex-1">
                <h3 className="font-bold text-teks">{banner.judul}</h3>
                {banner.teks && (
                  <p className="mt-1 text-sm text-teks-lembut">{banner.teks}</p>
                )}
                {banner.tautan && (
                  <p className="mt-1 truncate text-xs text-utama">{banner.tautan}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-garis pt-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    banner.aktif
                      ? "bg-utama/15 text-utama"
                      : "bg-garis text-teks-lembut"
                  }`}
                >
                  {banner.aktif ? "Aktif" : "Nonaktif"}
                </span>

                <div className="flex gap-2">
                  <form action={toggleBanner}>
                    <input type="hidden" name="id" value={banner.id} />
                    <input type="hidden" name="aktif" value={String(banner.aktif)} />
                    <Tombol type="submit" varian="garis">
                      {banner.aktif ? "Nonaktifkan" : "Aktifkan"}
                    </Tombol>
                  </form>

                  <form
                    action={hapusBanner}
                  >
                    <input type="hidden" name="id" value={banner.id} />
                    <Tombol type="submit" varian="bahaya">
                      Hapus
                    </Tombol>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
