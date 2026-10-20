import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { buatClientAuth } from "@/lib/supabase/auth";

function formatWaktu(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function HalamanLog() {
  const supabase = await buatClientAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: logList } = await supabase
    .from("log_aktivitas")
    .select("id, admin_email, aksi, rincian, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const daftarLog = logList ?? [];

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />

      <div>
        <h1 className="text-2xl font-extrabold">Log Aktivitas Admin</h1>
        <p className="mt-1 text-sm text-teks-lembut">
          50 aktivitas terbaru.
        </p>
      </div>

      {daftarLog.length === 0 ? (
        <p className="py-10 text-center text-teks-lembut">
          Belum ada log aktivitas.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-garis text-teks-lembut">
                <th className="px-3 py-2 font-semibold">Admin</th>
                <th className="px-3 py-2 font-semibold">Aksi</th>
                <th className="px-3 py-2 font-semibold">Rincian</th>
                <th className="px-3 py-2 font-semibold">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {daftarLog.map((log) => (
                <tr key={log.id} className="border-b border-garis">
                  <td className="px-3 py-2 text-teks-lembut">{log.admin_email}</td>
                  <td className="px-3 py-2 font-medium">{log.aksi}</td>
                  <td className="max-w-xs truncate px-3 py-2 text-teks-lembut">
                    {log.rincian || "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-teks-lembut">
                    {formatWaktu(log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
