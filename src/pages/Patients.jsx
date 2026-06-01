import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { DataTable } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/Dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { HiUserAdd, HiPencilAlt, HiTrash, HiOutlineUsers } from "react-icons/hi";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  
  // Deletion state
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setPatients(db.getPatients());
  }, []);

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      db.deletePatient(patientToDelete.id);
      setPatients(db.getPatients());
      
      // Save notification
      db.saveNotification({
        id: `NT-0${db.getNotifications().length + 1}`,
        title: "Pasien Dihapus",
        description: `Data pasien ${patientToDelete.name} telah dihapus dari sistem oleh administrator.`,
        type: "Pemberitahuan",
        date: new Date().toISOString().split("T")[0],
        isRead: false
      });

      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
      alert("Data pasien berhasil dihapus.");
    }
  };

  const columns = [
    {
      header: "Pasien",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div 
          onClick={() => navigate(`/patients/${row.id}`)}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-150">{row.name}</span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">ID: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Info Medis",
      accessorKey: "gender",
      sortable: true,
      cell: (row) => (
        <div className="text-xs font-semibold text-slate-600">
          {row.gender}, {row.age} Tahun
        </div>
      ),
    },
    {
      header: "Keluhan Utama",
      accessorKey: "complaint",
      sortable: true,
      cell: (row) => (
        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-medium border border-slate-200/50">
          {row.complaint || "Konsultasi Umum"}
        </span>
      ),
    },
    {
      header: "Membership",
      accessorKey: "membershipLevel",
      sortable: true,
      cell: (row) => {
        const lvl = row.membershipLevel || "Bronze";
        let variant = "secondary";
        if (lvl === "Platinum") variant = "default";
        else if (lvl === "Gold") variant = "warning";
        else if (lvl === "Silver") variant = "info";
        
        return <Badge variant={variant}>{lvl}</Badge>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <Badge variant={row.status === "Aktif" ? "success" : "destructive"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Tindakan",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/patients/${row.id}`); // Navigate to detail
            }}
          >
            <HiPencilAlt className="text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setPatientToDelete(row);
              setIsDeleteDialogOpen(true);
            }}
            className="text-red-600 hover:bg-rose-50"
          >
            <HiTrash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <HiOutlineUsers className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Manajemen Pasien</h1>
              <p className="text-slate-500 text-sm italic">Daftar rekam medis & keanggotaan klinik</p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/patients/add")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
          >
            <HiUserAdd className="text-lg" />
            Pasien Baru
          </Button>
        </div>

        {/* Patients DataTable Component */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Database Rekam Medis Pasien</CardTitle>
            <CardDescription>Semua data pasien klinik gigi yang terdaftar di dalam sistem.</CardDescription>
          </CardHeader>
          
          <DataTable
            data={patients}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Cari nama pasien..."
          />
        </Card>

        {/* Tips footer */}
        <div className="bg-blue-900 text-blue-100 p-4.5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="bg-blue-800 p-2.5 rounded-xl">🦷</div>
          <p className="text-xs leading-relaxed">
            <b>Tips Operator:</b> Klik nama pasien untuk membuka detail rekam medis penuh, catatan admin, membership loyalty, dan riwayat transaksi lengkap.
          </p>
        </div>

        {/* Shadcn UI Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus data pasien <strong className="text-slate-800">{patientToDelete?.name}</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteConfirm}>
                Hapus Permanen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}