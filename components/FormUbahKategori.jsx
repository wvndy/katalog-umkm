"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { ubahKategori } from "@/app/admin/kategori/actions";

export default function FormUbahKategori({ id, nama }) {
  const [state, formAction, isPending] = useActionState(ubahKategori, null);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        name="nama"
        defaultValue={nama}
        required
        className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
      />
      <Tombol type="submit" varian="garis" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan"}
      </Tombol>
      {state?.error && <span className="text-xs text-bahaya">{state.error}</span>}
      {state?.sukses && <span className="text-xs text-utama">{state.sukses}</span>}
    </form>
  );
}
