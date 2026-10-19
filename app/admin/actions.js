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

