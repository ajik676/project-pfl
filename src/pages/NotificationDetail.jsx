import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiArrowLeft, HiOutlineBell } from "react-icons/hi";

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    const list = db.getNotifications();
    const found = list.find((n) => n.id === id);
    if (found) {
      setNotif(found);
      // Automatically mark as read if opened
      if (!found.isRead) {
        db.markNotificationRead(found.id);
      }
    }
  }, [id]);

  if (!notif) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Notifikasi Tidak Ditemukan</p>
        <Button onClick={() => navigate("/notifications")}>Kembali ke Notifikasi</Button>
      </div>
    );
  }

  const getNotifColor = (type) => {
    switch (type) {
      case "Reminder Jadwal": return "bg-blue-50 text-blue-600";
      case "Pasien Baru": return "bg-emerald-50 text-emerald-600";
      case "Membership Upgrade": return "bg-amber-50 text-amber-600";
      case "Pembayaran Berhasil": return "bg-sky-50 text-sky-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/notifications")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors"
        >
          <HiArrowLeft className="text-base" /> Kembali ke Notifikasi Center
        </button>

        {/* Notification Detail Card */}
        <Card className="border border-slate-200/80 shadow-md">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rincian Notifikasi</CardTitle>
                <CardDescription>Pesan sistem otomatis SmileDental CRM.</CardDescription>
              </div>
              <Badge variant="secondary">Pemberitahuan</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            
            {/* Visual Icon Header Block */}
            <div className={`p-6 rounded-2xl flex flex-col items-center text-center space-y-3 ${getNotifColor(notif.type)}`}>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                <HiOutlineBell />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm">{notif.title}</h3>
                <p className="text-[10px] opacity-75 font-semibold uppercase tracking-wider">{notif.type} · {notif.date}</p>
              </div>
            </div>

            {/* Description content */}
            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-2">
                <span className="text-slate-400 font-medium block">Pesan Lengkap Notifikasi</span>
                <p className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100/50 text-slate-700 leading-relaxed text-sm font-semibold">
                  {notif.description}
                </p>
              </div>
            </div>

          </CardContent>

          <CardFooter className="py-4.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Status: <span className="text-emerald-600 font-bold">Terbaca</span></span>
            <Button size="sm" onClick={() => navigate("/notifications")}>Tutup</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
