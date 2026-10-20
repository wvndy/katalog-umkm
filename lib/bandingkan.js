"use client";

const KUNCI_BANDINGKAN = "katalog_bandingkan";
const MAKS = 2;

export function ambilBandingkan() {
  try {
    const raw = localStorage.getItem(KUNCI_BANDINGKAN);
    const data = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data.slice(0, MAKS) : [];
  } catch {
    return [];
  }
}

export function simpanBandingkan(daftar) {
  try {
    localStorage.setItem(KUNCI_BANDINGKAN, JSON.stringify(daftar.slice(0, MAKS)));
    window.dispatchEvent(new Event("bandingkan-berubah"));
  } catch {}
}

export function toggleBandingkan(produk) {
  const daftar = ambilBandingkan();
  const idx = daftar.findIndex((item) => String(item.id) === String(produk.id));

  if (idx >= 0) {
    daftar.splice(idx, 1);
    simpanBandingkan(daftar);
    return { ditambah: false, penuh: false };
  }

  if (daftar.length >= MAKS) {
    daftar.shift();
  }

  daftar.push({
    id: produk.id,
    nama: produk.nama,
    harga: produk.harga,
    harga_diskon: produk.harga_diskon,
    foto_url: produk.foto_url,
    kategori: produk.kategori,
    deskripsi: produk.deskripsi,
  });

  simpanBandingkan(daftar);
  return { ditambah: true, penuh: daftar.length >= MAKS };
}

export function kosongkanBandingkan() {
  simpanBandingkan([]);
}
