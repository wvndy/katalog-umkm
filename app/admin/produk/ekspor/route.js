import { buatClientAuth } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

const KOLOM = ["id", "nama", "harga", "kategori", "deskripsi", "foto_url", "created_at"];

function amanUntukCsv(nilai) {
  if (nilai === null || nilai === undefined) {
    return "";
  }

  const teks = String(nilai);

  if (/[",\r\n]/.test(teks)) {
    return `"${teks.replaceAll('"', '""')}"`;
  }

  return teks;
}

export async function GET() {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Tidak diizinkan.", { status: 401 });
  }

  const { data, error } = await supabase
    .from("produk")
    .select(KOLOM.join(","))
    .order("created_at", { ascending: false });

  if (error) {
    return new Response("Data produk gagal dibuat.", { status: 500 });
  }

  const baris = [
    KOLOM.join(","),
    ...(data ?? []).map((produk) => KOLOM.map((kolom) => amanUntukCsv(produk[kolom])).join(",")),
  ];
  const tanggal = new Date().toISOString().slice(0, 10);

  return new Response(`\uFEFF${baris.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="produk-${tanggal}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
