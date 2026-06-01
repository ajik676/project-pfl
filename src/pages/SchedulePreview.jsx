import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiCheck, HiArrowLeft, HiCalendar, HiClock } from "react-icons/hi";

export default function SchedulePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const scheduleData = location.state;

  if (!scheduleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Tidak ada data pratinjau jadwal. Silakan isi form kembali.</p>
        <Button onClick={() => navigate("/schedule/add")}>Ke Form Jadwal Baru</Button>
      </div>
    );
  }

  const handleConfirmSave = () => {
    // Generate schedule ID
    const newId = `SCH-0${db.getSchedules().length + 1}`;
    
    // Fetch patient name if patientId is provided, or use patientId directly
    let patientName = scheduleData.patientName;
    if (!patientName && scheduleData.patientId) {
      const p = db.getPatients().find(p => p.id === scheduleData.patientId);
      patientName = p ? p.name : scheduleData.patientId;
    }

    const newSchedule = {
      id: newId,
      patientId: scheduleData.patientId || "Guest",
      patientName: patientName || "Guest Pasien",
      date: scheduleData.date,
      time: scheduleData.time,
      doctor: scheduleData.doctor || "drg. Rina",
      complaint: scheduleData.complaint || "Pemeriksaan Gigi Rutin",
      status: "Menunggu"
    };

    // Save to Database Store
    db.saveSchedule(newSchedule);

    // Save notification
    db.saveNotification({
      id: `NT-0${db.getNotifications().length + 1}`,
      title: "Reminder Jadwal Pasien",
      description: `Jadwal konsultasi baru dibuat untuk ${newSchedule.patientName} dengan ${newSchedule.doctor} pada ${newSchedule.date} pukul ${newSchedule.time} WIB.`,
      type: "Reminder Jadwal",
      date: new Date().toISOString().split("T")[0],
      isRead: false
    });

    alert("Jadwal antrean kunjungan berhasil didaftarkan!");
    navigate("/schedule");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/schedule/add", { state: scheduleData })}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors"
        >
          <HiArrowLeft className="text-base" /> Kembali ke Form & Edit
        </button>

        <Card className="border border-slate-200/80 shadow-md">
          <CardHeader className="bg-slate-50/60">
            <CardTitle>Pratinjau Jadwal Baru</CardTitle>
            <CardDescription>Periksa ringkasan jadwal konsultasi sebelum disimpan.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-6">
            
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-bold text-xl flex items-center justify-center">
                <HiCalendar className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Konsultasi Gigi Terjadwal</h3>
                <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Status Awal: Menunggu</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-600">
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Nama Pasien</span>
                <span className="text-slate-800 font-bold">
                  {scheduleData.patientName || db.getPatients().find(p => p.id === scheduleData.patientId)?.name || scheduleData.patientId}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Dokter Gigi</span>
                <span className="text-slate-800 font-bold text-blue-600">{scheduleData.doctor || "drg. Rina"}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Tanggal Kunjungan</span>
                <span className="text-slate-800 font-bold">{scheduleData.date}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Waktu Kunjungan</span>
                <span className="text-slate-800 font-bold flex items-center gap-1"><HiClock /> {scheduleData.time} WIB</span>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-slate-400 font-medium block">Keluhan / Tindakan</span>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold italic">
                  {scheduleData.complaint || "Pemeriksaan Gigi Rutin"}
                </p>
              </div>

            </div>

          </CardContent>

          <CardFooter className="bg-slate-50/20 py-4.5 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/schedule/add", { state: scheduleData })}
            >
              Ubah Jadwal
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="flex items-center gap-1.5"
            >
              <HiCheck className="text-base" /> Konfirmasi & Simpan
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
