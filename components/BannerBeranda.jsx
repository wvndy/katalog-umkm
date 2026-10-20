import { buatClientServer } from "@/lib/supabase/server";

export default async function BannerBeranda() {
  const supabase = buatClientServer();

  const { data: bannerList } = await supabase
    .from("banner")
    .select("id, judul, teks, gambar_url, tautan")
    .eq("aktif", true)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!bannerList || bannerList.length === 0) {
    return null;
  }

  return (
    <section aria-label="Promo" className="flex flex-col gap-4">
      {bannerList.map((banner) => (
        <div
          key={banner.id}
          className="relative overflow-hidden rounded-2xl border border-garis bg-permukaan"
        >
          {banner.gambar_url && (
            <img
              src={banner.gambar_url}
              alt={banner.judul}
              className="h-40 w-full object-cover sm:h-52"
            />
          )}
          <div className="p-5">
            <h2 className="text-lg font-bold text-teks">{banner.judul}</h2>
            {banner.teks && (
              <p className="mt-1 text-sm text-teks-lembut">{banner.teks}</p>
            )}
            {banner.tautan && (
              <a
                href={banner.tautan}
                className="mt-3 inline-block text-sm font-semibold text-utama hover:text-utama-gelap"
              >
                Lihat selengkapnya
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
