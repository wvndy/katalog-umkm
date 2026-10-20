"use client";

import { useEffect, useState } from "react";
import { hitungTotalItem } from "@/lib/keranjang";

export default function BadgeKeranjang() {
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    function update() {
      setJumlah(hitungTotalItem());
    }
    update();
    window.addEventListener("keranjang-berubah", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("keranjang-berubah", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (jumlah <= 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bahaya px-1 text-[10px] font-bold text-white">
      {jumlah > 99 ? "99+" : jumlah}
    </span>
  );
}
