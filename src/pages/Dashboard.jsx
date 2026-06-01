import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

// ─── Data Dummy Klinik Gigi ───────────────────────────────────
const chartData = [
  { name: "Jan", patients: 120, revenue: 15500 },
  { name: "Feb", patients: 150, revenue: 18200 },
  { name: "Mar", patients: 140, revenue: 16800 },
  { name: "Apr", patients: 180, revenue: 22100 },
  { name: "May", patients: 210, revenue: 26000 },
  { name: "Jun", patients: 250, revenue: 31500 },
];

const topServices = [
  { id: 1, name: "Teeth Whitening", patients: 128, price: "Rp 1.500.000", pct: 85 },
  { id: 2, name: "Scaling & Polishing", patients: 315, price: "Rp 450.000", pct: 75 },
  { id: 3, name: "Root Canal Therapy", patients: 84, price: "Rp 2.500.000", pct: 45 },
  { id: 4, name: "Dental Implant", patients: 32, price: "Rp 8.000.000", pct: 25 },
];

const recentAppointments = [
  { id: "#APT-2042", patient: "Ayu Lestari", treatment: "Orthodontic Adjust", status: "done", total: "Rp 750.000" },
  { id: "#APT-2041", patient: "Reza Firmansyah", treatment: "Wisdom Tooth Ext.", status: "process", total: "Rp 2.500.000" },
  { id: "#APT-2040", patient: "Sinta Maharani", treatment: "Basic Scaling", status: "done", total: "Rp 450.000" },
  { id: "#APT-2039", patient: "Dika Pratama", treatment: "Teeth Whitening", status: "cancel", total: "Rp 1.500.000" },
  { id: "#APT-2038", patient: "Nisa Rahayu", treatment: "Dental Crown", status: "done", total: "Rp 3.000.000" },
];

// ─── Komponen Ikon (Tema Medis/Dental) ────────────────────────
const Icons = {
  Calendar: ({ className }) => <svg className={className} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Check: ({ className }) => <svg className={className} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  X: ({ className }) => <svg className={className} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Trend: ({ className }) => <svg className={className} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  UserPlus: ({ className }) => <svg className={className} width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Plus: ({ className }) => <svg className={className} width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Smile: ({ className }) => <svg className={className} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
};

// ─── Komponen Pendukung ──────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-[13px]">
      <p className="text-slate-500 mb-1 text-[11px] uppercase tracking-widest font-semibold">{label}</p>
      {/* Jika ComposedChart merender 2 payload (Bar & Line), kita ambil yang pertama saja untuk tooltip */}
      <p className="text-slate-800 font-bold text-[15px]">
        {prefix}{payload[0].value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

function KpiCard({ icon: Icon, value, label, delta, iconBgClass, iconColorClass }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
        <Icon className={iconColorClass} />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">{label}</p>
      </div>
      {delta && (
        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
          delta > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    done: { label: "Completed", className: "bg-emerald-50 text-emerald-600" },
    process: { label: "In Treatment", className: "bg-amber-50 text-amber-600" },
    cancel: { label: "Cancelled", className: "bg-rose-50 text-rose-600" },
  };
  const s = map[status] || map.done;
  return (
    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${s.className}`}>
      {s.label}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between px-6 pt-5">
      <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
      {action}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Icons.Smile className="text-blue-600" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">
                SmileDental Admin
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Clinic Overview
            </h1>
            <p className="text-[14px] text-slate-500 mt-1.5">
              Welcome back — here's what's happening at SmileDental today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/patients/add")}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors hover:border-blue-600 hover:text-blue-600"
            >
              <Icons.UserPlus className="w-4 h-4" /> Add Patient
            </button>
            <button
              onClick={() => navigate("/appointments/add")}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors hover:bg-blue-700 shadow-sm"
            >
              <Icons.Plus className="w-4 h-4" /> New Appointment
            </button>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <KpiCard icon={Icons.Calendar} value="1,050" label="Total Appointments" delta={8} iconBgClass="bg-blue-50" iconColorClass="text-blue-600" />
          <KpiCard icon={Icons.Check} value="985" label="Treatments Done" delta={12} iconBgClass="bg-emerald-50" iconColorClass="text-emerald-600" />
          <KpiCard icon={Icons.X} value="65" label="Cancelled" delta={-3} iconBgClass="bg-rose-50" iconColorClass="text-rose-600" />
          <KpiCard icon={Icons.Trend} value="Rp 130.1M" label="Total Revenue" delta={18} iconBgClass="bg-indigo-50" iconColorClass="text-indigo-600" />
        </div>

        {/* ── Charts + Top Services ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* AREA CHART: Revenue Trends */}
          <Card className="lg:col-span-1">
            <CardHeader
              title="Revenue Trends"
              action={<span className="text-[11px] font-semibold text-blue-600 tracking-wider uppercase">Jan – Jun 2025</span>}
            />
            <div className="p-5 pb-4">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip prefix="Rp " />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* COMPOSED CHART: Patient Visits */}
          <Card className="lg:col-span-1">
            <CardHeader
              title="Patient Visits"
              action={<span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">Monthly</span>}
            />
            <div className="p-5 pb-4">
              <ResponsiveContainer width="100%" height={240}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "#f1f5f9", opacity: 0.5 }} content={<CustomTooltip />} />
                  <Bar dataKey="patients" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={28} />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#012d94" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#fff", stroke: "##012d94", strokeWidth: 2 }} 
                    activeDot={{ r: 6, fill: "#000000" }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Services (Tetap menggunakan UI Progress Bar khusus) */}
          <Card className="lg:col-span-1">
            <CardHeader
              title="Top Services"
              action={<button className="text-[12.5px] font-semibold text-blue-600 hover:underline">View All</button>}
            />
            <div className="p-6">
              <div className="space-y-4">
                {topServices.map((p, i) => (
                  <div key={p.id} className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-bold text-slate-400 w-4 text-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{p.price} · {p.patients} patients</p>
                      </div>
                    </div>
                    <div className="ml-7 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          i === 0 ? "bg-blue-600" : i === 1 ? "bg-blue-400" : "bg-slate-300"
                        }`}
                        style={{ width: `${p.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Insight Alert */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-[12px] font-bold text-blue-900 mb-1">Clinic Insight</p>
                <p className="text-[11.5px] text-blue-800 leading-relaxed">
                  Teeth Whitening requests are up <strong className="text-blue-600">24%</strong> this month. Ensure sufficient stock of bleaching materials!
                </p>
              </div>
            </div>
          </Card>

        </div>

        {/* ── Recent Appointments Table ── */}
        <Card>
          <CardHeader
            title="Recent Appointments"
            action={<button className="text-[12.5px] font-semibold text-blue-600 hover:underline">View Schedule</button>}
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Apt ID</th>
                  <th className="px-6 py-3 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Treatment</th>
                  <th className="px-6 py-3 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-right">Total Est.</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 text-[13px] font-bold text-blue-600">{o.id}</td>
                    <td className="px-6 py-4 text-[13.5px] font-semibold text-slate-900">{o.patient}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-600">{o.treatment}</td>
                    <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-4 text-[13.5px] font-bold text-slate-800 text-right">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}