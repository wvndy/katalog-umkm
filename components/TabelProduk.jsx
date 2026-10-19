import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapus from "@/components/TombolHapus";
import { toggleAktifProduk, ubahUrutanProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-3 py-3 font-semibold text-center">Urutan</th>
            <th className="px-3 py-3 font-semibold text-center">Status</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk) => {
            const aktif = produk.aktif !== false;
            const urutan = produk.urutan ?? 0;

            return (
              <tr key={produk.id} className="border-t border-garis transition-colors hover:bg-permukaan/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={produk.foto_url || "/produk/keripik.svg"}
                      alt=""
                      className="h-10 w-10 rounded-md bg-permukaan object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{produk.nama}</span>
                      {produk.badge && (
                        <span className="self-start rounded bg-utama/15 px-1.5 py-0.5 text-[10px] font-bold text-utama">
                          {produk.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* US-47: Urutan tampil naik/turun */}
                <td className="px-3 py-3 text-center">
                  <div className="inline-flex items-center gap-1">
                    <form action={ubahUrutanProduk}>
                      <input type="hidden" name="id" value={produk.id} />
                      <input type="hidden" name="arah" value="naik" />
                      <input type="hidden" name="urutan" value={urutan} />
                      <button
                        type="submit"
                        title="Naikkan urutan"
                        aria-label="Naikkan urutan"
                        className="flex h-7 w-7 items-center justify-center rounded border border-garis bg-latar text-xs font-bold hover:border-utama hover:text-utama"
                      >
                        ▲
                      </button>
                    </form>
                    <span className="w-6 text-center text-xs font-semibold text-teks-lembut">
                      {urutan}
                    </span>
                    <form action={ubahUrutanProduk}>
                      <input type="hidden" name="id" value={produk.id} />
                      <input type="hidden" name="arah" value="turun" />
                      <input type="hidden" name="urutan" value={urutan} />
                      <button
                        type="submit"
                        title="Turunkan urutan"
                        aria-label="Turunkan urutan"
                        className="flex h-7 w-7 items-center justify-center rounded border border-garis bg-latar text-xs font-bold hover:border-utama hover:text-utama"
                      >
                        ▼
                      </button>
                    </form>
                  </div>
                </td>

                {/* US-32: Aktif / Nonaktifkan produk */}
                <td className="px-3 py-3 text-center">
                  <form action={toggleAktifProduk}>
                    <input type="hidden" name="id" value={produk.id} />
                    <input type="hidden" name="aktif" value={String(aktif)} />
                    <button
                      type="submit"
                      title={aktif ? "Klik untuk sembunyikan" : "Klik untuk tampilkan"}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                        aktif
                          ? "bg-utama/15 text-utama hover:bg-utama/25"
                          : "bg-garis text-teks-lembut hover:bg-garis/80"
                      }`}
                    >
                      {aktif ? "Aktif" : "Nonaktif"}
                    </button>
                  </form>
                </td>

                <td className="px-4 py-3 text-teks-lembut">{produk.kategori || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{formatRupiah(produk.harga)}</span>
                    {produk.harga_diskon && produk.harga_diskon < produk.harga && (
                      <span className="text-xs text-bahaya">
                        Diskon: {formatRupiah(produk.harga_diskon)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                      Ubah
                    </Tombol>
                    <TombolHapus id={produk.id} nama={produk.nama} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
