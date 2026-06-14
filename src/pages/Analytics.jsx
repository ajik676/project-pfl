import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { StatsCard } from "../components/ui/StatsCard";
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineUsers, HiOutlineReceiptTax } from "react-icons/hi";

const revenueData = [
  { name: "Minggu 1", revenue: 15500000, profit: 9500000 },
  { name: "Minggu 2", revenue: 18200000, profit: 11200000 },
  { name: "Minggu 3", revenue: 16800000, profit: 10400000 },
  { name: "Minggu 4", revenue: 22100000, profit: 14500000 },
  { name: "Minggu 5", revenue: 26000000, profit: 17800000 },
  { name: "Minggu 6", revenue: 31500000, profit: 21000000 }
];

const customerGrowthData = [
  { name: "Jan", newPatients: 45, activeMembers: 120 },
  { name: "Feb", newPatients: 55, activeMembers: 140 },
  { name: "Mar", newPatients: 50, activeMembers: 168 },
  { name: "Apr", newPatients: 65, activeMembers: 195 },
  { name: "May", newPatients: 80, activeMembers: 240 },
  { name: "Jun", newPatients: 95, activeMembers: 315 }
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[20px] p-6 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HiOutlineChartBar className="text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">SmileDental CRM</span>
            </div>
            <h1 className="text-xl font-bold">Analytics & Reporting Dashboard</h1>
            <p className="text-xs text-blue-100/90 max-w-xl">
              Tinjauan analisis finansial berkala, grafik pertumbuhan loyalitas pasien, dan performa retensi keanggotaan klinik.
            </p>
          </div>
          <span className="text-5xl opacity-15 hidden sm:block">📊</span>
        </div>

        {/* Analytics KPI row (Using StatsCard) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard title="Growth Rate" value="+18.4%" description="Pendapatan bulan ini" icon={HiOutlineTrendingUp} />
          <StatsCard title="Pasien Baru Terdaftar" value="95 Orang" description="Total pasien baru Juni" icon={HiOutlineUsers} />
          <StatsCard title="Customer Lifetime Value" value="Rp 1.85M" description="Rata-rata kontribusi" icon={HiOutlineReceiptTax} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue & Profit chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Grafik pendapatan kotor vs profit bersih mingguan (IDR).</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" name="Pendapatan" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="profit" name="Profit Bersih" stroke="#10b981" strokeWidth={2.5} fill="url(#colorProf)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Customer growth charts */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Grafik pendaftaran pasien baru vs member aktif bulanan.</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={customerGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="newPatients" name="Pasien Baru" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="activeMembers" name="Member Aktif" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
