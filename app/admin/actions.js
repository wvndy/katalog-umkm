"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buatClientAuth } from "@/lib/supabase/auth";
import { buatDeskripsiProdukAI } from "@/lib/gemini";

async function ambilSesiAdmin() {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

function bacaTeks(formData, nama) {
  return formData.get(nama)?.toString()?.trim() || "";
}

function validasiProduk(formData) {
  const values = {
    nama: bacaTeks(formData, "nama"),
    harga: bacaTeks(formData, "harga"),
    kategori: bacaTeks(formData, "kategori"),
    foto_url: bacaTeks(formData, "foto_url"),
    deskripsi: bacaTeks(formData, "deskripsi"),
  };
  const errors = {};
  const harga = Number(values.harga);

  if (!values.nama) {
    errors.nama = "Nama produk wajib diisi.";
  }

  if (!values.harga) {
    errors.harga = "Harga wajib diisi.";
  } else if (!Number.isInteger(harga) || harga <= 0) {
    errors.harga = "Harga harus berupa angka bulat lebih dari 0.";
  }

  return { values, errors, harga };
}

function segarkanHalamanProduk(id) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (id) {
    revalidatePath(`/produk/${id}`);
  }
}

// Rate limit sederhana di memori server untuk melindungi brute force login (K-12).
const riwayatLogin = globalThis.__riwayatLogin || new Map();
globalThis.__riwayatLogin = riwayatLogin;

const BATAS_UPAYA = 5;
const JENDELA_WAKTU_MS = 60 * 1000;

function cekRateLimit(identitas) {
  const sekarang = Date.now();
  const daftar = (riwayatLogin.get(identitas) || []).filter(
    (waktu) => sekarang - waktu < JENDELA_WAKTU_MS
  );

  if (daftar.length >= BATAS_UPAYA) {
    return false;
  }

  daftar.push(sekarang);
  riwayatLogin.set(identitas, daftar);
  return true;
}

function resetRateLimit(identitas) {
  riwayatLogin.delete(identitas);
}

export async function login(prevState, formData) {
  const email = formData.get("email")?.toString()?.trim() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  if (!cekRateLimit(email.toLowerCase())) {
    return {
      error: "Terlalu banyak percobaan masuk. Tunggu 1 menit sebelum mencoba lagi.",
    };
  }

  const supabase = await buatClientAuth();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : "Gagal masuk. Periksa email dan password Anda.",
    };
  }

  resetRateLimit(email.toLowerCase());
  redirect("/admin");
}

export async function keluar() {
  const supabase = await buatClientAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData.get("password_baru")?.toString() || "";
  const konfirmasi = formData.get("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasi) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasi) {
    return { error: "Password baru dan konfirmasi tidak sama." };
  }

  const supabase = await buatClientAuth();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi telah berakhir. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: "Gagal mengganti password. Silakan coba lagi nanti." };
  }

  return { sukses: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const { supabase, user } = await ambilSesiAdmin();

  if (!user) {
    return { error: "Sesi admin tidak ditemukan. Silakan login kembali." };
  }

  const { values, errors, harga } = validasiProduk(formData);

  if (Object.keys(errors).length > 0) {
    return {
      error: "Periksa kembali kolom yang ditandai.",
      errors,
      values,
    };
  }

  const { error } = await supabase.from("produk").insert({
    nama: values.nama,
    harga,
    kategori: values.kategori || null,
    foto_url: values.foto_url || null,
    deskripsi: values.deskripsi || null,
  });

  if (error) {
    return {
      error: "Produk gagal disimpan. Coba lagi sebentar lagi.",
      values,
    };
  }

  segarkanHalamanProduk();
  redirect("/admin?pesan=ditambah");
}

export async function ubahProduk(prevState, formData) {
  const { supabase, user } = await ambilSesiAdmin();

  if (!user) {
    return { error: "Sesi admin tidak ditemukan. Silakan login kembali." };
  }

  const id = Number(bacaTeks(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Produk yang ingin diubah tidak valid." };
  }

  const { values, errors, harga } = validasiProduk(formData);

  if (Object.keys(errors).length > 0) {
    return {
      error: "Periksa kembali kolom yang ditandai.",
      errors,
      values: { ...values, id },
    };
  }

  const { data, error } = await supabase
    .from("produk")
    .update({
      nama: values.nama,
      harga,
      kategori: values.kategori || null,
      foto_url: values.foto_url || null,
      deskripsi: values.deskripsi || null,
    })
    .eq("id", id)
    .select("id");

  if (error || !data?.length) {
    return {
      error: "Perubahan gagal disimpan. Produk mungkin sudah dihapus.",
      values: { ...values, id },
    };
  }

  segarkanHalamanProduk(id);
  redirect("/admin?pesan=diubah");
}

export async function hapusProduk(prevState, formData) {
  const { supabase, user } = await ambilSesiAdmin();

  if (!user) {
    return { error: "Sesi admin tidak ditemukan. Silakan login kembali." };
  }

  const id = Number(bacaTeks(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Produk yang ingin dihapus tidak valid." };
  }

  const { data, error } = await supabase
    .from("produk")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !data?.length) {
    return { error: "Produk gagal dihapus. Coba muat ulang halaman ini." };
  }

  segarkanHalamanProduk(id);
  return { sukses: "Produk berhasil dihapus." };
}

export async function toggleAktifProduk(formData) {
  const { supabase, user } = await ambilSesiAdmin();
  if (!user) {
    redirect("/admin/login");
  }

  const id = Number(bacaTeks(formData, "id"));
  const aktifSekarang = formData.get("aktif") === "true";

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ID produk tidak valid." };
  }

  await supabase
    .from("produk")
    .update({ aktif: !aktifSekarang })
    .eq("id", id);

  segarkanHalamanProduk(id);
}

export async function ubahUrutanProduk(formData) {
  const { supabase, user } = await ambilSesiAdmin();
  if (!user) {
    redirect("/admin/login");
  }

  const id = Number(bacaTeks(formData, "id"));
  const arah = bacaTeks(formData, "arah");
  const urutanSekarang = Number(bacaTeks(formData, "urutan")) || 0;

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "ID produk tidak valid." };
  }

  const delta = arah === "naik" ? -1 : 1;
  const urutanBaru = Math.max(0, urutanSekarang + delta);

  await supabase
    .from("produk")
    .update({ urutan: urutanBaru })
    .eq("id", id);

  segarkanHalamanProduk(id);
}

export async function buatDeskripsiAksi(nama, kategori) {
  const { user } = await ambilSesiAdmin();
  if (!user) {
    return { error: "Sesi admin tidak ditemukan. Silakan login kembali." };
  }

  try {
    const deskripsi = await buatDeskripsiProdukAI(nama, kategori);
    return { deskripsi, error: null };
  } catch (err) {
    return { error: err.message || "Gagal membuat deskripsi dengan AI." };
  }
}




