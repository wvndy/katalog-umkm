"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahBanner } from "@/app/admin/banner/actions";

export default function FormTambahBanner() {
  const [state, formAction, isPending] = useActionState(tambahBanner, null);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4 rounded-xl border border-garis bg-permukaan p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-teks-lembut">
        Tambah Banner Baru
      </h2>

      {state?.sukses && (
        <div className="rounded-lg border border-garis bg-latar p-3 text-sm text-utama">
          {state.sukses}
        </div>
      )}
      {state?.error && (
        <div className="rounded-lg border border-garis bg-latar p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      <Input label="Judul" name="judul" required />
      <Input label="Teks" name="teks" textarea />
      <Input label="URL Gambar" name="gambar_url" placeholder="https://..." />
      <Input label="Tautan (opsional)" name="tautan" placeholder="https://..." />

      <Tombol type="submit" disabled={isPending} className="self-start">
        {isPending ? "Menyimpan..." : "Tambah Banner"}
      </Tombol>
    </form>
  );
}
