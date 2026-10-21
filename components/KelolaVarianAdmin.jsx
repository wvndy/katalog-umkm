import { tambahVarianAksi, hapusVarianAksi } from "@/app/admin/actions";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";

export default function KelolaVarianAdmin({ produkId, varianList = [] }) {
  return (
    <section className="flex max-w-xl flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-5">
      <h2 className="text-base font-bold">Varian Harga & Ukuran</h2>
      <p className="text-xs text-teks-lembut">
        Tambahkan variasi ukuran atau rasa dengan harga berbeda. Pilihan ini akan tampil di halaman detail dan masuk ke pesan WhatsApp.
      </p>

      {varianList.length > 0 && (
        <div className="flex flex-col gap-2">
          {varianList.map((varian) => (
            <div
              key={varian.id}
              className="flex items-center justify-between rounded-lg border border-garis bg-latar px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{varian.nama}</span>
                <span className="text-xs text-teks-lembut">—</span>
                <span className="font-bold text-harga">{formatRupiah(varian.harga)}</span>
              </div>
              <form action={hapusVarianAksi}>
                <input type="hidden" name="id" value={varian.id} />
                <input type="hidden" name="produk_id" value={produkId} />
                <button
                  type="submit"
                  className="text-xs font-semibold text-bahaya underline hover:opacity-80"
                >
                  Hapus
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form action={tambahVarianAksi} className="flex flex-col gap-3 border-t border-garis pt-3">
        <input type="hidden" name="produk_id" value={produkId} />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="nama"
            placeholder="Nama varian (cth: Ukuran 500g)"
            required
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-xs text-teks focus:border-utama focus:outline-none"
          />
          <input
            type="number"
            name="harga"
            placeholder="Harga (Rp)"
            min="0"
            required
            className="rounded-lg border border-garis bg-latar px-3 py-2 text-xs text-teks focus:border-utama focus:outline-none"
          />
        </div>
        <Tombol type="submit" varian="garis" className="self-start text-xs py-1.5">
          + Tambah Varian
        </Tombol>
      </form>
    </section>
  );
}
