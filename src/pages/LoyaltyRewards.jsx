import React, { useState, useEffect } from "react";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { StatsCard } from "../components/ui/StatsCard";
import { HiOutlineGift, HiOutlineTicket, HiOutlineUserGroup, HiOutlineClock } from "react-icons/hi";

export default function LoyaltyRewards() {
  const [loyaltyData, setLoyaltyData] = useState({ points: [], vouchers: [], redemptions: [] });

  useEffect(() => {
    setLoyaltyData(db.getLoyaltyRewards());
  }, []);

  const handleRedeem = (code, pointsRequired) => {
    alert(`Sukses meredeem voucher ${code}. Mengurangi ${pointsRequired} poin pasien.`);
  };

  const pointsColumns = [
    {
      header: "Nama Pasien",
      accessorKey: "patientName",
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-800">{row.patientName}</span>,
    },
    {
      header: "ID Pasien",
      accessorKey: "patientId",
      sortable: true,
      cell: (row) => <span className="text-xs text-slate-400 font-bold">{row.patientId}</span>,
    },
    {
      header: "Saldo Poin",
      accessorKey: "balance",
      sortable: true,
      cell: (row) => <span className="font-extrabold text-blue-600">{row.balance} Poin</span>,
    },
    {
      header: "Tingkat Member",
      accessorKey: "tier",
      sortable: true,
      cell: (row) => {
        let variant = "secondary";
        if (row.tier === "Platinum") variant = "default";
        else if (row.tier === "Gold") variant = "warning";
        else if (row.tier === "Silver") variant = "info";
        return <Badge variant={variant}>{row.tier}</Badge>;
      },
    }
  ];

  const voucherColumns = [
    {
      header: "Kode Voucher",
      accessorKey: "code",
      cell: (row) => <span className="font-bold text-slate-700 font-mono bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded">{row.code}</span>,
    },
    {
      header: "Nama Voucher",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-slate-800">{row.name}</span>,
    },
    {
      header: "Poin Dibutuhkan",
      accessorKey: "pointsRequired",
      cell: (row) => <span className="text-blue-600 font-bold">{row.pointsRequired} Poin</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <Badge variant="success">{row.status}</Badge>,
    },
    {
      header: "Aksi",
      cell: (row) => (
        <Button size="sm" onClick={() => handleRedeem(row.code, row.pointsRequired)}>
          Redeem
        </Button>
      ),
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[20px] p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HiOutlineGift className="text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">SmileDental CRM</span>
            </div>
            <h1 className="text-xl font-bold">Loyalty & Reward System</h1>
            <p className="text-xs text-blue-100/90 max-w-xl">
              Kelola program retensi pasien, saldo poin loyalitas, penukaran voucher diskon, dan benefit keanggotaan klinik gigi.
            </p>
          </div>
          <span className="text-5xl opacity-15 hidden sm:block">🎁</span>
        </div>

        {/* Top Cards Grid (Using StatsCard) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard title="Total Terdistribusi" value="5,350 Poin" description="Poin loyalitas pasien" icon={HiOutlineUserGroup} />
          <StatsCard title="Voucher Aktif" value="3 Varian" description="Katalog voucher promosi" icon={HiOutlineTicket} />
          <StatsCard title="Penukaran Hari Ini" value="2 Klaim" description="Voucher diredeem pasien" icon={HiOutlineClock} />
        </div>

        {/* Loyalty Point Table */}
        <Card className="p-5">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Daftar Poin Loyalitas Pasien</CardTitle>
            <CardDescription>Kelola peringkat member dan perolehan poin dari transaksi perawatan.</CardDescription>
          </CardHeader>
          <DataTable
            data={loyaltyData.points}
            columns={pointsColumns}
            searchKey="patientName"
            searchPlaceholder="Cari saldo poin pasien..."
          />
        </Card>

        {/* Vouchers Catalog */}
        <Card className="p-5">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Katalog Voucher Reward</CardTitle>
            <CardDescription>Voucher diskon perawatan klinik yang dapat ditukarkan menggunakan poin pasien.</CardDescription>
          </CardHeader>
          <DataTable
            data={loyaltyData.vouchers}
            columns={voucherColumns}
          />
        </Card>

      </div>
    </div>
  );
}
