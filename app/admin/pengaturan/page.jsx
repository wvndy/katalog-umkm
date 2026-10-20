import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormPengaturan from "@/components/FormPengaturan";
import { buatClientAuth } from "@/lib/supabase/auth";

export default async function HalamanPengaturan() {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data } = await supabase
    .from("pengaturan_toko")
    .select("nama, tagline, nomor_whatsapp, alamat, jam_buka")
    .eq("id", 1)
    .single();

  const pengaturan = data ?? {
    nama: "",
    tagline: "",
    nomor_whatsapp: "",
    alamat: "",
    jam_buka: "",
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div>
        <h1 className="text-2xl font-extrabold">Pengaturan Toko</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          Ubah identitas toko yang tampil di halaman katalog.
        </p>
      </div>

      <FormPengaturan pengaturan={pengaturan} />
    </div>
  );
}
