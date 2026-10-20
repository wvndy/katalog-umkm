import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormTambahKategori from "@/components/FormTambahKategori";
import FormUbahKategori from "@/components/FormUbahKategori";
import TombolHapusKategori from "@/components/TombolHapusKategori";
import { buatClientAuth } from "@/lib/supabase/auth";

export default async function HalamanKategori() {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: kategoriList } = await supabase
    .from("kategori")
    .select("id, nama")
    .order("nama", { ascending: true });

  const daftarKategori = kategoriList ?? [];

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />

      <div>
        <h1 className="text-2xl font-extrabold">Kelola Kategori</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          {daftarKategori.length} kategori terdaftar.
        </p>
      </div>

      <FormTambahKategori />

      {daftarKategori.length === 0 ? (
        <p className="py-10 text-center text-teks-lembut">
          Belum ada kategori. Tambahkan kategori pertama di atas.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-garis text-teks-lembut">
                <th className="px-3 py-2 font-semibold">Nama Kategori</th>
                <th className="px-3 py-2 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftarKategori.map((kat) => (
                <tr key={kat.id} className="border-b border-garis">
                  <td className="px-3 py-3">
                    <FormUbahKategori id={kat.id} nama={kat.nama} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <TombolHapusKategori id={kat.id} nama={kat.nama} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
