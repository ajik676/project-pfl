import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiArrowLeft, HiOutlineUserCircle, HiHeart } from "react-icons/hi";

export default function DentalRecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const list = db.getDentalRecords();
    const found = list.find((r) => r.id === id);
    if (found) {
      setRecord(found);
    }
  }, [id]);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Rekam Medis Tidak Ditemukan</p>
        <Button onClick={() => navigate("/dental-records")}>Kembali ke Rekam Medis</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/dental-records")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors"
        >
          <HiArrowLeft className="text-base" /> Kembali ke Rekam Medis
        </button>

        {/* Detail Card */}
        <Card className="border border-slate-200/80 shadow-md">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rincian Pemeriksaan Pasien</CardTitle>
                <CardDescription>Rekaman diagnosa resmi dokter gigi penanggung jawab.</CardDescription>
              </div>
              <span className="text-xl">🩺</span>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            
            {/* Identity Banner */}
            <div className="flex items-center gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <HiOutlineUserCircle className="text-2xl" />
              </div>
              <div className="flex-1 text-xs">
                <p className="text-slate-400 font-semibold uppercase tracking-wider">Identitas Pasien</p>
                <p className="text-sm font-bold text-slate-900">{record.patientName}</p>
                <p className="text-slate-400 font-semibold">ID Pasien: {record.patientId || "-"}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-600">
              
              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-400 font-medium">Tanggal Pemeriksaan</span>
                <span className="text-slate-800 font-bold">{record.date}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-400 font-medium">Dokter Gigi</span>
                <span className="text-slate-800 font-bold text-blue-600">{record.doctor}</span>
              </div>

              <div className="space-y-1.5 border-b border-slate-50 pb-3.5">
                <span className="text-slate-400 font-medium block">Diagnosa Klinis</span>
                <p className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-slate-700 font-semibold italic">
                  {record.diagnosis}
                </p>
              </div>

              <div className="space-y-1.5 border-b border-slate-50 pb-3.5">
                <span className="text-slate-400 font-medium block">Tindakan Perawatan (Treatment)</span>
                <p className="bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/50 text-slate-800 font-bold">
                  {record.treatment}
                </p>
              </div>

              <div className="space-y-1.5 border-b border-slate-50 pb-3.5">
                <span className="text-slate-400 font-medium block">Catatan Dokter Tambahan</span>
                <p className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-slate-600 italic font-medium leading-relaxed">
                  {record.notes || "-"}
                </p>
              </div>

              <div className="flex justify-between items-center pt-1.5">
                <span className="text-slate-400 font-medium">Jadwal Kontrol Ulang</span>
                <Badge variant="info" className="flex items-center gap-1">
                  <HiHeart className="text-[10px]" /> {record.controlDate || "Tidak Terjadwal"}
                </Badge>
              </div>

            </div>

          </CardContent>

          <CardFooter className="py-4.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
            <Button variant="outline" size="sm" onClick={() => navigate("/dental-records")}>Tutup</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
