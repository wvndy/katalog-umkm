-- Migrasi Tambahan Fitur Bonus (US-18 s/d US-50)
-- Cara pakai: Supabase Dashboard > SQL Editor > New query > tempel seluruh isi skrip ini > Run.
-- Aman dijalankan berulang (idempoten).

-- ========================================================
-- 1. Tambah Kolom Baru pada Tabel produk
-- ========================================================
alter table public.produk
  add column if not exists stok integer not null default 10,
  add column if not exists status_stok text not null default 'tersedia',
  add column if not exists harga_diskon integer,
  add column if not exists badge text,
  add column if not exists aktif boolean not null default true,
  add column if not exists urutan integer not null default 0;

-- ========================================================
-- 2. Tabel Kategori (US-31)
-- ========================================================
create table if not exists public.kategori (
  id bigint generated always as identity primary key,
  nama text not null unique,
  created_at timestamptz not null default now()
);

alter table public.kategori enable row level security;
drop policy if exists "admin_semua_kategori" on public.kategori;
create policy "admin_semua_kategori" on public.kategori
  for all to authenticated using (true) with check (true);

-- Isi kategori dari produk yang sudah ada jika belum ada
insert into public.kategori (nama)
select distinct kategori from public.produk
where kategori is not null and trim(kategori) != ''
on conflict (nama) do nothing;

-- ========================================================
-- 3. Tabel Galeri Foto Produk (US-18)
-- ========================================================
create table if not exists public.produk_foto (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  foto_url text not null,
  urutan integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.produk_foto enable row level security;
drop policy if exists "admin_semua_produk_foto" on public.produk_foto;
create policy "admin_semua_produk_foto" on public.produk_foto
  for all to authenticated using (true) with check (true);

-- ========================================================
-- 4. Tabel Ulasan & Rating (US-38 & US-39)
-- ========================================================
create table if not exists public.ulasan (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  komentar text not null,
  tampil boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.ulasan enable row level security;
drop policy if exists "admin_semua_ulasan" on public.ulasan;
create policy "admin_semua_ulasan" on public.ulasan
  for all to authenticated using (true) with check (true);

-- ========================================================
-- 5. Tabel Catatan Klik WhatsApp (US-40 & US-41)
-- ========================================================
create table if not exists public.klik_wa (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.klik_wa enable row level security;
drop policy if exists "admin_semua_klik_wa" on public.klik_wa;
create policy "admin_semua_klik_wa" on public.klik_wa
  for all to authenticated using (true) with check (true);

-- ========================================================
-- 6. Tabel Banner Promo (US-42)
-- ========================================================
create table if not exists public.banner (
  id bigint generated always as identity primary key,
  judul text not null,
  teks text,
  gambar_url text,
  tautan text,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.banner enable row level security;
drop policy if exists "admin_semua_banner" on public.banner;
create policy "admin_semua_banner" on public.banner
  for all to authenticated using (true) with check (true);

-- ========================================================
-- 7. Tabel Pengaturan Toko (US-43)
-- ========================================================
create table if not exists public.pengaturan_toko (
  id integer primary key default 1 check (id = 1),
  nama text not null,
  tagline text,
  nomor_whatsapp text not null,
  alamat text,
  jam_buka text,
  updated_at timestamptz not null default now()
);

alter table public.pengaturan_toko enable row level security;
drop policy if exists "admin_semua_pengaturan_toko" on public.pengaturan_toko;
create policy "admin_semua_pengaturan_toko" on public.pengaturan_toko
  for all to authenticated using (true) with check (true);

-- Isi pengaturan awal jika kosong
insert into public.pengaturan_toko (id, nama, tagline, nomor_whatsapp, alamat, jam_buka)
values (1, 'Toko SwandyAlwaySelalu', 'Produk rumahan dari dapur dan perajin lokal, siap dipesan lewat WhatsApp.', '6289526999204', 'Jl. Contoh No. 1, Kota Anda', 'Setiap hari, 08.00–20.00')
on conflict (id) do nothing;

-- ========================================================
-- 8. Tabel Log Aktivitas Admin (US-45)
-- ========================================================
create table if not exists public.log_aktivitas (
  id bigint generated always as identity primary key,
  admin_email text not null,
  aksi text not null,
  rincian text,
  created_at timestamptz not null default now()
);

alter table public.log_aktivitas enable row level security;
drop policy if exists "admin_semua_log_aktivitas" on public.log_aktivitas;
create policy "admin_semua_log_aktivitas" on public.log_aktivitas
  for all to authenticated using (true) with check (true);

-- ========================================================
-- 9. Tabel Varian Produk (US-48)
-- ========================================================
create table if not exists public.varian_produk (
  id bigint generated always as identity primary key,
  produk_id bigint not null references public.produk(id) on delete cascade,
  nama text not null,
  harga integer not null check (harga >= 0),
  created_at timestamptz not null default now()
);

alter table public.varian_produk enable row level security;
drop policy if exists "admin_semua_varian_produk" on public.varian_produk;
create policy "admin_semua_varian_produk" on public.varian_produk
  for all to authenticated using (true) with check (true);
