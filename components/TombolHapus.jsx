"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TombolHapus({ id, nama }) {
  const [state, formAction, isPending] = useActionState(hapusProduk, null);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Hapus produk "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-end gap-1"
    >
      <input type="hidden" name="id" value={id} />
      <Tombol type="submit" varian="bahaya" disabled={isPending}>
        {isPending ? "Menghapus..." : "Hapus"}
      </Tombol>
      {state?.error && <span className="text-xs text-bahaya">{state.error}</span>}
    </form>
  );
}
