"use server";

import { redirect } from "next/navigation";
import { buatClientAuth } from "@/lib/supabase/auth";

export async function login(prevState, formData) {
  const email = formData.get("email")?.toString()?.trim() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
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
          : error.message,
    };
  }

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
    return { error: error.message };
  }

  return { sukses: "Password berhasil diganti." };
}

