import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiCalendar, HiClock, HiUser, HiPlus, HiSearch, HiOutlineClock, HiTrash } from "react-icons/hi";

export default function Schedule() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSchedules(db.getSchedules());
  }, []);

  const filtered = schedules.filter((item) =>
    item.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case "Selesai": return "success";
      case "Menunggu": return "info";
      case "Dibatalkan": return "destructive";
      default: return "secondary";
    }
  };

  const handleCancelAppointment = (id, name) => {
    const found = schedules.find(s => s.id === id);
    if (found) {
      const updated = { ...found, status: "Dibatalkan" };
      db.saveSchedule(updated);
      setSchedules(db.getSchedules());
      
      // Save notification
      db.saveNotification({
        id: `NT-0${db.getNotifications().length + 1}`,
        title: "Jadwal Dibatalkan",
        description: `Jadwal pasien ${name} telah dibatalkan oleh operator.`,
        type: "Pemberitahuan",
        date: new Date().toISOString().split("T")[0],
        isRead: false
      });

      alert(`Jadwal untuk ${name} berhasil dibatalkan.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <HiCalendar className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Penjadwalan Pasien</h1>
              <p className="text-slate-500 text-sm italic">Kelola antrian kunjungan dokter gigi SmileDental</p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/schedule/add")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
          >
            <HiPlus className="text-lg" />
            Atur Jadwal Baru
          </Button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full md:w-[400px]">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama pasien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm text-xs text-slate-700 font-semibold"
          />
        </div>

        {/* SCHEDULE TABLE */}
        <Card className="overflow-hidden border border-slate-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Pasien</th>
                  <th className="px-6 py-4">Waktu Kunjungan</th>
                  <th className="px-6 py-4">Dokter Gigi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-sm">
                            <HiUser />
                          </div>
                          <span className="font-bold text-slate-800">{item.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800">{item.date}</div>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase mt-0.5">
                          <HiOutlineClock /> {item.time} WIB
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-600 font-bold px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-100/50">
                          {item.doctor}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/schedule/${item.id}`)}
                          >
                            Detail
                          </Button>
                          {item.status === "Menunggu" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelAppointment(item.id, item.patientName)}
                              className="text-red-600 hover:bg-rose-50"
                            >
                              Batalkan
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">Belum ada antrean jadwal konsultasi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* INFO SUMMARY ROW */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Ringkasan Antrean</p>
            <h4 className="text-xl font-bold">Terdaftar {schedules.filter(s => s.status === "Menunggu").length} pasien mengantre hari ini</h4>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
             <div className="text-center bg-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-sm">
                <span className="block text-2xl font-black text-white">{schedules.filter(s => s.status === "Menunggu").length}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-100">Menunggu</span>
             </div>
             <div className="text-center bg-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-sm">
                <span className="block text-2xl font-black text-white">{schedules.filter(s => s.status === "Selesai").length}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-100">Selesai</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}