"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahKategori } from "@/app/admin/kategori/actions";

export default function FormTambahKategori() {
  const [state, formAction, isPending] = useActionState(tambahKategori, null);

  return (
    <form action={formAction} className="flex max-w-md items-end gap-3">
      <Input label="Nama kategori baru" name="nama" required error={state?.error} />
      <Tombol type="submit" disabled={isPending} className="shrink-0">
        {isPending ? "Menambah..." : "Tambah"}
      </Tombol>
    </form>
  );
}
