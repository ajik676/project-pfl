import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { 
  HiOutlineViewGrid, 
  HiOutlineUsers, 
  HiOutlineCalendar, 
  HiOutlineCreditCard, 
  HiOutlineBadgeCheck, 
  HiOutlineClipboardList, 
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineExclamation,
  HiOutlineLockClosed,
  HiOutlineBan
} from "react-icons/hi";

// Brand Logo Icon
const ToothLogo = () => (
  <svg fill="currentColor" viewBox="0 0 64 80" className="w-5 h-5 text-white">
    <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
  </svg>
);

export default function Sidebar() {
  const navigate = useNavigate();
  
  const patientCount = db.getPatients().length;
  const scheduleCount = db.getSchedules().filter(s => s.status === "Menunggu").length;
  const unreadNotifCount = db.getNotifications().filter(n => !n.isRead).length;

  return (
    <aside className="w-64 h-screen flex flex-col justify-between p-5 bg-white border-r border-slate-100 text-slate-500 font-sans z-40">
      
      {/* Brand & Active System Indicator */}
      <div className="space-y-4">
        
        {/* Customized Brand Card Header */}
        <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <ToothLogo />
            </div>
            <div>
              <p className="text-base font-extrabold tracking-tight text-slate-800 leading-none">
                Smile<span className="text-blue-600 italic font-medium">Dental</span>
              </p>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md tracking-wider uppercase mt-1.5 inline-block">
                CRM Platform
              </span>
            </div>
          </div>

          {/* Active status pulse badge */}
          <div className="flex items-center gap-2 mt-3.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full w-fit">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
              Server Online
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-6 pt-2">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Menu Utama
            </p>
            <nav className="space-y-0.5">
              <NavItem to="/" end icon={HiOutlineViewGrid} label="Dashboard" badge="New" />
              <NavItem to="/patients" icon={HiOutlineUsers} label="Pasien" badge={patientCount > 0 ? patientCount.toString() : null} />
              <NavItem to="/schedule" icon={HiOutlineCalendar} label="Jadwal" badge={scheduleCount > 0 ? scheduleCount.toString() : null} />
              <NavItem to="/transactions" icon={HiOutlineCreditCard} label="Transaksi" />
              <NavItem to="/memberships" icon={HiOutlineBadgeCheck} label="Membership" />
              <NavItem to="/dental-records" icon={HiOutlineClipboardList} label="Rekam Medis" />
              <NavItem to="/notifications" icon={HiOutlineBell} label="Notifikasi" badge={unreadNotifCount > 0 ? unreadNotifCount.toString() : null} />
            </nav>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Status Sistem
            </p>
            <nav className="space-y-0.5 text-xs">
              <StatusItem to="/400" icon={HiOutlineExclamation} label="Bad Request" code="400" dotColor="bg-amber-400" />
              <StatusItem to="/401" icon={HiOutlineLockClosed} label="Unauthorized" code="401" dotColor="bg-blue-400" />
              <StatusItem to="/403" icon={HiOutlineBan} label="Forbidden" code="403" dotColor="bg-rose-400" />
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom CTA Card & Footer */}
      <div className="space-y-4">
        {/* Soft Blue CTA Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/50 rounded-2xl p-4 shadow-inner">
          <p className="text-[11.5px] leading-relaxed text-slate-600 font-semibold mb-3">
            Butuh menjadwalkan konsultasi pasien baru hari ini?
          </p>
          <button
            onClick={() => navigate("/schedule/add")}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
          >
            <HiOutlinePlus className="text-sm stroke-[3]" />
            Tambah Jadwal
          </button>
        </div>

        {/* Footer */}
        <div className="px-1 text-[10px] text-slate-400 font-bold">
          <p className="hover:text-slate-500 transition-colors">SmileDental CRM v1.0</p>
          <p className="mt-0.5 opacity-60">© 2026 All Rights Reserved</p>
        </div>
      </div>

    </aside>
  );
}

// NavItem Component with premium Light state styles
function NavItem({ to, end, icon: Icon, label, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-150
        ${isActive 
          ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100/20" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
        }
      `}
    >
      {({ isActive }) => (
        <>
          <Icon className={`text-base ${isActive ? "text-blue-600" : "text-slate-400"}`} />
          <span className="flex-1">{label}</span>
          {badge && (
            <span className={`
              text-[9px] font-black px-2 py-0.5 rounded-full
              ${isActive ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-500 border border-slate-200/50"}
            `}>
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

// StatusItem Component
function StatusItem({ to, icon: Icon, label, code, dotColor }) {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all font-semibold"
    >
      <Icon className="text-base text-slate-400" />
      <span className="flex-1 text-[11px]">{label}</span>
      <span className="text-[10px] text-slate-400 font-bold mr-1">{code}</span>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
    </NavLink>
  );
}