import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { 
  HiSearch, 
  HiBell, 
  HiCog, 
  HiOutlineUser, 
  HiOutlineLogout,
  HiOutlineAdjustments,
  HiOutlineBell
} from "react-icons/hi";

export default function Header() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Selamat Pagi";
    if (hrs < 15) return "Selamat Siang";
    if (hrs < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  useEffect(() => {
    // Read live notifications
    setUnreadCount(db.getNotifications().filter(n => !n.isRead).length);

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Berhasil keluar dari sistem.");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-[72px] bg-white border-b border-slate-200/80 shadow-sm/5 font-sans">
      
      {/* Dynamic Custom Welcome Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none mb-1">
          SmileDental Portal
        </p>
        <h2 className="text-sm font-bold text-slate-800">
          {getGreeting()}, <span className="text-blue-600">drg. Hirzi 👋</span>
        </h2>
      </div>

      {/* Modern Command Search Bar */}
      <div className="relative w-full max-w-sm hidden md:block group">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Cari data pasien, rekam medis... (Ctrl + K)"
          onClick={() => navigate("/patients")}
          className="w-full h-9.5 pl-10 pr-12 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-slate-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 border border-slate-200 bg-white rounded-md text-[9px] font-black text-slate-400 shadow-sm pointer-events-none uppercase tracking-wider">
          Ctrl K
        </div>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-2">

        {/* Notifications Alert Center Button */}
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 border border-transparent hover:border-slate-100 transition-all"
        >
          <HiBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
          )}
        </button>

        {/* Settings Shortcut Button */}
        <button 
          onClick={() => navigate("/403")} // Simple simulation of locked config
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 border border-transparent hover:border-slate-100 transition-all"
        >
          <HiCog className="text-xl" />
        </button>

        {/* Divider line */}
        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        {/* Dynamic User Profile Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full hover:bg-slate-50 border border-slate-100/60 transition-all active:scale-[0.98]"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm border border-blue-400/20">
              RF
            </div>
            <div className="hidden sm:block text-left text-xs leading-none">
              <span className="block font-extrabold text-slate-700 mb-0.5">
                drg. Muhammad Hirzi
              </span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Dokter Utama
              </span>
            </div>
          </button>

          {/* User Profile Menu Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-150 rounded-2xl shadow-xl shadow-slate-200/40 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-semibold text-slate-600">
              
              <div className="px-4 py-2 border-b border-slate-50 sm:hidden">
                <span className="block font-bold text-slate-700">drg. Muhammad Hirzi</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Dokter Utama</span>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button 
                  onClick={() => { setIsProfileOpen(false); navigate("/patients/PT-001"); }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <HiOutlineUser className="text-base text-slate-400" />
                  Profil Pasien Demo
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); navigate("/403"); }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <HiOutlineAdjustments className="text-base text-slate-400" />
                  Pengaturan
                </button>
              </div>
              
              <div className="h-px bg-slate-100 my-1 mx-2"></div>
              
              <div className="p-1.5">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <HiOutlineLogout className="text-base" />
                  Keluar / Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}