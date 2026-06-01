import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiArrowLeft, HiPrinter, HiScissors } from "react-icons/hi";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);

  useEffect(() => {
    const list = db.getTransactions();
    const found = list.find((t) => t.id === id);
    if (found) {
      setTx(found);
    }
  }, [id]);

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Invoice Tidak Ditemukan</p>
        <Button onClick={() => navigate("/transactions")}>Kembali ke Transaksi</Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors print:hidden"
        >
          <HiArrowLeft className="text-base" /> Kembali ke Transaksi
        </button>

        {/* Invoice Card */}
        <Card className="border border-slate-200 shadow-lg">
          <CardContent className="p-8 md:p-12 space-y-8">
            
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Smile<span className="text-blue-600 italic">Dental</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Klinik Dokter Gigi Spesialis</p>
              </div>
              <div className="sm:text-right">
                <p className="text-lg font-bold text-slate-800">INVOICE</p>
                <p className="text-xs text-blue-600 font-extrabold">{tx.id}</p>
              </div>
            </div>

            {/* Billing Metadata */}
            <div className="grid grid-cols-2 gap-6 text-xs text-slate-600 font-semibold">
              <div>
                <p className="text-slate-400 font-medium mb-1">Ditagihkan Kepada:</p>
                <p className="text-slate-900 font-bold text-sm">{tx.patientName}</p>
                <p className="text-[11px] text-slate-400">ID Pasien: {tx.patientId || "-"}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-slate-400 font-medium mb-1">Detail Pembayaran:</p>
                <p className="text-slate-950">Tanggal: {tx.date}</p>
                <p className="text-slate-950">Metode: {tx.method}</p>
              </div>
            </div>

            {/* Invoice Table Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-3 text-left font-bold text-slate-400 text-[10px] uppercase tracking-wider pb-2 border-b border-slate-100">
                <div className="col-span-2">Deskripsi Layanan</div>
                <div className="text-right">Jumlah (IDR)</div>
              </div>
              
              <div className="grid grid-cols-3 text-xs font-semibold text-slate-700 py-1">
                <div className="col-span-2">{tx.service}</div>
                <div className="text-right">Rp {tx.amount.toLocaleString("id-ID")}</div>
              </div>

              {/* Subtotal & Totals */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs font-semibold text-slate-600">
                <div className="grid grid-cols-3">
                  <div className="col-span-2 text-slate-400 font-medium text-right pr-6">Subtotal</div>
                  <div className="text-right text-slate-800">Rp {tx.amount.toLocaleString("id-ID")}</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="col-span-2 text-slate-400 font-medium text-right pr-6">Pajak (0%)</div>
                  <div className="text-right text-slate-800">Rp 0</div>
                </div>
                <div className="grid grid-cols-3 text-sm pt-2 border-t border-slate-50 font-bold">
                  <div className="col-span-2 text-slate-900 text-right pr-6">Total Pembayaran</div>
                  <div className="text-right text-blue-600 font-extrabold">Rp {tx.amount.toLocaleString("id-ID")}</div>
                </div>
              </div>
            </div>

            {/* Note / Signatures */}
            <div className="text-center text-[11px] text-slate-400 leading-relaxed font-semibold italic border-t border-dashed border-slate-200 pt-6">
              "Terima kasih atas kunjungan Anda. Jagalah kesehatan gigi Anda dengan kontrol berkala setiap 6 bulan."
            </div>

          </CardContent>
          
          <CardFooter className="bg-slate-50/50 flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={() => navigate("/transactions")}>
              Kembali
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700">
              <HiPrinter /> Cetak Invoice
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
