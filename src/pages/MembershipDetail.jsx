import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi";

export default function MembershipDetail() {
  const { id } = useParams(); // patient id
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const list = db.getPatients();
    const found = list.find((p) => p.id === id);
    if (found) {
      setMember(found);
      
      // Calculate total transactions amount
      const txs = db.getTransactions().filter(t => t.patientId === found.id);
      const spent = txs.reduce((acc, curr) => acc + curr.amount, 0);
      setTotalSpent(spent);
    }
  }, [id]);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-500 font-semibold mb-4">Member Tidak Ditemukan</p>
        <Button onClick={() => navigate("/memberships")}>Kembali ke Membership</Button>
      </div>
    );
  }

  const getTierIcon = (tier) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return "💎";
      case "gold": return "👑";
      case "silver": return "🎗️";
      default: return "🥉";
    }
  };

  const getJoinDuration = (regDate) => {
    if (!regDate) return "1 Bulan";
    const start = new Date(regDate);
    const now = new Date("2026-06-01"); // Using current metadata time context
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 365) {
      return `${(diffDays / 365).toFixed(1)} Tahun`;
    }
    return `${Math.ceil(diffDays / 30)} Bulan`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/memberships")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors"
        >
          <HiArrowLeft className="text-base" /> Kembali ke Membership
        </button>

        {/* Membership Details Card */}
        <Card className="border border-slate-200/80 shadow-md">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Benefit Keanggotaan Pasien</CardTitle>
                <CardDescription>Detail loyalti pelanggan setia klinik gigi.</CardDescription>
              </div>
              <span className="text-2xl">{getTierIcon(member.membershipLevel)}</span>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            
            {/* Active Membership Badge Banner */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Nama Pasien</p>
                <p className="text-sm font-bold text-slate-900">{member.name}</p>
                <p className="text-[10px] text-slate-400">ID Member: <span className="font-bold text-slate-600">{member.id}</span></p>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tingkatan</p>
                <Badge variant={member.membershipLevel === "Platinum" ? "default" : member.membershipLevel === "Gold" ? "warning" : "secondary"}>
                  {member.membershipLevel || "Bronze"}
                </Badge>
              </div>
            </div>

            {/* Financial & Duration Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 text-xs">
                <span className="text-slate-400 font-medium block mb-1">Lama Bergabung</span>
                <span className="text-slate-800 font-bold">{getJoinDuration(member.registeredDate)}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 text-xs">
                <span className="text-slate-400 font-medium block mb-1">Total Transaksi</span>
                <span className="text-blue-600 font-bold">Rp {totalSpent.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Loyalty Tier Upgrade History & Benefit details */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Daftar Keuntungan Keanggotaan:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
                  <HiCheckCircle className="text-emerald-500 text-lg shrink-0 mt-0.5" />
                  Prioritas pemesanan jadwal via CRM System otomatis.
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
                  <HiCheckCircle className="text-emerald-500 text-lg shrink-0 mt-0.5" />
                  Diskon khusus konsultasi dan tindakan gigi sebesar {member.membershipLevel === "Platinum" ? "15%" : member.membershipLevel === "Gold" ? "10%" : member.membershipLevel === "Silver" ? "5%" : "2%"}.
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
                  <HiCheckCircle className="text-emerald-500 text-lg shrink-0 mt-0.5" />
                  Gratis paket dental kit perawatan gigi eksklusif SmileDental.
                </li>
              </ul>
            </div>

          </CardContent>

          <CardFooter className="py-4.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium italic">Pembaruan level otomatis berdasarkan transaksi</span>
            <Button variant="outline" size="sm" onClick={() => navigate("/memberships")}>Tutup</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
