import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { DataTable } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { HiOutlineDocumentSearch, HiOutlineClipboardList, HiEye } from "react-icons/hi";

export default function DentalRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(db.getDentalRecords());
  }, []);

  const columns = [
    {
      header: "Pasien",
      accessorKey: "patientName",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-800">{row.patientName}</span>,
    },
    {
      header: "Tanggal Periksa",
      accessorKey: "date",
      sortable: true,
    },
    {
      header: "Dokter Gigi",
      accessorKey: "doctor",
      sortable: true,
      cell: (row) => <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs">{row.doctor}</span>,
    },
    {
      header: "Diagnosa",
      accessorKey: "diagnosis",
      sortable: true,
      cell: (row) => <span className="text-slate-600 line-clamp-1 max-w-[180px]">{row.diagnosis}</span>,
    },
    {
      header: "Tindakan Perawatan",
      accessorKey: "treatment",
      sortable: true,
      cell: (row) => <span className="text-slate-600 font-semibold">{row.treatment}</span>,
    },
    {
      header: "Kontrol Berikutnya",
      accessorKey: "controlDate",
      sortable: true,
      cell: (row) => <span className="text-xs text-slate-500 font-bold">{row.controlDate || "-"}</span>,
    },
    {
      header: "Aksi",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dental-records/${row.id}`)}
          className="flex items-center gap-1"
        >
          <HiEye /> Rincian Rekam
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HiOutlineClipboardList className="text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-100">Dental Care CRM</span>
            </div>
            <h1 className="text-2xl font-bold">Rekam Medis & Odontogram</h1>
            <p className="text-xs text-teal-100/90 max-w-xl">Pencatatan klinis diagnosa pasien, tindakan tambal gigi, pencabutan, dan pembersihan karang gigi terjadwal berkala.</p>
          </div>
          <div className="text-5xl opacity-15 hidden md:block">🦷</div>
        </div>

        {/* Dental Records DataTable */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Daftar Rekam Medis Pasien</CardTitle>
            <CardDescription>Manajemen riwayat diagnosa dan hasil tindakan pelayanan gigi.</CardDescription>
          </CardHeader>

          <DataTable
            data={records}
            columns={columns}
            searchKey="patientName"
            searchPlaceholder="Cari berdasarkan nama pasien..."
          />
        </Card>

      </div>
    </div>
  );
}
