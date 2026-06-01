import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { DataTable } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { HiOutlineUserGroup, HiOutlineBadgeCheck } from "react-icons/hi";

export default function Membership() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Filter active patients as members
    const patients = db.getPatients();
    setMembers(patients);
  }, []);

  const columns = [
    {
      header: "Pasien",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0)}
          </div>
          <span className="font-bold text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      header: "ID Pasien",
      accessorKey: "id",
      sortable: true,
      cell: (row) => <span className="text-xs font-bold text-slate-500">{row.id}</span>,
    },
    {
      header: "Level Membership",
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
      header: "Tanggal Bergabung",
      accessorKey: "registeredDate",
      sortable: true,
    },
    {
      header: "Status Member",
      accessorKey: "membershipStatus",
      sortable: true,
      cell: (row) => (
        <Badge variant={row.membershipStatus === "Aktif" ? "success" : "destructive"}>
          {row.membershipStatus || "Aktif"}
        </Badge>
      ),
    },
    {
      header: "Aksi",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/memberships/${row.id}`)}
          className="flex items-center gap-1"
        >
          <HiOutlineBadgeCheck /> Detail Benefit
        </Button>
      ),
    },
  ];

  // Calculate statistics
  const totalPlatinum = members.filter(m => m.membershipLevel === "Platinum").length;
  const totalGold = members.filter(m => m.membershipLevel === "Gold").length;
  const totalSilver = members.filter(m => m.membershipLevel === "Silver").length;
  const totalBronze = members.filter(m => m.membershipLevel === "Bronze" || !m.membershipLevel).length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Statistics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 text-white">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platinum</span>
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-extrabold">{totalPlatinum}</span>
                <span className="text-2xl">💎</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-500 text-white">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">Gold</span>
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-extrabold">{totalGold}</span>
                <span className="text-2xl">👑</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-sky-500 text-white">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] font-bold text-sky-100 uppercase tracking-widest">Silver</span>
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-extrabold">{totalSilver}</span>
                <span className="text-2xl">🎗️</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-100 border border-slate-200">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-slate-500">Bronze</span>
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-extrabold text-slate-800">{totalBronze}</span>
                <span className="text-2xl">🥉</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Memberships Listing */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-100 mb-4">
            <CardTitle>Program Loyalitas & Keanggotaan Pasien</CardTitle>
            <CardDescription>Detail tingkat keanggotaan loyalitas pasien aktif.</CardDescription>
          </CardHeader>

          <DataTable
            data={members}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Cari member berdasarkan nama..."
          />
        </Card>

      </div>
    </div>
  );
}
