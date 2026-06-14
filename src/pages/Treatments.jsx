import React, { useState, useEffect } from "react";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { HiOutlineHeart, HiPlus } from "react-icons/hi";

export default function Treatments() {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    setTreatments(db.getTreatments());
  }, []);

  const handleEditTreatment = (name) => {
    alert(`Mengedit info tindakan: ${name}`);
  };

  const columns = [
    {
      header: "Tindakan / Layanan",
      accessorKey: "name",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-800">{row.name}</span>,
    },
    {
      header: "Kategori",
      accessorKey: "category",
      sortable: true,
      cell: (row) => <Badge variant="secondary">{row.category}</Badge>,
    },
    {
      header: "Durasi Perkiraan",
      accessorKey: "duration",
      sortable: true,
      cell: (row) => <span className="text-slate-400 font-semibold">{row.duration}</span>,
    },
    {
      header: "Harga Tarif (IDR)",
      accessorKey: "price",
      sortable: true,
      cell: (row) => <span className="font-extrabold text-slate-900">Rp {row.price.toLocaleString("id-ID")}</span>,
    },
    {
      header: "Deskripsi",
      accessorKey: "description",
      cell: (row) => <p className="text-slate-500 font-medium line-clamp-1 max-w-sm">{row.description}</p>,
    },
    {
      header: "Aksi",
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => handleEditTreatment(row.name)}>
          Edit Info
        </Button>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[20px] border border-slate-200/60 shadow-sm/5">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <HiOutlineHeart className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Daftar Layanan & Treatment</h1>
              <p className="text-slate-500 text-xs italic">Kelola katalog tindakan klinik gigi, durasi estimasi, dan daftar tarif harga</p>
            </div>
          </div>

          <Button onClick={() => alert("Tambah treatment baru...")} className="flex items-center gap-1.5">
            <HiPlus /> Tambah Layanan
          </Button>
        </div>

        {/* Treatments catalog table */}
        <Card className="p-5">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Katalog Layanan SmileDental</CardTitle>
            <CardDescription>Tarif dasar jasa pelayanan dokter gigi spesialis terverifikasi.</CardDescription>
          </CardHeader>
          <DataTable
            data={treatments}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Cari berdasarkan nama treatment..."
          />
        </Card>

      </div>
    </div>
  );
}
