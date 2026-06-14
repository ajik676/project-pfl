import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { supabase } from "../data/supabaseClient";
import { 
  HiSearch, 
  HiBell, 
  HiChevronDown,
  HiOutlineUser, 
  HiOutlineLogout,
  HiOutlineAdjustments,
  HiPlus,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiUserAdd
} from "react-icons/hi";

export default function Header() {
  const navigate = useNavigate();
  
  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ patients: [], doctors: [], transactions: [] });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Unread notification counts
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  
  const dropdownRef = useRef(null);
  const quickActionRef = useRef(null);
  const notifRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Time-based greeting with matching icon
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return { text: "Good Morning", icon: "☀️" };
    if (hrs < 15) return { text: "Good Afternoon", icon: "🌤️" };
    if (hrs < 18) return { text: "Good Afternoon", icon: "🌤️" };
    return { text: "Good Evening", icon: "🌙" };
  };

  const greeting = getGreeting();

  useEffect(() => {
    // Load notifications from db
    setUnreadNotifications(db.getNotifications());

    // Click outside handler for dropdowns
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target)) {
        setIsQuickActionOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle Global Search Input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ patients: [], doctors: [], transactions: [] });
      return;
    }

    const query = searchQuery.toLowerCase();

    // Query Patients
    const patients = db.getPatients().filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.id.toLowerCase().includes(query)
    ).slice(0, 3);

    // Query Doctors
    const doctors = db.getDoctors().filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.specialty.toLowerCase().includes(query)
    ).slice(0, 3);

    // Query Transactions
    const transactions = db.getTransactions().filter(t => 
      t.id.toLowerCase().includes(query) || 
      t.patientName.toLowerCase().includes(query)
    ).slice(0, 3);

    setSearchResults({ patients, doctors, transactions });
  }, [searchQuery]);

  const user = JSON.parse(localStorage.getItem("user")) || { name: "drg. Rafi", email: "admin@smiledental.com", role: "Admin" };

  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    alert("Berhasil keluar dari sistem.");
    navigate("/login");
  };

  const totalUnreadCount = unreadNotifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    unreadNotifications.forEach(n => db.markNotificationRead(n.id));
    setUnreadNotifications(db.getNotifications());
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-[80px] bg-white border-b border-slate-200/80 shadow-sm/5 font-sans">
      
      {/* HEADER KIRI: Greeting, App name, Description */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 leading-none">
          <span>{greeting.icon}</span>
          <span className="text-slate-500 font-semibold">{greeting.text},</span>
          <span className="text-blue-600 font-extrabold">{user.name}</span>
        </div>
        <h2 className="text-sm font-black text-slate-900 mt-1 leading-none">
          SmileDental CRM Platform
        </h2>
        <p className="text-[10px] text-slate-400 font-semibold mt-1">
          Manage your clinic efficiently
        </p>
      </div>

      {/* HEADER TENGAH: Global Search */}
      <div className="relative w-full max-w-sm hidden md:block" ref={searchContainerRef}>
        <div className="relative">
          <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search patients, doctors, transactions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-150 rounded-2xl shadow-xl z-55 max-h-[360px] overflow-y-auto p-3.5 space-y-3 font-semibold text-xs text-slate-700">
            {searchResults.patients.length === 0 && searchResults.doctors.length === 0 && searchResults.transactions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-[11px]">Tidak ada hasil untuk "{searchQuery}"</div>
            ) : (
              <>
                {/* Patients results */}
                {searchResults.patients.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Pasien</p>
                    <div className="space-y-0.5">
                      {searchResults.patients.map(p => (
                        <div 
                          key={p.id}
                          onClick={() => {
                            navigate(`/patients/${p.id}`);
                            setIsSearchFocused(false);
                            setSearchQuery("");
                          }}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50/50 cursor-pointer flex items-center justify-between"
                        >
                          <span className="font-bold">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{p.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctors results */}
                {searchResults.doctors.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Dokter</p>
                    <div className="space-y-0.5">
                      {searchResults.doctors.map(d => (
                        <div 
                          key={d.id}
                          onClick={() => {
                            navigate("/doctors");
                            setIsSearchFocused(false);
                            setSearchQuery("");
                          }}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50/50 cursor-pointer flex items-center justify-between"
                        >
                          <span className="font-bold">{d.name}</span>
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{d.specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transactions results */}
                {searchResults.transactions.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Transaksi</p>
                    <div className="space-y-0.5">
                      {searchResults.transactions.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => {
                            navigate(`/transactions/${t.id}`);
                            setIsSearchFocused(false);
                            setSearchQuery("");
                          }}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50/50 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold block text-blue-600">{t.id}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{t.patientName}</span>
                          </div>
                          <span className="font-extrabold text-slate-900">Rp {t.amount.toLocaleString("id-ID")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* HEADER KANAN: Quick Actions, Notification, Profile */}
      <div className="flex items-center gap-3">

        {/* 1. Quick Actions Menu Dropdown */}
        <div className="relative" ref={quickActionRef}>
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
          >
            <HiPlus className="text-sm stroke-[3]" />
            Quick Action
            <HiChevronDown className="text-sm ml-0.5" />
          </button>

          {isQuickActionOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-150 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-semibold text-slate-600">
              <button 
                onClick={() => { setIsQuickActionOpen(false); navigate("/patients/add"); }}
                className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <HiUserAdd className="text-base text-slate-400" />
                Pasien Baru
              </button>
              <button 
                onClick={() => { setIsQuickActionOpen(false); navigate("/schedule/add"); }}
                className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <HiOutlineCalendar className="text-base text-slate-400" />
                Appointment Baru
              </button>
              <button 
                onClick={() => { setIsQuickActionOpen(false); navigate("/transactions"); }}
                className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <HiOutlineCreditCard className="text-base text-slate-400" />
                Transaksi Baru
              </button>
            </div>
          )}
        </div>

        {/* Divider line */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* 2. Notification Center */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 border border-transparent hover:border-slate-100 transition-all"
          >
            <HiBell className="text-xl" />
            {totalUnreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-150 rounded-2xl shadow-xl py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-black text-slate-800">Pusat Notifikasi</span>
                {totalUnreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-[240px] overflow-y-auto scrollbar-thin py-1 text-xs text-slate-500 font-semibold">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        db.markNotificationRead(n.id);
                        setUnreadNotifications(db.getNotifications());
                        setIsNotificationsOpen(false);
                        navigate(`/notifications/${n.id}`);
                      }}
                      className={`p-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-2 ${
                        !n.isRead ? "bg-blue-50/15" : ""
                      }`}
                    >
                      <span className="text-base mt-0.5">🔔</span>
                      <div className="flex-1 space-y-0.5">
                        <p className="font-bold text-slate-700 leading-tight flex items-center justify-between">
                          {n.title}
                          {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-snug">{n.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 text-[11px]">Tidak ada notifikasi</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full hover:bg-slate-50 border border-slate-100/60 transition-all active:scale-[0.98]"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm border border-blue-400/20">
              {getInitials(user.name)}
            </div>
            <div className="hidden sm:block text-left text-xs leading-none">
              <span className="block font-extrabold text-slate-700 mb-0.5">
                {user.name}
              </span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-150 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-semibold text-slate-600">
              <div className="px-4 py-2 border-b border-slate-50">
                <span className="block font-bold text-slate-700">{user.name}</span>
                <span className="block text-[9px] text-slate-400 uppercase font-semibold">{user.role}</span>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button 
                  onClick={() => { setIsProfileOpen(false); navigate("/settings"); }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <HiOutlineUser className="text-base text-slate-400" />
                  Staff Management
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); navigate("/settings"); }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <HiOutlineAdjustments className="text-base text-slate-400" />
                  Pengaturan Platform
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