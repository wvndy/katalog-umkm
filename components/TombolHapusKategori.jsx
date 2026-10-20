"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { hapusKategori } from "@/app/admin/kategori/actions";

export default function TombolHapusKategori({ id, nama }) {
  const [state, formAction, isPending] = useActionState(hapusKategori, null);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Hapus kategori "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-end gap-1"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="nama" value={nama} />
      <Tombol type="submit" varian="bahaya" disabled={isPending}>
        {isPending ? "Menghapus..." : "Hapus"}
      </Tombol>
      {state?.error && <span className="text-xs text-bahaya">{state.error}</span>}
    </form>
  );
}
