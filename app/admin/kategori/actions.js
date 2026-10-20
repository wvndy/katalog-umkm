"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buatClientAuth } from "@/lib/supabase/auth";
import { catatLog } from "@/lib/log-aktivitas";

async function ambilAdmin() {
  const supabase = await buatClientAuth();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function tambahKategori(prevState, formData) {
  const { supabase, user } = await ambilAdmin();
  if (!user) return { error: "Sesi admin tidak ditemukan." };

  const nama = formData.get("nama")?.toString().trim();
  if (!nama) return { error: "Nama kategori wajib diisi." };

  const { error } = await supabase.from("kategori").insert({ nama });
  if (error) {
    if (error.message?.includes("duplicate") || error.code === "23505") {
      return { error: `Kategori "${nama}" sudah ada.` };
    }
    return { error: "Gagal menambah kategori." };
  }

  await catatLog(user.email, "Tambah kategori", nama);
  revalidatePath("/admin/kategori");
  return { sukses: `Kategori "${nama}" berhasil ditambahkan.` };
}

export async function ubahKategori(prevState, formData) {
  const { supabase, user } = await ambilAdmin();
  if (!user) return { error: "Sesi admin tidak ditemukan." };

  const id = Number(formData.get("id"));
  const nama = formData.get("nama")?.toString().trim();
  const namaLama = formData.get("nama_lama")?.toString().trim();
  if (!nama) return { error: "Nama kategori wajib diisi." };

  const { error } = await supabase.from("kategori").update({ nama }).eq("id", id);
  if (error) {
    if (error.message?.includes("duplicate") || error.code === "23505") {
      return { error: `Kategori "${nama}" sudah ada.` };
    }
    return { error: "Gagal mengubah kategori." };
  }

  if (namaLama && namaLama !== nama) {
    await supabase.from("produk").update({ kategori: nama }).eq("kategori", namaLama);
  }

  await catatLog(user.email, "Ubah kategori", `${namaLama} → ${nama}`);
  revalidatePath("/admin/kategori");
  revalidatePath("/");
  return { sukses: `Kategori berhasil diubah menjadi "${nama}".` };
}

export async function hapusKategori(prevState, formData) {
  const { supabase, user } = await ambilAdmin();
  if (!user) return { error: "Sesi admin tidak ditemukan." };

  const id = Number(formData.get("id"));
  const nama = formData.get("nama")?.toString().trim() || "";

  const { count } = await supabase.from("produk").select("id", { count: "exact", head: true }).eq("kategori", nama);
  if (count && count > 0) {
    return { error: `Tidak bisa dihapus: ${count} produk masih memakai kategori "${nama}".` };
  }

  await supabase.from("kategori").delete().eq("id", id);
  await catatLog(user.email, "Hapus kategori", nama);
  revalidatePath("/admin/kategori");
  return { sukses: `Kategori "${nama}" berhasil dihapus.` };
}
