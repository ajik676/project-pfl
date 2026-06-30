import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../data/db";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  HiOutlineCalendar, HiOutlineGift, HiOutlineClipboardList,
  HiOutlineStar, HiOutlineLogout, HiOutlineBadgeCheck,
  HiOutlineSparkles, HiOutlineClock, HiOutlineCheckCircle,
  HiOutlineChevronRight, HiOutlineUser, HiChevronLeft, HiChevronRight
} from "react-icons/hi";

// ─── Tooth Data ───────────────────────────────────────────────────────────────
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// ─── Helper: tier gradient ────────────────────────────────────────────────────
function getTierStyle(tier) {
  switch (tier) {
    case "Platinum":
      return { card: "from-slate-900 via-indigo-950 to-slate-900", badge: "bg-indigo-100 text-indigo-700", glow: "shadow-indigo-200" };
    case "Gold":
      return { card: "from-yellow-500 via-amber-400 to-yellow-600", badge: "bg-yellow-100 text-yellow-700", glow: "shadow-yellow-200" };
    case "Silver":
      return { card: "from-zinc-400 via-slate-300 to-zinc-400", badge: "bg-zinc-100 text-zinc-600", glow: "shadow-zinc-200" };
    default:
      return { card: "from-amber-700 via-orange-600 to-amber-800", badge: "bg-amber-100 text-amber-700", glow: "shadow-amber-200" };
  }
}

// ─── Tier Progress ────────────────────────────────────────────────────────────
function getTierProgress(bal) {
  if (bal >= 2000) return { pct: 100, next: "Platinum — Level Tertinggi", color: "from-indigo-500 to-purple-500" };
  if (bal >= 1000) return { pct: ((bal - 1000) / 1000) * 100, next: `${2000 - bal} poin lagi menuju Platinum`, color: "from-indigo-400 to-purple-400" };
  if (bal >= 500)  return { pct: ((bal - 500) / 500) * 100, next: `${1000 - bal} poin lagi menuju Gold`, color: "from-yellow-400 to-amber-400" };
  return { pct: (bal / 500) * 100, next: `${500 - bal} poin lagi menuju Silver`, color: "from-blue-400 to-cyan-400" };
}

// ─── Smile Meter Data ─────────────────────────────────────────────────────────
const SMILE_OPTIONS = [
  { key: "sakit",  emoji: "😭", label: "Gigi Ngilu",   color: "border-red-300 bg-red-50 text-red-700",
    tip: "Segera konsultasikan ke dokter spesialis! Rasa ngilu menandakan kemungkinan karies dalam atau pulpitis yang butuh penanganan cepat." },
  { key: "biasa",  emoji: "😕", label: "Kurang Putih", color: "border-amber-300 bg-amber-50 text-amber-700",
    tip: "Karang gigi dan noda bisa membuat senyum kurang percaya diri. Tukarkan poin Anda untuk Scaling atau Bleaching!" },
  { key: "sehat",  emoji: "😊", label: "Gigi Sehat",   color: "border-green-300 bg-green-50 text-green-700",
    tip: "Pertahankan! Lakukan pemeriksaan rutin minimal 6 bulan sekali untuk menjaga kondisi gigi tetap prima." },
  { key: "ceria",  emoji: "😁", label: "Senyum Ceria", color: "border-blue-300 bg-blue-50 text-blue-700",
    tip: "Sempurna! Senyum Anda adalah aset terbaik. Pertimbangkan Laser Bleaching untuk kilau senyum yang makin memukau." }
];

// ═══════════════════════════════════════════════════════════════════════════════
export default function MemberDashboard() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [currentUser,   setCurrentUser]   = useState(null);
  const [patient,       setPatient]       = useState(null);
  const [loyalty,       setLoyalty]       = useState(null);
  const [activeTab,     setActiveTab]     = useState("overview");
  const [toast,         setToast]         = useState("");
  const [smileKey,      setSmileKey]      = useState("sehat");
  const [selectedTooth, setSelectedTooth] = useState(null);

  // Booking form
  const [services,   setServices]   = useState([]);
  const [doctors,    setDoctors]    = useState([]);
  const [mySchedules,setMySchedules]= useState([]);
  const [svc,        setSvc]        = useState("");
  const [doc,        setDoc]        = useState("");
  const [bDate,      setBDate]      = useState("");
  const [bTime,      setBTime]      = useState("");
  const [bNote,      setBNote]      = useState("");
  const [bookOk,     setBookOk]     = useState(false);

  // Loyalty
  const [vouchers,     setVouchers]     = useState([]);
  const [redemptions,  setRedemptions]  = useState([]);

  // Review form
  const [fRating,  setFRating]  = useState(5);
  const [fDoctor,  setFDoctor]  = useState("");
  const [fComment, setFComment] = useState("");
  const [fType,    setFType]    = useState("Pujian");
  const [fOk,      setFOk]      = useState(false);

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { navigate("/login"); return; }
    const user = JSON.parse(raw);
    setCurrentUser(user);

    const allPts = db.getPatients();
    let pt = allPts.find(p => p.email === user.email);
    if (!pt) {
      const nextId = "PT-" + String(allPts.length + 1).padStart(3, "0");
      pt = {
        id: nextId, name: user.name, gender: "Laki-laki", age: 25,
        phone: user.phone || "08123456789", email: user.email,
        address: "Jl. Pendaftaran Online", city: "Jakarta",
        registeredDate: new Date().toISOString().split("T")[0],
        membershipStatus: "Aktif", membershipLevel: "Bronze",
        complaint: "Registrasi Portal", status: "Aktif",
        adminNotes: "Akun via portal member.", history: [], complaints: [], feedbacks: []
      };
      db.savePatient(pt);
    }
    setPatient(pt);

    const loy = db.getLoyaltyRewards();
    let pts = loy.points.find(p => p.patientId === pt.id);
    if (!pts) {
      pts = { patientId: pt.id, patientName: pt.name, balance: 150, tier: "Bronze" };
      loy.points.push(pts);
      db.saveLoyaltyRewards(loy);
    }
    setLoyalty(pts);
    setVouchers(loy.vouchers || []);
    setRedemptions(loy.redemptions.filter(r => r.patientName === pt.name));
    setServices(db.getTreatments());
    setDoctors(db.getDoctors());
    setMySchedules(db.getSchedules().filter(s => s.patient_id === pt.id || s.patient_name === pt.name));
  }, [navigate]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 4000); };
  const logout    = () => { localStorage.removeItem("user"); navigate("/login"); };

  const redeemVoucher = (vch) => {
    if (loyalty.balance < vch.pointsRequired) {
      showToast(`❌ Poin kurang ${vch.pointsRequired - loyalty.balance} poin lagi!`); return;
    }
    const loy = db.getLoyaltyRewards();
    const idx = loy.points.findIndex(p => p.patientId === patient.id);
    if (idx < 0) return;
    loy.points[idx].balance -= vch.pointsRequired;
    const bal = loy.points[idx].balance;
    loy.points[idx].tier = bal >= 2000 ? "Platinum" : bal >= 1000 ? "Gold" : bal >= 500 ? "Silver" : "Bronze";
    const red = { id: "RDP-" + String(loy.redemptions.length + 1).padStart(3, "0"),
      patientName: patient.name, voucherName: vch.name, pointsUsed: vch.pointsRequired,
      date: new Date().toISOString().split("T")[0] };
    loy.redemptions.unshift(red);
    db.saveLoyaltyRewards(loy);
    setLoyalty(loy.points[idx]);
    setRedemptions(loy.redemptions.filter(r => r.patientName === patient.name));
    showToast(`🎉 Voucher "${vch.name}" berhasil diklaim!`);
  };

  const bookAppointment = (e) => {
    e.preventDefault();
    const all = db.getSchedules();
    const sch = {
      id: "SCH-" + String(all.length + 1).padStart(3, "0"),
      patient_id: patient.id, patient_name: patient.name,
      date: bDate, time: bTime, doctor: doc,
      complaint: `${svc}${bNote ? " — " + bNote : ""}`, status: "Menunggu"
    };
    db.saveSchedule(sch);
    db.saveNotification({
      id: "NT-" + String(db.getNotifications().length + 1).padStart(3, "0"),
      title: "Booking Online Member", description: `${patient.name} booking ${svc} tanggal ${bDate}.`,
      type: "Jadwal", date: new Date().toISOString().split("T")[0], isRead: false
    });
    setSvc(""); setDoc(""); setBDate(""); setBTime(""); setBNote("");
    setMySchedules(db.getSchedules().filter(s => s.patient_id === patient.id || s.patient_name === patient.name));
    setBookOk(true); setTimeout(() => setBookOk(false), 5000);
    showToast("📅 Reservasi berhasil dikirim ke klinik!");
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    if (!fComment.trim()) return;
    db.saveFeedback({
      id: "FB-" + String(db.getFeedbacks().length + 1).padStart(3, "0"),
      patientName: patient.name, rating: fRating, doctorName: fDoctor || "Umum",
      comment: fComment, date: new Date().toISOString().split("T")[0],
      type: fType, status: "Selesai"
    });
    const loy = db.getLoyaltyRewards();
    const idx = loy.points.findIndex(p => p.patientId === patient.id);
    if (idx >= 0) { loy.points[idx].balance += 50; db.saveLoyaltyRewards(loy); setLoyalty(loy.points[idx]); }
    setFComment(""); setFDoctor(""); setFRating(5); setFOk(true);
    setTimeout(() => setFOk(false), 5000);
    showToast("💖 Ulasan terkirim! +50 Poin Reward berhasil diklaim!");
  };

  // ── Loading Guard ──────────────────────────────────────────────────────────
  if (!currentUser || !patient || !loyalty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-xl shadow-green-200 animate-pulse">
          <svg viewBox="0 0 64 80" fill="white" className="w-7 h-7">
            <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
          </svg>
        </div>
        <p className="text-slate-600 text-sm font-bold tracking-wide">Memuat portal member…</p>
      </div>
    );
  }

  const tierStyle = getTierStyle(loyalty.tier);
  const tierProg  = getTierProgress(loyalty.balance);
  const smile     = SMILE_OPTIONS.find(s => s.key === smileKey);

  const TABS = [
    { id: "overview", label: "Beranda",     icon: HiOutlineUser },
    { id: "booking",  label: "Reservasi",   icon: HiOutlineCalendar },
    { id: "vouchers", label: "Reward",      icon: HiOutlineGift },
    { id: "medical",  label: "Odontogram",  icon: HiOutlineClipboardList },
    { id: "feedback", label: "Ulasan",      icon: HiOutlineStar },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Poppins', 'Barlow', sans-serif" }}>

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xs">
          <HiOutlineSparkles className="text-green-400 text-lg shrink-0" />
          {toast}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TOP NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg shadow-green-200">
              <svg viewBox="0 0 64 80" fill="white" className="w-5 h-5">
                <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
              </svg>
            </div>
            <div>
              <p className="text-base font-black text-slate-900 leading-none">
                Smile<span className="text-green-500">Dental</span>
              </p>
              <p className="text-xs font-semibold text-slate-400 leading-none mt-0.5">Portal Pasien</p>
            </div>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-800 leading-none">{currentUser.name}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{patient.id} · {loyalty.tier} Member</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-sm font-black">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border-0 cursor-pointer"
            >
              <HiOutlineLogout />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab pills */}
        <div className="max-w-6xl mx-auto px-5 pb-0 flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer border-0 bg-transparent ${
                  active
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
                }`}
              >
                <Icon className="text-base" />
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          PAGE BODY
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-5 py-8">

        {/* ════════════════════════════════════════════════════════════════════
            OVERVIEW TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">

            {/* ── Welcome Banner ── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-xl shadow-blue-200">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <p className="text-blue-100 text-sm font-semibold mb-1">Selamat datang kembali,</p>
                <h1 className="text-3xl font-black leading-tight mb-3">{currentUser.name} 👋</h1>
                <p className="text-blue-100 text-sm font-medium leading-relaxed max-w-md">
                  Pantau saldo poin loyalty, booking jadwal dokter gigi, dan tukarkan reward voucher diskon perawatan dental Anda dari sini.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => setActiveTab("booking")}
                    className="px-5 py-2.5 bg-white text-blue-600 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-0 flex items-center gap-2"
                  >
                    <HiOutlineCalendar className="text-base" /> Booking Sekarang
                  </button>
                  <button
                    onClick={() => setActiveTab("vouchers")}
                    className="px-5 py-2.5 bg-blue-700/50 text-white text-sm font-semibold rounded-xl hover:bg-blue-700/70 transition-all cursor-pointer border border-white/20 flex items-center gap-2"
                  >
                    <HiOutlineGift className="text-base" /> Tukar Reward 💎
                  </button>
                </div>
              </div>
            </div>

            {/* ── KPI Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Saldo Poin",       value: loyalty.balance + " Poin", icon: "🏆", bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200" },
                { label: "Tier Keanggotaan", value: loyalty.tier + " Member",  icon: "💎", bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200" },
                { label: "Janji Aktif",      value: mySchedules.filter(s => s.status === "Menunggu").length + " Antrean", icon: "📅", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
                { label: "Voucher Diklaim",  value: redemptions.length + " Voucher", icon: "🎟️", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" }
              ].map((kpi, i) => (
                <div key={i} className={`${kpi.bg} border ${kpi.border} rounded-2xl p-5 flex flex-col gap-2`}>
                  <span className="text-2xl">{kpi.icon}</span>
                  <p className={`text-xl font-black ${kpi.text} leading-none`}>{kpi.value}</p>
                  <p className="text-slate-600 text-xs font-semibold">{kpi.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── Digital Membership Card ── */}
              <div className="space-y-4">
                <h2 className="text-lg font-black text-slate-800">Kartu Keanggotaan Digital</h2>
                <div className={`relative bg-gradient-to-br ${tierStyle.card} rounded-3xl p-7 shadow-xl ${tierStyle.glow} overflow-hidden text-white aspect-[1.6/1] flex flex-col justify-between`}>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/8 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />

                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-white/70 text-xs font-semibold tracking-widest uppercase">SmileDental VIP</p>
                      <p className="text-white font-black text-base mt-0.5">{loyalty.tier} Member</p>
                    </div>
                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-amber-500 opacity-90" />
                  </div>

                  <div className="relative z-10">
                    <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-1">Saldo Reward</p>
                    <p className="text-4xl font-black leading-none">{loyalty.balance}<span className="text-lg font-bold ml-2 opacity-80">Poin</span></p>
                  </div>

                  <div className="flex justify-between items-end relative z-10 pt-4 border-t border-white/15">
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">Cardholder</p>
                      <p className="text-white font-black text-sm mt-0.5 uppercase">{patient.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs uppercase tracking-widest font-semibold">Patient ID</p>
                      <p className="text-white font-black text-sm mt-0.5">{patient.id}</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar to next tier */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-slate-700">Progress ke Tier Berikutnya</p>
                    <p className="text-xs font-bold text-blue-500">{Math.round(tierProg.pct)}%</p>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${tierProg.color} transition-all duration-700`}
                      style={{ width: `${tierProg.pct}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-2.5">{tierProg.next}</p>
                </div>
              </div>

              {/* ── Smile Meter + Upcoming Bookings ── */}
              <div className="space-y-4">

                {/* Smile Meter */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-800">Smile Level Meter</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Bagaimana kondisi gigi Anda hari ini?</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {SMILE_OPTIONS.map(s => (
                      <button
                        key={s.key}
                        onClick={() => setSmileKey(s.key)}
                        className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          smileKey === s.key ? s.color + " scale-105" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-2xl block">{s.emoji}</span>
                        <span className="text-xs font-bold block mt-1 leading-tight">{s.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed">💡 {smile.tip}</p>
                  </div>
                </div>

                {/* Upcoming Schedules */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-800">Janji Temu Aktif</h3>
                    <button onClick={() => setActiveTab("booking")} className="text-xs font-bold text-blue-500 flex items-center gap-1 cursor-pointer bg-transparent border-0">
                      Lihat Semua <HiOutlineChevronRight />
                    </button>
                  </div>
                  {mySchedules.filter(s => s.status === "Menunggu").length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                      <span className="text-3xl block mb-2">📭</span>
                      <p className="text-sm font-semibold text-slate-400">Belum ada jadwal aktif</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mySchedules.filter(s => s.status === "Menunggu").slice(0, 3).map(sch => (
                        <div key={sch.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shrink-0">📅</div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-snug">{sch.complaint}</p>
                              <p className="text-xs font-semibold text-slate-500">{sch.date} · {sch.time} · {sch.doctor}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full whitespace-nowrap">{sch.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            BOOKING TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "booking" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Service Catalog */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-black text-slate-800">Katalog Layanan Dental</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map(srv => (
                  <div key={srv.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">{srv.category}</span>
                      <span className="text-sm font-black text-slate-800 shrink-0">Rp {parseFloat(srv.price).toLocaleString("id-ID")}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 leading-snug">{srv.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{srv.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <HiOutlineClock className="text-slate-400" />{srv.duration || "45 Menit"}
                      </span>
                      <button
                        onClick={() => { setSvc(srv.name); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-0 cursor-pointer transition-all ${
                          svc === srv.name
                            ? "bg-green-500 text-white shadow-sm shadow-green-200"
                            : "bg-slate-100 text-slate-700 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        {svc === srv.name ? "✓ Dipilih" : "Pilih Tindakan"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24 space-y-5">
                <div>
                  <h3 className="text-base font-black text-slate-800">Form Reservasi</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Lengkapi formulir untuk booking dokter</p>
                </div>

                {bookOk && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-semibold text-green-700">
                    <HiOutlineCheckCircle className="text-xl shrink-0" />
                    Reservasi berhasil dikirim! Staf akan segera konfirmasi jadwal Anda.
                  </div>
                )}

                <form onSubmit={bookAppointment} className="space-y-4">

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tindakan Dental</label>
                    <select required value={svc} onChange={e => setSvc(e.target.value)}
                      className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors">
                      <option value="">— Pilih Layanan —</option>
                      {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Dokter Spesialis</label>
                    <select required value={doc} onChange={e => setDoc(e.target.value)}
                      className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors">
                      <option value="">— Pilih Dokter —</option>
                      {doctors.map(d => <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal</label>
                      <input type="date" required min={new Date().toISOString().split("T")[0]}
                        value={bDate} onChange={e => setBDate(e.target.value)}
                        className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Jam Antrean</label>
                      <select required value={bTime} onChange={e => setBTime(e.target.value)}
                        className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors">
                        <option value="">— Pilih Jam —</option>
                        {["09:00","10:30","13:00","14:30","16:00","19:00"].map(t => (
                          <option key={t} value={t}>{t} WIB</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Keluhan / Catatan <span className="font-normal text-slate-400">(Opsional)</span></label>
                    <textarea rows={3} value={bNote} onChange={e => setBNote(e.target.value)}
                      placeholder="Jelaskan keluhan utama Anda…"
                      className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors resize-none" />
                  </div>

                  <button type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl shadow-md shadow-blue-200 transition-all cursor-pointer border-0 active:scale-[0.99]">
                    Kirim Reservasi Pemeriksaan
                  </button>
                </form>

                {/* History list */}
                {mySchedules.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">Riwayat Reservasi</h4>
                    {mySchedules.slice(0, 4).map(sch => (
                      <div key={sch.id} className="flex items-center justify-between gap-3 text-sm">
                        <div>
                          <p className="font-bold text-slate-700 leading-snug">{sch.complaint}</p>
                          <p className="text-xs font-semibold text-slate-400">{sch.date} · {sch.time}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          sch.status === "Selesai" ? "bg-green-100 text-green-700" :
                          sch.status === "Menunggu" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>{sch.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            VOUCHERS TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "vouchers" && (
          <div className="space-y-6">

            {/* Saldo Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 flex items-center justify-between text-white shadow-lg shadow-green-200">
              <div>
                <p className="text-green-100 text-sm font-semibold">Saldo Poin Aktif</p>
                <p className="text-4xl font-black mt-1">{loyalty.balance} <span className="text-xl font-semibold text-green-200">Poin</span></p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm font-semibold">Tier Keanggotaan</p>
                <p className="text-2xl font-black mt-1">{loyalty.tier}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Voucher Catalogue */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-black text-slate-800">Katalog Voucher Reward</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vouchers.map(vch => (
                    <div key={vch.code} className="bg-white border-2 border-dashed border-slate-200 hover:border-green-300 rounded-2xl overflow-hidden transition-all">
                      <div className="p-5 space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{vch.code}</span>
                        <h3 className="text-base font-black text-slate-800">{vch.name}</h3>
                        <p className="text-sm font-semibold text-slate-500">Berlaku untuk semua metode pembayaran di kasir klinik.</p>
                      </div>

                      {/* Ticket divider */}
                      <div className="flex items-center px-0">
                        <div className="w-5 h-5 bg-slate-50 rounded-full -ml-2.5 border border-slate-200 shrink-0" />
                        <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                        <div className="w-5 h-5 bg-slate-50 rounded-full -mr-2.5 border border-slate-200 shrink-0" />
                      </div>

                      <div className="px-5 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-400">Harga Tukar</p>
                          <p className="text-xl font-black text-green-600">{vch.pointsRequired} Poin</p>
                        </div>
                        <button
                          onClick={() => redeemVoucher(vch)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all ${
                            loyalty.balance >= vch.pointsRequired
                              ? "bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-200"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {loyalty.balance >= vch.pointsRequired ? "Tukar Sekarang" : "Poin Kurang"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redemption History */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-slate-800">Riwayat Klaim Saya</h3>
                {redemptions.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                    <span className="text-3xl block mb-2">🎁</span>
                    <p className="text-sm font-semibold text-slate-400">Belum ada voucher diklaim</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {redemptions.map(r => (
                      <div key={r.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl p-3.5">
                        <div>
                          <p className="text-xs font-semibold text-slate-400">{r.date}</p>
                          <p className="text-sm font-bold text-slate-700 leading-snug mt-0.5">{r.voucherName}</p>
                        </div>
                        <span className="text-sm font-black text-red-500 shrink-0">-{r.pointsUsed}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-700 leading-relaxed">
                    💡 Tunjukkan kode voucher kepada kasir saat pembayaran untuk mendapatkan potongan harga.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ODONTOGRAM TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "medical" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Teeth Map */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-800">Odontogram Gigi Saya</h2>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Klik nomor gigi untuk melihat catatan diagnosis klinis</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-6">
                {/* Upper teeth */}
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider text-center mb-3">— Gigi Atas —</p>
                  <div className="flex justify-center flex-wrap gap-1.5">
                    {UPPER_TEETH.map(num => {
                      const isSelected = selectedTooth === num;
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedTooth(num === selectedTooth ? null : num)}
                          className={`w-9 h-10 rounded-lg text-xs font-black flex flex-col items-center justify-center gap-0.5 border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200"
                              : "border-green-300 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100"
                          }`}
                        >
                          <span className="text-[10px] font-black">{num}</span>
                          <span className="text-[7px] font-bold leading-none">OK</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-bold text-slate-400 px-2">Rahang Kiri ↔ Kanan</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Lower teeth */}
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider text-center mb-3">— Gigi Bawah —</p>
                  <div className="flex justify-center flex-wrap gap-1.5">
                    {LOWER_TEETH.map(num => {
                      const isSelected = selectedTooth === num;
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedTooth(num === selectedTooth ? null : num)}
                          className={`w-9 h-10 rounded-lg text-xs font-black flex flex-col items-center justify-center gap-0.5 border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200"
                              : "border-green-300 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100"
                          }`}
                        >
                          <span className="text-[10px] font-black">{num}</span>
                          <span className="text-[7px] font-bold leading-none">OK</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tooth info panel */}
              {selectedTooth ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-black text-slate-800">Gigi Nomor {selectedTooth}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Sehat</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                    Kondisi gigi nomor {selectedTooth} dalam keadaan baik dan sehat. Lakukan pemeriksaan rutin setiap 6 bulan sekali untuk mempertahankan kondisi ini.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-semibold text-slate-400">👆 Klik salah satu gigi di peta untuk melihat detail kondisi</p>
                </div>
              )}
            </div>

            {/* Medical History */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Riwayat Perawatan</h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Catatan tindakan medis oleh dokter klinik</p>
              </div>

              {!patient.history || patient.history.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <span className="text-4xl block mb-3">📝</span>
                  <p className="text-sm font-bold text-slate-500">Belum ada catatan rekam medis</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">Catatan akan muncul setelah Anda menjalani perawatan di klinik</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patient.history.map((h, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-black text-slate-800">{h.action}</h4>
                        <span className="text-xs font-semibold text-slate-400 shrink-0">{h.date}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">{h.doctor}</p>
                      <p className="text-sm font-semibold text-slate-600 leading-relaxed">{h.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            FEEDBACK TAB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "feedback" && (
          <div className="max-w-2xl mx-auto space-y-6">

            {/* Reward incentive banner */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white flex items-center gap-5 shadow-lg shadow-orange-200">
              <span className="text-5xl">🎁</span>
              <div>
                <h2 className="text-xl font-black">Dapatkan +50 Poin Reward!</h2>
                <p className="text-orange-100 text-sm font-semibold mt-1 leading-relaxed">
                  Tulis ulasan pelayanan Anda dan poin otomatis ditambahkan ke kartu keanggotaan digital Anda.
                </p>
              </div>
            </div>

            {/* Feedback form card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-800">Form Ulasan Pelayanan</h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Feedback Anda sangat berharga untuk peningkatan layanan klinik</p>
              </div>

              {fOk && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-semibold text-green-700">
                  <HiOutlineCheckCircle className="text-xl shrink-0" />
                  Ulasan berhasil dikirim! Saldo poin Anda bertambah +50 Poin.
                </div>
              )}

              <form onSubmit={submitFeedback} className="space-y-5">

                {/* Star rating */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tingkat Kepuasan</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFRating(s)}
                        className="cursor-pointer bg-transparent border-0 p-0 transition-transform hover:scale-110"
                      >
                        <span className={`text-3xl ${s <= fRating ? "text-amber-400" : "text-slate-300"}`}>★</span>
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-semibold text-slate-500 self-center">
                      {["", "Sangat Buruk", "Buruk", "Cukup", "Baik", "Sangat Baik"][fRating]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Dokter yang Ditangani</label>
                    <select value={fDoctor} onChange={e => setFDoctor(e.target.value)}
                      className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors">
                      <option value="">— Pilih Dokter —</option>
                      {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Kategori Ulasan</label>
                    <select value={fType} onChange={e => setFType(e.target.value)}
                      className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors">
                      <option value="Pujian">👍 Pujian</option>
                      <option value="Saran">💡 Saran</option>
                      <option value="Keluhan">📣 Keluhan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Ceritakan Pengalaman Anda</label>
                  <textarea rows={5} required value={fComment} onChange={e => setFComment(e.target.value)}
                    placeholder="Tuliskan pengalaman Anda mengenai pelayanan dokter, kebersihan klinik, atau kenyamanan antrean…"
                    className="w-full text-sm font-semibold px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-colors resize-none" />
                </div>

                <button type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3.5 rounded-xl shadow-md shadow-green-200 transition-all cursor-pointer border-0 active:scale-[0.99] flex items-center justify-center gap-2">
                  <HiOutlineStar />
                  Kirim Ulasan & Klaim 50 Poin
                </button>
              </form>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center mt-8">
        <p className="text-sm font-semibold text-slate-400">© {new Date().getFullYear()} SmileDental CRM · Portal Pasien Member</p>
      </footer>

    </div>
  );
}
