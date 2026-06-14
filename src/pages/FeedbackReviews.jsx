import React, { useState, useEffect } from "react";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { Rating } from "../components/ui/Rating";
import { StatsCard } from "../components/ui/StatsCard";
import { HiOutlineChatAlt, HiOutlineExclamationCircle } from "react-icons/hi";

export default function FeedbackReviews() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    setFeedbacks(db.getFeedbacks());
  }, []);

  const handleResolveComplaint = (id) => {
    const found = feedbacks.find(f => f.id === id);
    if (found) {
      const updated = { ...found, status: "Selesai" };
      db.saveFeedback(updated);
      setFeedbacks(db.getFeedbacks());
      alert(`Komplain dari ${found.patientName} berhasil diselesaikan!`);
    }
  };

  const columns = [
    {
      header: "Tanggal",
      accessorKey: "date",
      sortable: true,
      cell: (row) => <span className="text-slate-400 font-semibold">{row.date}</span>,
    },
    {
      header: "Pasien",
      accessorKey: "patientName",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-800">{row.patientName}</span>,
    },
    {
      header: "Rating",
      accessorKey: "rating",
      sortable: true,
      cell: (row) => <Rating value={row.rating} readOnly />,
    },
    {
      header: "Kategori Dokter",
      accessorKey: "doctorName",
      sortable: true,
      cell: (row) => <span className="font-bold text-blue-600">{row.doctorName || "Umur Klinik"}</span>,
    },
    {
      header: "Ulasan / Ulasan Pasien",
      accessorKey: "comment",
      cell: (row) => <span className="text-slate-600 italic font-semibold leading-relaxed">"{row.comment}"</span>,
    },
    {
      header: "Klasifikasi",
      accessorKey: "type",
      sortable: true,
      cell: (row) => {
        let variant = "info";
        if (row.type === "Keluhan") variant = "destructive";
        else if (row.type === "Pujian") variant = "success";
        return <Badge variant={variant}>{row.type}</Badge>;
      },
    },
    {
      header: "Aksi / Status",
      cell: (row) => {
        if (row.type === "Keluhan" && row.status !== "Selesai") {
          return (
            <Button size="sm" onClick={() => handleResolveComplaint(row.id)} className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
              <HiOutlineExclamationCircle /> Selesaikan
            </Button>
          );
        }
        return <Badge variant="success">Resolved</Badge>;
      }
    }
  ];

  const pendingComplaints = feedbacks.filter(f => f.type === "Keluhan" && f.status !== "Selesai").length;
  const resolvedComplaints = feedbacks.filter(f => f.type === "Keluhan" && f.status === "Selesai").length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[20px] p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HiOutlineChatAlt className="text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">SmileDental CRM</span>
            </div>
            <h1 className="text-xl font-bold">Feedback & Review Management</h1>
            <p className="text-xs text-blue-100/90 max-w-xl">
              Pantau kepuasan pelanggan, ulasan pasien terhadap pelayanan dokter gigi, dan kelola komplain/keluhan admin secara profesional.
            </p>
          </div>
          <span className="text-5xl opacity-15 hidden sm:block">💬</span>
        </div>

        {/* Satisfaction Rating Stats (Using StatsCard) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard title="Kepuasan Klinik" value="4.8 / 5.0" description="Berdasarkan 120 ulasan" />
          <StatsCard title="Komplain Aktif" value={`${pendingComplaints} Pending`} description="Butuh tindak lanjut" />
          <StatsCard title="Komplain Selesai" value={`${resolvedComplaints} Resolved`} description="Sukses diselesaikan" />
        </div>

        {/* Feedbacks reviews table */}
        <Card className="p-5">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Daftar Ulasan & Rating Pasien</CardTitle>
            <CardDescription>Umpan balik langsung pasien terhadap pelayanan dokter dan suasana klinik gigi.</CardDescription>
          </CardHeader>
          <DataTable
            data={feedbacks}
            columns={columns}
            searchKey="patientName"
            searchPlaceholder="Cari berdasarkan nama pasien..."
          />
        </Card>

      </div>
    </div>
  );
}
