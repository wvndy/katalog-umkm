/**
 * Integrasi Google Gemini API di sisi server.
 * Kunci API hanya dibaca di server dari environment variable GEMINI_API_KEY.
 */

const DAFTAR_MODEL = ["gemini-3.8-flash", "gemini-flash-latest"];

function ambilApiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY belum diisi di server. Tambahkan di file .env.local."
    );
  }
  return key;
}

export async function panggilGemini(prompt, systemInstruction = "") {
  const apiKey = ambilApiKey();

  const teksLengkap = systemInstruction
    ? `${systemInstruction}\n\n${prompt}`
    : prompt;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: teksLengkap }],
      },
    ],
  };

  let lastError = null;

  for (const model of DAFTAR_MODEL) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const pesan = errorJson?.error?.message || "";
        if (res.status === 400 && pesan.toLowerCase().includes("api key not valid")) {
          throw new Error(
            "Kunci GEMINI_API_KEY tidak valid. Buat API key resmi di Google AI Studio."
          );
        }
        lastError = new Error(pesan || `Permintaan ke Gemini API gagal (${res.status}).`);
        continue;
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p) => p.text)?.text;

      if (!textPart) {
        lastError = new Error("AI tidak memberikan respon teks.");
        continue;
      }

      return textPart.trim();
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("Semua model AI gagal merespon.");
}

/**
 * US-14: Buat deskripsi otomatis dari nama dan kategori produk
 */
export async function buatDeskripsiProdukAI(nama, kategori = "") {
  if (!nama || !nama.trim()) {
    throw new Error("Isi nama produk terlebih dahulu sebelum meminta AI membuat deskripsi.");
  }

  const prompt = `Buatkan deskripsi produk yang menarik, ramah, dan ringkas (2 sampai 3 kalimat saja) untuk produk UMKM berikut:
Nama: ${nama.trim()}
Kategori: ${kategori?.trim() || "Umum"}

Fokus pada keunggulan rasa/kualitas dan ajakan mencoba. Langsung tulis deskripsinya tanpa kalimat pembuka atau tanda petik.`;

  return await panggilGemini(
    prompt,
    "Anda adalah copywriter profesional produk UMKM Indonesia yang selalu menulis dengan gaya bahasa santun, menggugah selera, dan ringkas."
  );
}

/**
 * US-50: Asisten tanya jawab spesifik produk
 */
export async function tanyaJawabProdukAI(produk, pertanyaan) {
  if (!pertanyaan || !pertanyaan.trim()) {
    throw new Error("Pertanyaan tidak boleh kosong.");
  }

  const pertanyaanBersih = pertanyaan.trim().slice(0, 200);

  const infoProduk = `Nama produk: ${produk?.nama || "-"}
Harga: Rp ${Number(produk?.harga || 0).toLocaleString("id-ID")}
Kategori: ${produk?.kategori || "Umum"}
Deskripsi: ${produk?.deskripsi || "Belum ada deskripsi"}
Stok: ${produk?.status_stok === "habis" ? "Habis" : "Tersedia"}`;

  const prompt = `Data produk:
${infoProduk}

Pertanyaan pengunjung: "${pertanyaanBersih}"

Jawab pertanyaan pengunjung secara ringkas, ramah, dan HANYA berdasarkan data produk di atas. Jika data tidak ada atau pertanyaan di luar produk/toko, sampaikan dengan sopan bahwa Anda hanya bisa menjawab hal seputar produk tersebut dan sarankan bertanya ke WhatsApp pemilik toko.`;

  return await panggilGemini(
    prompt,
    "Anda adalah asisten virtual toko UMKM yang ramah dan hanya menjawab berdasarkan spesifikasi produk yang disediakan."
  );
}
