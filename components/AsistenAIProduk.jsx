"use client";

import { useActionState, useState, useRef } from "react";
import { tanyaAsistenProdukAksi } from "@/app/produk/[id]/actions";

export default function AsistenAIProduk({ idProduk, namaProduk }) {
  const [state, formAction, isPending] = useActionState(tanyaAsistenProdukAksi, null);
  const [teks, setTeks] = useState("");
  const inputRef = useRef(null);

  const contohPertanyaan = [
    "Apakah produk ini tahan lama?",
    "Bagaimana saran penyajiannya?",
    "Apakah cocok untuk oleh-oleh?",
  ];

  function pilihContoh(pertanyaan) {
    setTeks(pertanyaan);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <section
      aria-labelledby="judul-asisten-ai"
      className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-5 sm:p-6"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-utama text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        </div>
        <div>
          <h2 id="judul-asisten-ai" className="text-base font-bold">
            Tanya AI tentang produk ini
          </h2>
          <p className="text-xs text-teks-lembut">
            Asisten virtual menjawab seputar rasa, deskripsi, dan harga {namaProduk}.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="text-teks-lembut">Contoh:</span>
        {contohPertanyaan.map((pertanyaan) => (
          <button
            key={pertanyaan}
            type="button"
            onClick={() => pilihContoh(pertanyaan)}
            className="rounded-full border border-garis bg-latar px-2.5 py-1 text-teks hover:border-utama hover:text-utama"
          >
            {pertanyaan}
          </button>
        ))}
      </div>

      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="id_produk" value={idProduk} />
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name="pertanyaan"
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            maxLength={200}
            placeholder="Ketik pertanyaan Anda tentang produk ini..."
            required
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 pr-16 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <span className="absolute right-3 top-2.5 text-xs text-teks-lembut">
            {teks.length}/200
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending || !teks.trim()}
          className="inline-flex self-start items-center justify-center rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-utama-gelap disabled:opacity-50"
        >
          {isPending ? "Sedang menjawab..." : "Kirim Pertanyaan"}
        </button>
      </form>

      {state?.error && (
        <div className="rounded-lg border border-bahaya bg-latar p-3 text-xs text-bahaya">
          {state.error}
        </div>
      )}

      {state?.jawaban && (
        <div className="flex flex-col gap-1 rounded-lg border border-garis bg-latar p-3 text-sm">
          <p className="text-xs font-semibold text-teks-lembut">
            Jawaban untuk: &ldquo;{state.pertanyaanTerakhir}&rdquo;
          </p>
          <p className="leading-relaxed text-teks">{state.jawaban}</p>
        </div>
      )}
    </section>
  );
}
