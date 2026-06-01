import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { DataTable } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/Dialog";
import { HiOutlineCash, HiPrinter, HiEye } from "react-icons/hi";

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setTransactions(db.getTransactions());
  }, []);

  const totalEarnings = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const columns = [
    {
      header: "Invoice",
      accessorKey: "id",
      sortable: true,
      cell: (row) => <span className="font-bold text-blue-600">{row.id}</span>,
    },
    {
      header: "Pasien",
      accessorKey: "patientName",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-800">{row.patientName}</span>,
    },
    {
      header: "Tanggal",
      accessorKey: "date",
      sortable: true,
    },
    {
      header: "Layanan",
      accessorKey: "service",
      sortable: true,
    },
    {
      header: "Metode",
      accessorKey: "method",
      sortable: true,
      cell: (row) => <span className="text-xs text-slate-500 font-semibold">{row.method}</span>,
    },
    {
      header: "Total Pembayaran",
      accessorKey: "amount",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-900">Rp {row.amount.toLocaleString("id-ID")}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => <Badge variant="success">{row.status}</Badge>,
    },
    {
      header: "Aksi",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTx(row);
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-1"
          >
            <HiEye /> Detail
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/transactions/${row.id}`);
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            Invoice
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* KPI Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white md:col-span-2">
            <CardContent className="p-6 md:p-8 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Total Pendapatan Klinik</p>
                <h1 className="text-3xl font-extrabold">Rp {totalEarnings.toLocaleString("id-ID")}</h1>
                <p className="text-[11px] text-blue-100/80">Akumulasi seluruh riwayat transaksi pasien berhasil</p>
              </div>
              <div className="text-5xl opacity-20">💰</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
              <CardDescription>Pembagian persentase favorit pasien.</CardDescription>
            </CardHeader>
            <CardContent className="text-xs font-bold text-slate-700 space-y-2.5">
              <div className="flex justify-between items-center">
                <span>QRIS / E-Wallet</span>
                <span className="text-blue-600">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Debit / Kartu Kredit</span>
                <span className="text-blue-600">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tunai (Cash)</span>
                <span className="text-blue-600">20%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Data Table */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Riwayat Transaksi Keuangan</CardTitle>
            <CardDescription>Manajemen penagihan, invoice pembayaran, dan data keuangan klinik gigi.</CardDescription>
          </CardHeader>

          <DataTable
            data={transactions}
            columns={columns}
            searchKey="patientName"
            searchPlaceholder="Cari berdasarkan nama pasien..."
          />
        </Card>

        {/* Shadcn Dialog Popup: Transaction Detail */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            {selectedTx && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                    <HiOutlineCash className="text-lg" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pembayaran Berhasil</span>
                  </div>
                  <DialogTitle>Invoice #{selectedTx.id}</DialogTitle>
                  <DialogDescription>Detail rincian tagihan pelayanan medis.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 border-t border-b border-slate-100 py-4 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Nama Pasien</span>
                    <span className="text-slate-900 font-bold">{selectedTx.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Tanggal Transaksi</span>
                    <span className="text-slate-900">{selectedTx.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Layanan Perawatan</span>
                    <span className="text-slate-900 font-bold">{selectedTx.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Metode Pembayaran</span>
                    <span className="text-slate-900">{selectedTx.method}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-50 text-sm">
                    <span className="text-slate-900 font-bold">Total Pembayaran</span>
                    <span className="text-blue-600 font-extrabold">Rp {selectedTx.amount.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                    Tutup
                  </Button>
                  <Button size="sm" onClick={() => { alert("Mencetak invoice..."); }} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700">
                    <HiPrinter /> Cetak Struk
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
