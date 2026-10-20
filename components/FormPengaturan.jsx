"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { simpanPengaturan } from "@/app/admin/pengaturan/actions";

export default function FormPengaturan({ pengaturan }) {
  const [state, formAction, isPending] = useActionState(simpanPengaturan, null);

  return (
    <>
      {state?.sukses && (
        <div className="max-w-lg rounded-lg border border-garis bg-permukaan p-3 text-sm text-utama">
          {state.sukses}
        </div>
      )}
      {state?.error && (
        <div className="max-w-lg rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      <form action={formAction} className="flex max-w-lg flex-col gap-4">
        <Input
          label="Nama toko"
          name="nama"
          defaultValue={pengaturan.nama ?? ""}
          required
        />
        <Input
          label="Tagline"
          name="tagline"
          defaultValue={pengaturan.tagline ?? ""}
        />
        <Input
          label="Nomor WhatsApp"
          name="nomor_whatsapp"
          defaultValue={pengaturan.nomor_whatsapp ?? ""}
          placeholder="6281234567890"
          required
        />
        <Input
          label="Alamat"
          name="alamat"
          defaultValue={pengaturan.alamat ?? ""}
          textarea
        />
        <Input
          label="Jam buka"
          name="jam_buka"
          defaultValue={pengaturan.jam_buka ?? ""}
          placeholder="Setiap hari, 08.00-20.00"
        />
        <Tombol type="submit" className="self-start" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </Tombol>
      </form>
    </>
  );
}
