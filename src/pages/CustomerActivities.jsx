import React, { useState, useEffect } from "react";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { DataTable } from "../components/ui/DataTable";
import { HiOutlineTrendingUp, HiOutlineLogin, HiOutlineCalendar, HiOutlineCreditCard } from "react-icons/hi";

export default function CustomerActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setActivities(db.getCustomerActivities());
  }, []);

  const getActionBadge = (act) => {
    if (act.includes("Login")) {
      return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/30"><HiOutlineLogin /> Login</span>;
    }
    if (act.includes("Booking") || act.includes("Consultation")) {
      return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/30"><HiOutlineCalendar /> Booking</span>;
    }
    if (act.includes("Payment") || act.includes("Invoice")) {
      return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/30"><HiOutlineCreditCard /> Payment</span>;
    }
    return <Badge variant="secondary">{act}</Badge>;
  };

  const columns = [
    {
      header: "Waktu Aktivitas",
      accessorKey: "time",
      sortable: true,
      cell: (row) => <span className="text-slate-400 font-semibold">{row.time}</span>,
    },
    {
      header: "Nama Pasien",
      accessorKey: "patientName",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-800">{row.patientName}</span>,
    },
    {
      header: "Jenis Aktivitas",
      accessorKey: "action",
      sortable: true,
      cell: (row) => getActionBadge(row.action),
    },
    {
      header: "Rincian Detail",
      accessorKey: "detail",
      cell: (row) => <span className="text-slate-600 font-medium">{row.detail}</span>,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[20px] p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HiOutlineTrendingUp className="text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">SmileDental CRM</span>
            </div>
            <h1 className="text-xl font-bold">Aktivitas Pelanggan (Audits)</h1>
            <p className="text-xs text-blue-100/90 max-w-xl">
              Pantau aktivitas masuk (login), pemesanan jadwal reservasi online (booking), transaksi pembayaran, dan pembaruan membership pasien secara real-time.
            </p>
          </div>
          <span className="text-5xl opacity-15 hidden sm:block">📈</span>
        </div>

        {/* Audit Log Table */}
        <Card className="p-5">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Log Riwayat Aktivitas Pasien</CardTitle>
            <CardDescription>Jejak audit aktivitas interaksi pasien dengan sistem klinik.</CardDescription>
          </CardHeader>
          <DataTable
            data={activities}
            columns={columns}
            searchKey="patientName"
            searchPlaceholder="Cari log nama pasien..."
          />
        </Card>

      </div>
    </div>
  );
}
