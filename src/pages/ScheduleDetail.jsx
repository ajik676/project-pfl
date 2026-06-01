import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiArrowLeft, HiOutlineUser, HiOutlineClock, HiOutlineDocumentText, HiOutlineCalendar, HiBell } from "react-icons/hi";

export default function ScheduleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const list = db.getSchedules();
    const found = list.find((s) => s.id === id);
    if (found) {
      setSchedule(found);
    }
  }, [id]);

  if (!schedule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Jadwal Tidak Ditemukan</p>
        <Button onClick={() => navigate("/schedule")}>Kembali ke Jadwal</Button>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus) => {
    const updated = { ...schedule, status: newStatus };
    db.saveSchedule(updated);
    setSchedule(updated);
    alert(`Status kunjungan berhasil diubah menjadi: ${newStatus}`);
  };

  const handleSendReminder = () => {
    alert(`Reminder SMS & WhatsApp berhasil dikirimkan ke pasien ${schedule.patientName}!`);
  };

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case "Selesai": return "success";
      case "Menunggu": return "info";
      case "Dibatalkan": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/schedule")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors"
        >
          <HiArrowLeft className="text-base" /> Kembali ke Jadwal
        </button>

        {/* Schedule Detail Card */}
        <Card className="border border-slate-200/80 shadow-md">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detail Jadwal Konsultasi</CardTitle>
                <CardDescription>Jadwal antrean kunjungan klinik gigi.</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(schedule.status)}>
                {schedule.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-6">
            
            {/* Info Row: Patient */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <HiOutlineUser className="text-xl" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-slate-400 font-semibold uppercase tracking-wider">Nama Pasien</p>
                <p className="text-sm font-bold text-slate-800">{schedule.patientName}</p>
                <p className="text-slate-400 font-semibold">ID: {schedule.patientId || "-"}</p>
              </div>
            </div>

            {/* Info Row: Doctor */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <span className="text-lg">🥼</span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-slate-400 font-semibold uppercase tracking-wider">Dokter yang Menangani</p>
                <p className="text-sm font-bold text-slate-800">{schedule.doctor}</p>
              </div>
            </div>

            {/* Info Row: Complaint */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl">
                <HiOutlineDocumentText className="text-xl" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-slate-400 font-semibold uppercase tracking-wider">Keluhan / Tindakan</p>
                <p className="text-sm font-bold text-slate-800">{schedule.complaint || "Konsultasi Umum"}</p>
              </div>
            </div>

            {/* Info Row: Date & Time */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <HiOutlineCalendar className="text-xl" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-slate-400 font-semibold uppercase tracking-wider">Tanggal & Waktu Konsultasi</p>
                <p className="text-sm font-bold text-slate-800">{schedule.date}</p>
                <p className="text-slate-500 font-semibold flex items-center gap-1 mt-0.5"><HiOutlineClock /> Pukul {schedule.time} WIB</p>
              </div>
            </div>

          </CardContent>

          <CardFooter className="flex flex-wrap gap-2 justify-between py-4.5 bg-slate-50/50">
            {/* Status change actions */}
            <div className="flex gap-1.5">
              {schedule.status !== "Selesai" && schedule.status !== "Dibatalkan" && (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("Selesai")} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                    Selesai
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("Dibatalkan")} className="border-red-200 text-red-600 hover:bg-rose-50">
                    Batalkan
                  </Button>
                </>
              )}
            </div>

            <Button size="sm" onClick={handleSendReminder} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900">
              <HiBell /> Kirim Reminder
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
