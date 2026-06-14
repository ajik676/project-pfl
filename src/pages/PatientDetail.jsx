import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/Separator";
import { Timeline, TimelineItem } from "../components/ui/Timeline";
import { ScrollArea } from "../components/ui/ScrollArea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { 
  HiArrowLeft, 
  HiOutlinePhone, 
  HiOutlineMail, 
  HiOutlineLocationMarker,
  HiOutlineGift,
  HiOutlineTrendingUp,
  HiOutlineChatAlt,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCreditCard
} from "react-icons/hi";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const found = db.getPatients().find((p) => p.id === id);
    if (found) {
      setPatient(found);
    }
  }, [id]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Data Pasien Tidak Ditemukan</p>
        <Button onClick={() => navigate("/patients")}>Kembali ke Daftar Pasien</Button>
      </div>
    );
  }

  const getMembershipBadgeVariant = (lvl) => {
    switch (lvl?.toLowerCase()) {
      case "platinum": return "default";
      case "gold": return "warning";
      case "silver": return "info";
      default: return "secondary";
    }
  };

  // Get dynamic data for this specific patient
  const patientSchedules = db.getSchedules().filter(s => s.patientId === patient.id || s.patientName === patient.name);
  const patientTransactions = db.getTransactions().filter(t => t.patientId === patient.id || t.patientName === patient.name);
  const patientRecords = db.getDentalRecords().filter(r => r.patientId === patient.id || r.patientName === patient.name);
  const patientFeedbacks = db.getFeedbacks().filter(f => f.patientName === patient.name);
  const patientActivities = db.getCustomerActivities().filter(a => a.patientName === patient.name);
  
  // Get points balance
  const loyaltyData = db.getLoyaltyRewards();
  const patientPoints = loyaltyData.points.find(p => p.patientId === patient.id)?.balance || 0;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate("/patients")}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors w-fit"
      >
        <HiArrowLeft className="text-base" /> Kembali ke Daftar Pasien
      </button>

      {/* Customer 360 Header Profile */}
      <Card className="rounded-[20px] border border-slate-200/60 shadow-sm">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Foto / Avatar */}
            <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {patient.name.charAt(0)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-xl font-black text-slate-900 leading-tight">{patient.name}</h1>
                <Badge variant={getMembershipBadgeVariant(patient.membershipLevel)}>
                  {patient.membershipLevel} Member
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID Pasien: <span className="text-slate-800">{patient.id}</span></p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 font-semibold pt-1">
                <span className="flex items-center gap-1.5"><HiOutlinePhone className="text-slate-400" /> {patient.phone}</span>
                <span className="flex items-center gap-1.5"><HiOutlineMail className="text-slate-400" /> {patient.email || "-"}</span>
                <span className="flex items-center gap-1.5"><HiOutlineLocationMarker className="text-slate-400" /> {patient.city || "Jakarta"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Split CRM History vs Operational History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Riwayat CRM */}
        <Card className="rounded-[20px] border border-slate-200/60 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-base">💎</span>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Riwayat Hubungan (CRM)</h3>
          </div>

          <Tabs defaultValue="aktivitas">
            <TabsList className="w-full flex justify-start overflow-x-auto bg-slate-100/50 p-1 border border-slate-250/20 rounded-xl mb-4">
              <TabsTrigger value="aktivitas" className="flex items-center gap-1.5"><HiOutlineTrendingUp /> Aktivitas</TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-1.5"><HiOutlineChatAlt /> Feedback</TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-1.5"><HiOutlineGift /> Loyalty</TabsTrigger>
            </TabsList>

            {/* TAB: Aktivitas Pelanggan (Using Timeline Component) */}
            <TabsContent value="aktivitas">
              {patientActivities.length > 0 ? (
                <ScrollArea maxHeight="260px">
                  <Timeline className="mt-2.5">
                    {patientActivities.map((a, idx) => (
                      <TimelineItem 
                        key={idx}
                        title={a.action}
                        time={a.time}
                        description={a.detail}
                        isActive={idx === 0}
                      />
                    ))}
                  </Timeline>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-slate-400 text-[11px] font-bold">Tidak ada aktivitas audit log pasien.</div>
              )}
            </TabsContent>

            {/* TAB: Feedback & Ulasan */}
            <TabsContent value="feedback" className="space-y-3">
              {patientFeedbacks.length > 0 ? (
                <div className="space-y-3">
                  {patientFeedbacks.map((f, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-150/40 text-xs font-semibold space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">{f.doctorName || "Klinik"}</span>
                        <span className="text-[10px] text-slate-400">{f.date}</span>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: f.rating }).map((_, i) => <span key={i}>★</span>)}
                      </div>
                      <p className="text-slate-600 italic">"{f.comment}"</p>
                      <Badge variant={f.type === "Keluhan" ? "destructive" : "success"}>{f.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-[11px] font-bold">Belum memberikan feedback atau review.</div>
              )}
            </TabsContent>

            {/* TAB: Loyalty & Reward */}
            <TabsContent value="loyalty" className="space-y-4">
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Poin Loyalitas</span>
                  <h4 className="text-2xl font-black text-blue-600">{patientPoints} Poin</h4>
                </div>
                <span className="text-3xl">🎁</span>
              </div>
              
              <Separator label="Katalog Voucher" />
              
              <div className="space-y-2.5">
                {loyaltyData.vouchers.map((v, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                    <div>
                      <p className="text-slate-800 font-bold">{v.name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{v.code}</span>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={patientPoints < v.pointsRequired}
                      onClick={() => alert(`Sukses klaim voucher ${v.code}!`)}
                    >
                      {v.pointsRequired} Poin
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* RIGHT COLUMN: Riwayat Operasional */}
        <Card className="rounded-[20px] border border-slate-200/60 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-base">🩺</span>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Riwayat Operasional</h3>
          </div>

          <Tabs defaultValue="appointment">
            <TabsList className="w-full flex justify-start overflow-x-auto bg-slate-100/50 p-1 border border-slate-250/20 rounded-xl mb-4">
              <TabsTrigger value="appointment" className="flex items-center gap-1.5"><HiOutlineCalendar /> Appointment</TabsTrigger>
              <TabsTrigger value="rekam-medis" className="flex items-center gap-1.5"><HiOutlineClipboardList /> Rekam Medis</TabsTrigger>
              <TabsTrigger value="transaksi" className="flex items-center gap-1.5"><HiOutlineCreditCard /> Transaksi</TabsTrigger>
            </TabsList>

            {/* TAB: Appointment / Reservasi */}
            <TabsContent value="appointment" className="space-y-3">
              {patientSchedules.length > 0 ? (
                <div className="space-y-3">
                  {patientSchedules.map((s, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-150/40 text-xs font-semibold space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{s.doctor}</span>
                        <span className="text-[10px] text-slate-400">{s.date} ({s.time} WIB)</span>
                      </div>
                      <p className="text-slate-500">Keluhan: <span className="text-slate-700">{s.complaint}</span></p>
                      <div className="pt-1.5">
                        <Badge variant={s.status === "Selesai" ? "success" : s.status === "Menunggu" ? "info" : "destructive"}>
                          {s.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-[11px] font-bold">Belum memiliki jadwal antrean.</div>
              )}
            </TabsContent>

            {/* TAB: Rekam Medis */}
            <TabsContent value="rekam-medis" className="space-y-3">
              {patientRecords.length > 0 ? (
                <div className="space-y-3">
                  {patientRecords.map((r, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-150/40 text-xs font-semibold space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-100/50 pb-1.5">
                        <span className="font-bold text-slate-800">{r.doctor}</span>
                        <span className="text-slate-400">{r.date}</span>
                      </div>
                      <p className="text-slate-600"><span className="text-slate-400 font-medium block mb-0.5">Diagnosa</span>{r.diagnosis}</p>
                      <p className="text-slate-700 font-bold"><span className="text-slate-400 font-medium block mb-0.5">Tindakan</span>{r.treatment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-[11px] font-bold">Belum memiliki catatan rekam medis gigi.</div>
              )}
            </TabsContent>

            {/* TAB: Transaksi Keuangan */}
            <TabsContent value="transaksi" className="space-y-3">
              {patientTransactions.length > 0 ? (
                <div className="space-y-3">
                  {patientTransactions.map((t, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-150/40 text-xs font-semibold flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-blue-600 block">{t.id}</span>
                        <span className="text-slate-400 font-medium block">{t.service}</span>
                        <span className="text-slate-400 text-[10px]">{t.date} · {t.method}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-800 block">Rp {t.amount.toLocaleString("id-ID")}</span>
                        <Badge variant="success" className="mt-1">{t.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-[11px] font-bold">Belum memiliki riwayat transaksi pembayaran.</div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

      </div>

    </div>
  );
}
