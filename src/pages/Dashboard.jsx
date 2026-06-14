import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { StatsCard } from "../components/ui/StatsCard";
import { Timeline, TimelineItem } from "../components/ui/Timeline";
import { StatBar } from "../components/ui/StatBar";
import { ScrollArea } from "../components/ui/ScrollArea";
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineBadgeCheck, 
  HiOutlineChatAlt,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCash,
  HiOutlinePlus,
  HiPlus,
  HiOutlineCheckCircle,
} from "react-icons/hi";

const chartData = [
  { name: "Jan", patients: 120, revenue: 15500000 },
  { name: "Feb", patients: 150, revenue: 18200000 },
  { name: "Mar", patients: 140, revenue: 16800000 },
  { name: "Apr", patients: 180, revenue: 22100000 },
  { name: "May", patients: 210, revenue: 26000000 },
  { name: "Jun", patients: 250, revenue: 31500000 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const [tasks, setTasks] = useState([
    { id: 1, text: "Siapkan dental kit Scaling untuk Andi Saputra", done: true },
    { id: 2, text: "Konfirmasi odontektomi Siti Aisyah via WhatsApp", done: false },
    { id: 3, text: "Kirim survei kepuasan pasca-tambal Dewi Lestari", done: false },
    { id: 4, text: "Pembaruan rontgen gigi geraham Budi Santoso", done: true },
  ]);

  useEffect(() => {
    setPatients(db.getPatients());
    setSchedules(db.getSchedules());
    setTransactions(db.getTransactions());
    setDoctors(db.getDoctors());
    setActivities(db.getCustomerActivities().slice(0, 4));
  }, []);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const totalPatients = patients.length;
  const newPatientsCount = patients.filter(p => p.registeredDate.startsWith("2026-06") || p.registeredDate.startsWith("2025-06") || p.registeredDate.startsWith("2026-05")).length;
  const activeMembers = patients.filter(p => p.membershipStatus === "Aktif").length;
  const appointmentsToday = schedules.filter(s => s.date === "2026-06-14").length;
  const activeDoctors = doctors.length;
  const revenueToday = transactions
    .filter(t => t.date === "2026-06-14" || t.date === "2026-06-05")
    .reduce((sum, curr) => sum + curr.amount, 0) || 1450000;
  
  const treatmentsTodayCount = schedules.filter(s => s.date === "2026-06-14" && s.status === "Selesai").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 font-sans text-slate-800 space-y-6">
      
      {/* Welcome Hero Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-[24px] p-6 md:p-8 shadow-xl shadow-blue-500/10">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Badge className="bg-white/20 text-white border-0 text-[10px] tracking-wider font-extrabold uppercase px-2.5 py-1">
              ✨ SmileDental Command Center
            </Badge>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Selamat Datang Kembali, drg. Rafi!
            </h1>
            <p className="text-xs text-blue-150 leading-relaxed font-medium">
              Klinik hari ini berjalan aktif dengan <span className="text-white font-black">{appointmentsToday} antrean reservasi</span>, 
              serta <span className="text-white font-black">{activeDoctors} dokter gigi spesialis</span> bertugas. Sistem siap melayani pasien Anda.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3.5 bg-slate-900/25 border border-white/15 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-center px-4">
              <span className="block text-xl font-black text-white">{appointmentsToday}</span>
              <span className="text-[9px] uppercase tracking-wider text-blue-250 font-bold">Reservasi</span>
            </div>
            <div className="w-px bg-white/20 self-stretch" />
            <div className="text-center px-4">
              <span className="block text-xl font-black text-white">{activeDoctors}</span>
              <span className="text-[9px] uppercase tracking-wider text-blue-250 font-bold">Dokter</span>
            </div>
            <div className="w-px bg-white/20 self-stretch" />
            <div className="text-center px-4">
              <span className="block text-xl font-black text-emerald-400">Rp {(revenueToday/1000).toFixed(0)}K</span>
              <span className="text-[9px] uppercase tracking-wider text-blue-250 font-bold">Revenue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Grid Section (Using the new StatsCard component) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CRM Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <span>💎</span> Hubungan Pelanggan (CRM)
            </h3>
            <Badge variant="info" className="text-[9px]">Customer Metrics</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard title="Total Pasien" value={`${totalPatients} Pasien`} description="Database Klinik" icon={HiOutlineUsers} />
            <StatsCard title="Pasien Baru" value={`+${newPatientsCount} Orang`} description="Bulan ini" trend={15} icon={HiOutlineUserGroup} />
            <StatsCard title="Member Aktif" value={`${activeMembers} Loyal`} description="Bronze - Platinum" icon={HiOutlineBadgeCheck} />
            <StatsCard title="Satisfaction NPS" value="4.8 / 5.0" description="Ulasan Bintang 5" icon={HiOutlineChatAlt} />
          </div>
        </div>

        {/* Operasional Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <span>🩺</span> Operasional Harian
            </h3>
            <Badge variant="success" className="text-[9px]">Live Activity</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatsCard title="Appointment Hari Ini" value={`${appointmentsToday} Antrean`} description="Menunggu panggilan" icon={HiOutlineCalendar} />
            <StatsCard title="Dokter On-Duty" value={`${activeDoctors} Dokter`} description="Spesialis bertugas" icon={HiOutlineUser} />
            <StatsCard title="Revenue Hari Ini" value={`Rp ${revenueToday.toLocaleString("id-ID")}`} description="Pencatatan kasir" icon={HiOutlineCash} />
            <StatsCard title="Treatment Selesai" value={`${treatmentsTodayCount} Tindakan`} description="Scaling & Cabut" icon={HiOutlinePlus} />
          </div>
        </div>

      </div>

      {/* Unique Middle Row (Using StatBar and Timeline components) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card: Dokter Shift Load Status */}
        <Card className="rounded-[20px] border border-slate-200/60 lg:col-span-1 shadow-sm">
          <CardHeader className="border-b border-slate-50 p-4">
            <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-slate-800">Beban Shift Dokter Hari Ini</CardTitle>
            <CardDescription className="text-[10px]">Persentase kesibukan slot dokter bertugas.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4.5">
            {doctors.map((d, index) => {
              const percentages = index === 0 ? 80 : index === 1 ? 40 : 25;
              const color = index === 0 ? "bg-red-500" : index === 1 ? "bg-blue-500" : "bg-slate-400";
              return (
                <StatBar 
                  key={d.id} 
                  label={d.name} 
                  value={`${percentages}% slot`} 
                  percentage={percentages} 
                  colorClass={color} 
                />
              );
            })}
          </CardContent>
        </Card>

        {/* Card: Admin Tasks Checklist */}
        <Card className="rounded-[20px] border border-slate-200/60 lg:col-span-1 shadow-sm">
          <CardHeader className="border-b border-slate-50 p-4">
            <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-slate-800">Checklist Pekerjaan Klinik</CardTitle>
            <CardDescription className="text-[10px]">Tugas harian operator SmileDental.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea maxHeight="180px" className="space-y-2.5">
              {tasks.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => toggleTask(t.id)}
                  className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors text-xs font-semibold text-slate-600"
                >
                  <HiOutlineCheckCircle className={`text-lg shrink-0 transition-colors ${
                    t.done ? "text-emerald-500 fill-emerald-50" : "text-slate-300"
                  }`} />
                  <span className={`truncate ${t.done ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {t.text}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Card: Real-time Patient Activity Feed */}
        <Card className="rounded-[20px] border border-slate-200/60 lg:col-span-1 shadow-sm">
          <CardHeader className="border-b border-slate-50 p-4">
            <CardTitle className="text-xs uppercase tracking-wider font-extrabold text-slate-800">Aktivitas Terkini CRM</CardTitle>
            <CardDescription className="text-[10px]">Aktivitas live pasien SmileDental.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea maxHeight="180px">
              <Timeline>
                {activities.map((a, idx) => (
                  <TimelineItem 
                    key={a.id}
                    title={a.patientName}
                    time={a.time}
                    description={`${a.action} - ${a.detail}`}
                    isActive={idx === 0}
                  />
                ))}
              </Timeline>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>

      {/* Financial Charts Area */}
      <Card className="rounded-[24px] border border-slate-200/60 shadow-sm">
        <CardHeader className="border-b border-slate-50 p-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle>Analisis Keuangan & Kunjungan Pasien</CardTitle>
            <CardDescription>Grafik tren pendapatan kotor mingguan vs total pasien bulanan.</CardDescription>
          </div>
          <Badge variant="default" className="w-fit text-[9px]">Januari - Juni 2026</Badge>
        </CardHeader>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Trends */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Tren Pendapatan Bulanan (IDR)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Composed Patients Visits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Statistik Kunjungan Pasien</h4>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="patients" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="patients" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3, fill: "#fff", stroke: "#4f46e5", strokeWidth: 1.5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

    </div>
  );
}