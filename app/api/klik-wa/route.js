import { NextResponse } from "next/server";
import { buatClientServer } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = Number(body?.produk_id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID produk tidak valid" }, { status: 400 });
    }

    const supabase = buatClientServer();
    // Catat hanya produk_id dan waktu otomatis, tanpa data pribadi apa pun (US-40).
    await supabase.from("klik_wa").insert({ produk_id: id });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
