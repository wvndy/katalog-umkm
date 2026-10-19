"use client";

import { useActionState, useState, useRef } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAksi } from "@/app/admin/actions";

export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef(null);

  const nilai = state?.values ?? produk;
  const [deskripsi, setDeskripsi] = useState(nilai.deskripsi ?? "");
  const [sedangBuatAI, setSedangBuatAI] = useState(false);
  const [pesanAI, setPesanAI] = useState({ error: "", sukses: "" });

  async function handleBuatDeskripsiAI() {
    setPesanAI({ error: "", sukses: "" });
    if (!formRef.current) return;

    const form = formRef.current;
    const nama = form.elements.namedItem("nama")?.value?.trim() || "";
    const kategori = form.elements.namedItem("kategori")?.value?.trim() || "";

    if (!nama) {
      setPesanAI({
        error: "Isi nama produk terlebih dahulu agar AI tahu apa yang dideskripsikan.",
        sukses: "",
      });
      return;
    }

    setSedangBuatAI(true);
    try {
      const res = await buatDeskripsiAksi(nama, kategori);
      if (res?.error) {
        setPesanAI({ error: res.error, sukses: "" });
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI({
          error: "",
          sukses: "Deskripsi berhasil dibuat dengan AI! Anda bisa mengeditnya sebelum disimpan.",
        });
      }
    } catch {
      setPesanAI({ error: "Gagal terhubung ke layanan AI.", sukses: "" });
    } finally {
      setSedangBuatAI(false);
    }
  }

  return (
    <form
      ref={formRef}
      key={state ? "form-dengan-error" : "form-awal"}
      action={formAction}
      className="flex max-w-xl flex-col gap-4"
    >
      {state?.error && (
        <div className="rounded-lg border border-bahaya bg-latar p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      <Input
        label="Nama produk"
        name="nama"
        defaultValue={nilai.nama ?? ""}
        error={state?.errors?.nama}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="1"
        step="1"
        defaultValue={nilai.harga ?? ""}
        error={state?.errors?.harga}
        required
      />
      <Input label="Kategori" name="kategori" defaultValue={nilai.kategori ?? ""} />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={nilai.foto_url ?? ""}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="input-deskripsi" className="text-sm font-semibold">
            Deskripsi produk
          </label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={sedangBuatAI}
            className="inline-flex items-center gap-1.5 rounded-md border border-garis bg-permukaan px-2.5 py-1 text-xs font-semibold text-utama transition-colors hover:border-utama disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
            {sedangBuatAI ? "AI sedang menulis..." : "Buat dengan AI"}
          </button>
        </div>

        {pesanAI.error && (
          <p className="text-xs text-bahaya">{pesanAI.error}</p>
        )}
        {pesanAI.sukses && (
          <p className="text-xs text-utama">{pesanAI.sukses}</p>
        )}

        <textarea
          id="input-deskripsi"
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Jelaskan keistimewaan rasa, bahan, atau manfaat produk..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
