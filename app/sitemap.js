import { buatClientServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function ambilBaseUrl() {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export default async function sitemap() {
  const baseUrl = ambilBaseUrl();

  const ruteUtama = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const supabase = buatClientServer();
    const { data: daftarProduk } = await supabase
      .from("produk")
      .select("id, created_at");

    const ruteProduk = (daftarProduk ?? []).map((produk) => ({
      url: `${baseUrl}/produk/${produk.id}`,
      lastModified: produk.created_at ? new Date(produk.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...ruteUtama, ...ruteProduk];
  } catch {
    return ruteUtama;
  }
}
