"use client";

const KUNCI_KERANJANG = "katalog_keranjang";

export function ambilKeranjang() {
  try {
    const raw = localStorage.getItem(KUNCI_KERANJANG);
    const data = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function simpanKeranjang(daftar) {
  try {
    localStorage.setItem(KUNCI_KERANJANG, JSON.stringify(daftar));
    window.dispatchEvent(new Event("keranjang-berubah"));
  } catch {}
}

export function tambahKeKeranjang(produk, jumlah = 1, catatan = "") {
  const daftar = ambilKeranjang();
  const idx = daftar.findIndex((item) => String(item.id) === String(produk.id));

  if (idx >= 0) {
    daftar[idx].jumlah += jumlah;
    if (catatan) daftar[idx].catatan = catatan;
  } else {
    daftar.push({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga_diskon && produk.harga_diskon < produk.harga ? produk.harga_diskon : produk.harga,
      foto_url: produk.foto_url,
      kategori: produk.kategori,
      jumlah,
      catatan: catatan || "",
    });
  }

  simpanKeranjang(daftar);
}

export function ubahJumlahKeranjang(id, jumlahBaru) {
  let daftar = ambilKeranjang();
  if (jumlahBaru <= 0) {
    daftar = daftar.filter((item) => String(item.id) !== String(id));
  } else {
    const idx = daftar.findIndex((item) => String(item.id) === String(id));
    if (idx >= 0) daftar[idx].jumlah = jumlahBaru;
  }
  simpanKeranjang(daftar);
}

export function hapusDariKeranjang(id) {
  const daftar = ambilKeranjang().filter((item) => String(item.id) !== String(id));
  simpanKeranjang(daftar);
}

export function kosongkanKeranjang() {
  simpanKeranjang([]);
}

export function hitungTotalItem() {
  return ambilKeranjang().reduce((total, item) => total + item.jumlah, 0);
}

export function hitungTotalHarga() {
  return ambilKeranjang().reduce((total, item) => total + item.harga * item.jumlah, 0);
}
