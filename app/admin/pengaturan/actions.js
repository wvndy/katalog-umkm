"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buatClientAuth } from "@/lib/supabase/auth";
import { catatLog } from "@/lib/log-aktivitas";

export async function simpanPengaturan(prevState, formData) {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const nama = formData.get("nama")?.toString()?.trim() || "";
  const tagline = formData.get("tagline")?.toString()?.trim() || "";
  const nomor_whatsapp = formData.get("nomor_whatsapp")?.toString()?.trim() || "";
  const alamat = formData.get("alamat")?.toString()?.trim() || "";
  const jam_buka = formData.get("jam_buka")?.toString()?.trim() || "";

  if (!nama) {
    return { error: "Nama toko wajib diisi." };
  }

  if (!nomor_whatsapp) {
    return { error: "Nomor WhatsApp wajib diisi." };
  }

  // Validasi nomor WhatsApp: hanya angka, 10-15 karakter
  if (!/^\d{10,15}$/.test(nomor_whatsapp)) {
    return { error: "Nomor WhatsApp harus berupa 10-15 digit angka." };
  }

  const { error } = await supabase
    .from("pengaturan_toko")
    .update({
      nama,
      tagline: tagline || null,
      nomor_whatsapp,
      alamat: alamat || null,
      jam_buka: jam_buka || null,
    })
    .eq("id", 1);

  if (error) {
    return { error: "Gagal menyimpan pengaturan. Coba lagi." };
  }

  await catatLog(user.email, "ubah_pengaturan", "Mengubah pengaturan toko");
  revalidatePath("/");
  revalidatePath("/admin/pengaturan");
  return { sukses: "Pengaturan berhasil disimpan." };
}
