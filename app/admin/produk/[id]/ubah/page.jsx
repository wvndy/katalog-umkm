import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import KelolaGaleriAdmin from "@/components/KelolaGaleriAdmin";
import KelolaVarianAdmin from "@/components/KelolaVarianAdmin";
import { ubahProduk } from "@/app/admin/actions";
import { buatClientAuth } from "@/lib/supabase/auth";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [
    { data: produk },
    { data: fotoList },
    { data: varianList },
  ] = await Promise.all([
    supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("produk_foto")
      .select("*")
      .eq("produk_id", id)
      .order("urutan", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("varian_produk")
      .select("*")
      .eq("produk_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" action={ubahProduk} />

      <KelolaGaleriAdmin produkId={produk.id} fotoList={fotoList ?? []} />
      <KelolaVarianAdmin produkId={produk.id} varianList={varianList ?? []} />
    </div>
  );
}
