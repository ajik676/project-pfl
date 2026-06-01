import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiOutlineBell, HiCheckCircle, HiChevronRight, HiPlus } from "react-icons/hi";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    setNotifs(db.getNotifications());
  }, []);

  const handleMarkRead = (id) => {
    db.markNotificationRead(id);
    setNotifs(db.getNotifications());
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "Reminder Jadwal": return "📅";
      case "Pasien Baru": return "👤";
      case "Membership Upgrade": return "💎";
      case "Pembayaran Berhasil": return "💳";
      default: return "🔔";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <HiOutlineBell className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Pusat Notifikasi</h1>
              <p className="text-slate-500 text-sm italic">Notifikasi aktivitas, reminder jadwal, & transaksi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                db.getNotifications().forEach(n => db.markNotificationRead(n.id));
                setNotifs(db.getNotifications());
                alert("Semua notifikasi ditandai dibaca!");
              }}
              className="text-xs"
            >
              Tandai Semua Dibaca
            </Button>
          </div>
        </div>

        {/* Notifications list */}
        <Card className="divide-y divide-slate-100 overflow-hidden border border-slate-200/80 shadow-sm">
          {notifs.length > 0 ? (
            notifs.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  handleMarkRead(n.id);
                  navigate(`/notifications/${n.id}`);
                }}
                className={`p-6 flex items-start gap-4 hover:bg-slate-50/70 transition-all duration-150 cursor-pointer ${
                  !n.isRead ? "bg-blue-50/20" : ""
                }`}
              >
                {/* Icon Circle */}
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shadow-inner shrink-0">
                  {getNotifIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      {n.title}
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      )}
                    </span>
                    <span className="text-slate-400 font-semibold">{n.date}</span>
                  </div>
                  <p className="text-slate-500 font-semibold">{n.description}</p>
                  
                  <div className="flex items-center gap-2 pt-1.5">
                    <Badge variant="secondary">{n.type}</Badge>
                    {!n.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(n.id);
                        }}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </div>
                </div>

                <HiChevronRight className="text-slate-300 text-lg self-center" />
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">Pusat notifikasi kosong.</div>
          )}
        </Card>

      </div>
    </div>
  );
}
