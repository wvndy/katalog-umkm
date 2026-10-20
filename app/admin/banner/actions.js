"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buatClientAuth } from "@/lib/supabase/auth";
import { catatLog } from "@/lib/log-aktivitas";

async function ambilSesiAdmin() {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function tambahBanner(prevState, formData) {
  const { supabase, user } = await ambilSesiAdmin();
  if (!user) redirect("/admin/login");

  const judul = formData.get("judul")?.toString()?.trim() || "";
  const teks = formData.get("teks")?.toString()?.trim() || "";
  const gambar_url = formData.get("gambar_url")?.toString()?.trim() || "";
  const tautan = formData.get("tautan")?.toString()?.trim() || "";

  if (!judul) {
    return { error: "Judul banner wajib diisi." };
  }

  const { error } = await supabase.from("banner").insert({
    judul,
    teks: teks || null,
    gambar_url: gambar_url || null,
    tautan: tautan || null,
    aktif: true,
  });

  if (error) {
    return { error: "Gagal menambah banner. Coba lagi." };
  }

  await catatLog(user.email, "tambah_banner", `Menambah banner: ${judul}`);
  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { sukses: "Banner berhasil ditambahkan." };
}

export async function toggleBanner(formData) {
  const { supabase, user } = await ambilSesiAdmin();
  if (!user) redirect("/admin/login");

  const id = Number(formData.get("id"));
  const aktifSekarang = formData.get("aktif") === "true";

  if (!Number.isInteger(id) || id <= 0) return;

  await supabase
    .from("banner")
    .update({ aktif: !aktifSekarang })
    .eq("id", id);

  await catatLog(
    user.email,
    "toggle_banner",
    `Banner id=${id} diubah menjadi ${!aktifSekarang ? "aktif" : "nonaktif"}`
  );
  revalidatePath("/admin/banner");
  revalidatePath("/");
}

export async function hapusBanner(formData) {
  const { supabase, user } = await ambilSesiAdmin();
  if (!user) redirect("/admin/login");

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) return;

  await supabase.from("banner").delete().eq("id", id);

  await catatLog(user.email, "hapus_banner", `Menghapus banner id=${id}`);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}
