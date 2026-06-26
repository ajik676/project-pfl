import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Rating } from "../components/ui/Rating";
import { Accordion, AccordionItem } from "../components/ui/Accordion";
import { 
  AreaChart, Area, 
  XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { 
  HiOutlineUserGroup, 
  HiOutlineGift, 
  HiOutlineBadgeCheck, 
  HiOutlineChatAlt, 
  HiOutlineHeart, 
  HiArrowRight, 
  HiCheckCircle, 
  HiSearch, 
  HiOutlineLightningBolt,
  HiOutlineDatabase,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineGlobe,
  HiOutlineDeviceMobile,
  HiOutlineOfficeBuilding,
  HiOutlineAdjustments,
  HiOutlineMailOpen,
  HiChevronDown,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineClock,
  HiCheck,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineTrendingUp
} from "react-icons/hi";

// Mock datasets for chart toggle
const metricData = {
  pendapatan: [
    { week: "Minggu 1", value: 12500000 },
    { week: "Minggu 2", value: 18900000 },
    { week: "Minggu 3", value: 22400000 },
    { week: "Minggu 4", value: 31500000 },
  ],
  pasien: [
    { week: "Minggu 1", value: 85 },
    { week: "Minggu 2", value: 110 },
    { week: "Minggu 3", value: 145 },
    { week: "Minggu 4", value: 190 },
  ],
  retensi: [
    { week: "Minggu 1", value: 72 },
    { week: "Minggu 2", value: 78 },
    { week: "Minggu 3", value: 83 },
    { week: "Minggu 4", value: 92 },
  ]
};

// Wave dividers components for organic layout
const WaveTop = ({ className = "text-slate-100/60 bg-white" }) => (
  <div className={`w-full overflow-hidden leading-none rotate-180 ${className}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] fill-current">
      <path d="M353.9,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,90.13,26.49,173.15,47,252.12,65.25,321.39,56.44Z"></path>
    </svg>
  </div>
);

const WaveBottom = ({ className = "text-slate-100/60 bg-white" }) => (
  <div className={`w-full overflow-hidden leading-none ${className}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] fill-current">
      <path d="M353.9,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,90.13,26.49,173.15,47,252.12,65.25,321.39,56.44Z"></path>
    </svg>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();

  // Point Checker states
  const [searchQuery, setSearchQuery] = useState("");
  const [patientPointsData, setPatientPointsData] = useState(null);
  const [searchError, setSearchError] = useState("");

  // Points Calculator states
  const [billAmount, setBillAmount] = useState("");
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  // FAQ state
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  // Active CRM Workflow Step
  const [activeStep, setActiveStep] = useState(0);

  // Live database counts & catalogs
  const [totalPatients, setTotalPatients] = useState(15);
  const [totalFeedbacks, setTotalFeedbacks] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  // Active Tab for CRM Showcases
  const [activeCrmTab, setActiveCrmTab] = useState("operational");

  // Operational CRM states
  const [selectedPatientId, setSelectedPatientId] = useState("PT-001");
  const [patientDetailData, setPatientDetailData] = useState(null);
  const [selectedTooth, setSelectedTooth] = useState(null);

  // Analytical CRM states
  const [selectedMetric, setSelectedMetric] = useState("pendapatan");

  // Strategic CRM states (WhatsApp simulator)
  const [waTemplate, setWaTemplate] = useState("reminder");
  const [waTargetName, setWaTargetName] = useState("Andi Saputra");
  const [waTargetPhone, setWaTargetPhone] = useState("08123456789");
  
  // Membership Perks states
  const [selectedPerkTier, setSelectedPerkTier] = useState("Gold");
  const [redeemToast, setRedeemToast] = useState("");

  // Smile Level Checker state
  const [smileStatus, setSmileStatus] = useState("sehat");

  useEffect(() => {
    // Load live counts from db.js
    const pts = db.getPatients();
    setTotalPatients(pts.length);
    setTotalFeedbacks(db.getFeedbacks().slice(0, 3));
    setVouchers(db.getLoyaltyRewards().vouchers || []);

    // Set initial patient detail
    const firstPatient = pts.find(item => item.id === "PT-001");
    if (firstPatient) {
      setPatientDetailData(firstPatient);
    }
  }, []);

  // Handle Patient select in Operational CRM
  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    const p = db.getPatients().find(item => item.id === id);
    if (p) {
      setPatientDetailData(p);
      setSelectedTooth(null); // reset selected tooth
      // update WA target details
      setWaTargetName(p.name);
      setWaTargetPhone(p.phone);
    }
  };

  // get tooth status from patient details
  const getToothStatus = (toothNumber) => {
    if (!patientDetailData) return null;
    
    // Check specific conditions mapping from db.js
    if (patientDetailData.id === "PT-002" && toothNumber === 38) {
      return { status: "Impaksi", color: "bg-merah hover:bg-merah/90 text-white border-merah/30", desc: "Impaksi molar 3 bawah miring (Odontektomi)." };
    }
    if (patientDetailData.id === "PT-004" && toothNumber === 21) {
      return { status: "Karies", color: "bg-kuning hover:bg-kuning/90 text-white border-kuning/30", desc: "Karies gigi depan atas 21 (Tambalan resin)." };
    }
    if (patientDetailData.id === "PT-007" && toothNumber === 46) {
      return { status: "Pulpitis", color: "bg-red-650 hover:bg-red-750 text-white border-red-700/30", desc: "Pulpitis Irreversible (Perawatan Saluran Akar)." };
    }
    if (patientDetailData.id === "PT-001" && [31, 32, 41, 42].includes(toothNumber)) {
      return { status: "Kalkulus", color: "bg-amber-500 hover:bg-amber-600 text-white border-amber-600/30", desc: "Kalkulus berat (Perlu scaling)." };
    }
    
    return { status: "Sehat", color: "bg-hijau hover:bg-hijau/90 text-white border-hijau/30", desc: "Gigi sehat terawat." };
  };

  // Handle Point Checking
  const handleCheckPoints = (e) => {
    e.preventDefault();
    setSearchError("");
    setPatientPointsData(null);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError("Silakan masukkan ID Pasien atau Nomor Telepon.");
      return;
    }

    const patient = db.getPatients().find(
      (p) => p.id.toLowerCase() === query || p.phone === query
    );

    if (patient) {
      const loyalty = db.getLoyaltyRewards();
      const pointsObj = loyalty.points.find((p) => p.patientId === patient.id);
      setPatientPointsData({
        name: patient.name,
        id: patient.id,
        level: patient.membershipLevel,
        balance: pointsObj?.balance || 0,
        city: patient.city
      });
    } else {
      setSearchError("ID Pasien / Nomor Telepon tidak terdaftar di sistem. Gunakan data dummy 'PT-001' atau '08123456789' untuk simulasi.");
    }
  };

  // Handle Points Calculator
  const handleCalculate = (e) => {
    e.preventDefault();
    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) {
      setCalculatedPoints(0);
      return;
    }
    setCalculatedPoints(Math.floor(amount / 10000)); // 1 Point per Rp 10.000
  };

  // Simulate Points Redemption
  const handleSimulateRedeem = (patientName, voucherName, pointsNeeded) => {
    setRedeemToast(`🎉 Sukses! ${patientName} berhasil menukarkan ${pointsNeeded} Poin untuk voucher: "${voucherName}". Saldo poin diperbarui di CRM.`);
    setTimeout(() => {
      setRedeemToast("");
    }, 5000);
  };

  // Scroll smoothly to target ID
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // WhatsApp Simulated message builder
  const getWaSimulatedMessage = () => {
    if (waTemplate === "reminder") {
      return `Halo *${waTargetName}*! 🦷\n\nKami dari *SmileDental Clinic* ingin mengingatkan jadwal konsultasi gigi Anda besok:\n📅 Tanggal: Besok\n🕒 Jam: 10:30 WIB\n🩺 Dokter: drg. Rina Amelia Sp.KG\n\nMohon konfirmasi kedatangan Anda dengan membalas pesan ini (YA / TIDAK). Kumpulkan poin loyalitas Anda setiap kontrol gigi! ✨`;
    }
    if (waTemplate === "promo") {
      return `Selamat *${waTargetName}*! 🎉\n\nAnda telah naik kelas menjadi *${patientDetailData?.membershipLevel || "Gold"} Member* di SmileDental!\n\nSebagai member setia, Anda berhak mendapatkan voucher potongan harga: *Gratis Bleaching Gigi* senilai Rp 1.500.000. Cek saldo poin Anda di link: smiledental.com/points. 💎`;
    }
    return `Halo *${waTargetName}*! 🙏\n\nTerima kasih telah melakukan perawatan gigi di SmileDental Clinic hari ini. Bagaimana pengalaman Anda dengan *drg. Rina Amelia Sp.KG*?\n\nBerikan rating bintang & review Anda di: smiledental.com/review?id=${selectedPatientId} untuk mendapatkan tambahan *50 Poin Reward*! ⭐`;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-barlow text-slate-800 antialiased selection:bg-hijau/20 selection:text-slate-900 overflow-x-hidden">
      
      {/* TOAST NOTIFICATION REDEMPTION SIMULATOR */}
      {redeemToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm glassmorphism bg-white border border-hijau/20 text-slate-800 px-5 py-4 rounded-2xl shadow-xl flex items-start gap-3 animate-bounce">
          <span className="text-xl">💎</span>
          <div>
            <p className="text-xs font-bold font-poppins text-slate-900 uppercase tracking-wide leading-none">Notifikasi CRM</p>
            <p className="text-[11px] font-semibold text-slate-550 mt-1 leading-normal">{redeemToast}</p>
          </div>
        </div>
      )}

      {/* STICKY GLASSMORPHISM NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-biru via-hijau/80 to-hijau text-white flex items-center justify-center shadow-lg shadow-hijau/20 animate-float-slow">
            <svg viewBox="0 0 64 80" fill="white" className="w-5.5 h-5.5">
              <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">
              Smile<span className="text-hijau font-black">Dental</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mt-1 leading-none">
              CRM SaaS Platform
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-black uppercase tracking-wider text-slate-400">
          <button onClick={() => scrollTo("problem")} className="hover:text-hijau transition-colors cursor-pointer">Masalah Klinik</button>
          <button onClick={() => scrollTo("alur")} className="hover:text-hijau transition-colors cursor-pointer">Workflow CRM</button>
          <button onClick={() => scrollTo("demo")} className="hover:text-hijau transition-colors cursor-pointer text-hijau">Live Demo</button>
          <button onClick={() => scrollTo("fitur")} className="hover:text-hijau transition-colors cursor-pointer">Fitur CRM</button>
          <button onClick={() => scrollTo("integrasi")} className="hover:text-hijau transition-colors cursor-pointer">Integrasi</button>
          <button onClick={() => scrollTo("faq")} className="hover:text-hijau transition-colors cursor-pointer">FAQ</button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs font-extrabold border-slate-200 hover:bg-slate-100/50 text-slate-650 rounded-xl cursor-pointer">
              Masuk Portal
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="text-xs font-black bg-gradient-to-r from-biru to-hijau hover:from-biru/90 hover:to-hijau/90 text-white shadow-md shadow-hijau/20 cursor-pointer rounded-xl px-4 py-2 hover:scale-105 active:scale-95 transition-all">
              Coba Gratis 14 Hari
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION WITH VIBRANT CHEERFUL GRADIENTS */}
      <section className="relative overflow-hidden bg-gradient-to-br from-biru/10 via-slate-50/30 to-hijau/10 py-20 px-6 lg:py-28">
        
        {/* Glow Spheres */}
        <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-hijau/15 to-biru/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-pink-400/5 to-hijau/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Copywriting */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <Badge className="bg-hijau/10 text-hijau border-0 hover:bg-hijau/20 px-4 py-1.5 font-black tracking-widest text-[9px] uppercase rounded-full">
              🚀 #1 SaaS Dental CRM Platform di Indonesia
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight font-poppins">
              Senyum Pasien Ceria, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-biru via-hijau/90 to-hijau">
                Omset Klinik Melejit!
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              SmileDental CRM memadukan kemudahan operasional klinik gigi (Appointment, Jadwal Shift, Rekam Medis) dengan strategi loyalitas pasien modern (Membership, Loyalty Poin, WhatsApp Reminders) dalam satu platform yang super ceria!
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link to="/register">
                <Button size="lg" className="flex items-center gap-2 font-black shadow-lg shadow-hijau/20 bg-gradient-to-r from-biru to-hijau hover:from-biru/90 hover:to-hijau/90 hover:scale-105 active:scale-95 transition-all rounded-2xl cursor-pointer">
                  Mulai Free Trial <HiOutlineSparkles className="text-base animate-pulse" />
                </Button>
              </Link>
              <button onClick={() => scrollTo("demo")} className="cursor-pointer">
                <Button variant="outline" size="lg" className="font-extrabold border-slate-200 text-slate-700 bg-white/70 hover:bg-slate-50 shadow-sm rounded-2xl">
                  Lihat Demo Interaktif
                </Button>
              </button>
            </div>
          </div>

          {/* Hero Illustration / Dashboard Floating Cards */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[460px] aspect-square rounded-[42px] bg-gradient-to-tr from-biru/20 to-hijau/20 p-6 shadow-inner border border-white/60">
              
              {/* Central Premium Card */}
              <div className="bg-white/95 backdrop-blur p-6 rounded-[32px] shadow-2xl border border-slate-100 space-y-4 hover:translate-y-[-6px] transition-transform duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-hijau bg-hijau/10 px-3 py-1 rounded-full tracking-wider uppercase">Live Activity</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-hijau animate-ping" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base leading-tight font-poppins">drg. Rina Amelia Sp.KG</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">Resepsionis sedang melayani pendaftaran antrean dan rekam medis pasien.</p>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-biru to-hijau h-full rounded-full animate-pulse" style={{ width: "75%" }} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>9 dari 12 Slot Selesai</span>
                  <span className="text-hijau">75% Produktif</span>
                </div>
              </div>

              {/* Floating Element 1 - Loyalty */}
              <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-lg border border-white/40 flex items-center gap-3 animate-float-slow">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl">🎁</div>
                <div>
                  <h5 className="text-xs font-black text-slate-850 leading-none font-poppins">Loyalty Redeemed</h5>
                  <span className="text-[10px] text-hijau font-bold mt-1.5 block">Voucher Scaling 50%</span>
                </div>
              </div>

              {/* Floating Element 2 - Satisfaction */}
              <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-lg border border-white/40 flex items-center gap-3 animate-float-fast">
                <div className="w-10 h-10 rounded-xl bg-hijau/10 flex items-center justify-center text-xl">⭐</div>
                <div>
                  <h5 className="text-xs font-black text-slate-850 leading-none font-poppins">Kepuasan Pasien</h5>
                  <span className="text-[10px] text-hijau font-bold mt-1.5 block">NPS Score 4.9 / 5.0</span>
                </div>
              </div>

              {/* Floating Element 3 - WhatsApp Notification */}
              <div className="absolute bottom-1/3 -left-8 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-3 rounded-2xl shadow-md flex items-center gap-2 max-w-[190px] border border-white/10 text-[10px] font-extrabold animate-pulse">
                <HiOutlineChatAlt className="text-base shrink-0" />
                <span>WhatsApp reminder terkirim otomatis!</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* WAVE DIVIDER TRANSITION INTO WHITE */}
      <WaveBottom className="text-biru/10 bg-white" />

      {/* TRUSTED BY / SOCIAL PROOF BRAND LOGOS */}
      <section className="bg-white py-10 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telah dipercaya oleh jaringan klinik gigi terkemuka</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-sm font-black text-slate-700 tracking-tight font-serif">🦷 DentCare Group</span>
            <span className="text-sm font-black text-slate-700 tracking-tight">✨ Smile Center</span>
            <span className="text-sm font-black text-slate-700 tracking-tight">🏢 Jakarta Dental Clinic</span>
            <span className="text-sm font-black text-slate-700 tracking-tight font-mono">PK-DENTAL</span>
            <span className="text-sm font-black text-slate-700 tracking-tight">👄 Oral Care Indonesia</span>
          </div>
        </div>
      </section>

      {/* STATISTICS CARDS WITH COUNTER LAYOUT */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: "Pasien Terdaftar", value: "10,000+", desc: "Rekam medis digital aman" },
          { title: "Klinik Aktif", value: "500+", desc: "Menggunakan CRM" },
          { title: "Janji Temu Sukses", value: "50,000+", desc: "Antrean lancar teratur" },
          { title: "Rating Kepuasan", value: "4.9/5.0", desc: "Ulasan bintang riil" }
        ].map((s, idx) => (
          <div key={idx} className="bg-white/90 border border-slate-200/50 p-6 rounded-3xl text-center space-y-1.5 shadow-sm hover:-translate-y-1.5 hover:shadow-md transition-all duration-300">
            <span className="block text-3xl font-black text-hijau tracking-tight font-poppins">{s.value}</span>
            <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-wider leading-tight font-poppins">{s.title}</h5>
            <p className="text-[10px] text-slate-400 font-semibold">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* WAVE DIVIDER TRANSITION TO LIGHT GRAY */}
      <WaveTop className="text-slate-100/60 bg-white" />

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-16 px-6 bg-slate-100/60">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <Badge className="bg-merah/10 text-merah hover:bg-merah/25 border-0 px-3 py-1 font-extrabold rounded-full">Kondisi Saat Ini</Badge>
            <h2 className="text-3xl font-black text-slate-900 font-poppins">Masalah Klasik Manajemen Klinik Gigi</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tanpa sistem CRM terpadu, klinik gigi Anda rentan mengalami inefisiensi bisnis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Owner Pain Point */}
            <Card className="rounded-[28px] border-slate-200 bg-white hover:shadow-md transition-all p-6 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-merah/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-125 transition-transform" />
              <span className="text-4xl block">👤</span>
              <h4 className="font-black text-slate-800 text-sm font-poppins uppercase tracking-wide">Owner Klinik: Omset Bocor & Buta Data</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Sulit memantau performa harian secara real-time. Tidak tahu berapa pasien lama yang kembali kontrol, serta kesulitan menghitung laba bersih bulanan secara akurat.
              </p>
            </Card>

            {/* Dentist Pain Point */}
            <Card className="rounded-[28px] border-slate-200 bg-white hover:shadow-md transition-all p-6 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-merah/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-125 transition-transform" />
              <span className="text-4xl block">🩺</span>
              <h4 className="font-black text-slate-800 text-sm font-poppins uppercase tracking-wide">Dokter Gigi: Rekam Medis Berantakan</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Catatan diagnosis manual di kertas sering tercecer. Odontogram fisik rawan sobek, dan antrean janji temu kontrol bracket (behel) sering bertabrakan dengan jam operasional.
              </p>
            </Card>

            {/* Admin Pain Point */}
            <Card className="rounded-[28px] border-slate-200 bg-white hover:shadow-md transition-all p-6 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-merah/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-125 transition-transform" />
              <span className="text-4xl block">👩‍💼</span>
              <h4 className="font-black text-slate-800 text-sm font-poppins uppercase tracking-wide">Staf Kasir: Beban Kerja Manual</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Proses pendaftaran pasien baru lambat. Antrean kasir menumpuk saat verifikasi tagihan dan invoice, serta tingginya angka *No-Show* janji temu akibat lupa mengabari pasien.
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* WAVE DIVIDER TRANSITION BACK TO WHITE */}
      <WaveBottom className="text-slate-100/60 bg-white" />

      {/* SOLUTION SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Solusi Ceria SmileDental</Badge>
          <h2 className="text-3xl font-black text-slate-900 font-poppins">Solusi Cerdas untuk Meningkatkan Laba Klinik</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kami mereduksi beban kerja administratif klinik hingga 40%</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-hijau/10 text-hijau flex items-center justify-center shrink-0"><HiOutlineDeviceMobile className="text-xl animate-bounce" /></div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm font-poppins">Sistem Loyalitas CRM Otomatis</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">Gantikan kartu member fisik dengan tier loyalitas digital. Pasien mengumpulkan poin setiap transaksi perawatan yang otomatis terhubung ke sistem kasir.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-hijau/10 text-hijau flex items-center justify-center shrink-0"><HiOutlineClock className="text-xl" /></div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm font-poppins">Otomasi WhatsApp Reminders & Booking</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">Tekan angka mangkir pasien (No-Show) hingga 90% melalui notifikasi konfirmasi kedatangan WhatsApp H-1 otomatis yang tersambung ke jadwal internal.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-hijau/10 text-hijau flex items-center justify-center shrink-0"><HiOutlineDatabase className="text-xl" /></div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm font-poppins">Rekam Medis Digital & Billing 1-Klik</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">Menulis catatan odontogram digital, menerbitkan e-invoice transaksi pembayaran, serta mendata ulasan kepuasan dalam satu dashboard terintegrasi.</p>
              </div>
            </div>
          </div>

          {/* Interactive Benefit Card */}
          <div className="bg-gradient-to-tr from-biru via-hijau/90 to-hijau p-8 rounded-[36px] text-white space-y-4 shadow-xl shadow-hijau/10 hover:rotate-1 hover:scale-[1.01] transition-all duration-300">
            <Badge className="bg-white/20 text-white border-0 text-[9px] uppercase tracking-widest font-black rounded-full">🚀 Live Benefit</Badge>
            <h3 className="text-2xl font-black font-poppins leading-tight">Mengapa SmileDental CRM Berbeda?</h3>
            <p className="text-xs text-blue-50/90 leading-relaxed font-semibold">
              Klinik dental lain fokus pada operasional biasa. Kami melangkah lebih jauh dengan mengawinkan operasional tersebut dengan mesin loyalitas pasien. Mengubah pasien sekali-datang menjadi pelanggan seumur hidup yang setia.
            </p>
            <div className="pt-2 flex gap-4 text-center">
              <div>
                <span className="block text-2xl font-black">90%</span>
                <span className="text-[9px] text-blue-100/80 font-bold uppercase tracking-wider">No-Show Reduksi</span>
              </div>
              <div className="w-px bg-white/20 self-stretch" />
              <div>
                <span className="block text-2xl font-black">25%</span>
                <span className="text-[9px] text-blue-100/80 font-bold uppercase tracking-wider">Kenaikan Retensi</span>
              </div>
              <div className="w-px bg-white/20 self-stretch" />
              <div>
                <span className="block text-2xl font-black">40%</span>
                <span className="text-[9px] text-blue-100/80 font-bold uppercase tracking-wider">Hemat Waktu Staf</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRM PATIENT WORKFLOW (TIMELINE) */}
      <WaveTop className="text-slate-100/60 bg-white" />
      <section id="alur" className="bg-slate-100/60 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Workflow CRM Pasien</Badge>
            <h2 className="text-3xl font-black text-slate-900 font-poppins">Alur Siklus Hidup Hubungan Pasien Gigi</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dari kunjungan pertama hingga menjadi duta promosi klinik loyal</p>
          </div>

          {/* Interactive Timeline Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { step: 1, label: "Cari Info", icon: "👤", desc: "Pasien butuh perawatan" },
              { step: 2, label: "Registrasi", icon: "📝", desc: "Daftar di web/resepsionis" },
              { step: 3, label: "Janji Temu", icon: "📅", desc: "Pesan jadwal antrean" },
              { step: 4, label: "Tindakan", icon: "🩺", desc: "Pemeriksaan dokter" },
              { step: 5, label: "Rekam Medis", icon: "📋", desc: "Simpan riwayat medis" },
              { step: 6, label: "Kasir", icon: "💳", desc: "Lunas & kalkulasi koin" },
              { step: 7, label: "Membership", icon: "💎", desc: "Dapat poin & naik tier" },
              { step: 8, label: "Klaim Voucher", icon: "🎁", desc: "Redeem bonus voucher" }
            ].map((w, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer p-4 rounded-3xl border text-center transition-all duration-300 ${
                  activeStep === idx 
                    ? "bg-gradient-to-br from-biru to-hijau text-white border-transparent shadow-lg shadow-hijau/20 scale-105" 
                    : "bg-white border-slate-200/80 hover:border-hijau/50 text-slate-700"
                }`}
              >
                <span className="block text-3xl mb-1">{w.icon}</span>
                <h5 className="text-[10px] font-black uppercase tracking-wider font-poppins">{w.label}</h5>
                <span className={`text-[8px] block mt-1 font-bold ${activeStep === idx ? "text-blue-100" : "text-slate-400"}`}>Langkah {w.step}</span>
              </div>
            ))}
          </div>

          {/* Interactive Step Description Box */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-[32px] flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <span className="text-5xl bg-hijau/10 p-5 rounded-3xl animate-float-slow">
              {["👤", "📝", "📅", "🩺", "📋", "💳", "💎", "🎁"][activeStep]}
            </span>
            <div className="space-y-1.5">
              <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 text-[8px] font-extrabold uppercase rounded-full">Workflow Detil</Badge>
              <h4 className="font-extrabold text-slate-800 text-sm leading-relaxed font-poppins">
                {[
                  "Langkah 1: Calon pasien mencari klinik gigi yang transparan dalam mengelola harga dan program loyalitas reward.",
                  "Langkah 2: Admin kasir menginput profil data diri pasien baru dengan cepat via form register klinik yang tersambung ke database.",
                  "Langkah 3: Pasien memesan jadwal janji temu online dan menerima notifikasi tautan konfirmasi antrean via WhatsApp.",
                  "Langkah 4: Pemeriksaan klinis oleh dokter gigi spesialis dengan pendekatan personal untuk kenyamanan pasien.",
                  "Langkah 5: Catatan odontogram digital dan diagnosa tindakan diinput ke dalam rekam medis elektronik pasien.",
                  "Langkah 6: Pembayaran invoice kasir dengan berbagai opsi pembayaran (QRIS, Kartu Kredit) yang otomatis memproses penambahan poin.",
                  "Langkah 7: Saldo poin loyalitas pasien terakumulasi otomatis, memicu kenaikan tingkat membership secara instan.",
                  "Langkah 8: Pasien menukarkan koin poin loyalitas mereka untuk mendapatkan diskon voucher perawatan control gigi selanjutnya."
                ][activeStep]}
              </h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Setiap aktivitas tercatat secara otomatis pada riwayat audit sistem CRM, memungkinkan evaluasi berkala tingkat retensi pasien.
              </p>
            </div>
          </div>

        </div>
      </section>
      <WaveBottom className="text-slate-100/60 bg-white" />

      {/* INTERACTIVE DEMO (CRM DIMENSIONS & LIVE TOOLS CHECKER) */}
      <section id="demo" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Interactive Product Demo</Badge>
          <h2 className="text-3xl font-black text-slate-900 font-poppins">Uji Coba Fitur SmileDental CRM (Live)</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Silakan klik tab modul di bawah untuk mensimulasikan sistem secara real-time</p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center gap-2.5 border-b border-slate-200 pb-4 flex-wrap">
          {[
            { id: "operational", label: "Operational CRM & Odontogram", icon: "🩺" },
            { id: "analytical", label: "Analytical CRM Graph", icon: "📈" },
            { id: "strategic", label: "Strategic CRM & WA Simulator", icon: "💬" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveCrmTab(t.id);
                setSelectedTooth(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeCrmTab === t.id 
                  ? "bg-hijau text-white shadow-md shadow-hijau/20" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-650"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Live Demos */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* OPERATIONAL CRM WITH CLICKABLE TOOTH DIAGRAM */}
            {activeCrmTab === "operational" && (
              <div className="bg-white border border-slate-200/80 p-6 rounded-[32px] space-y-5 shadow-sm animate-in fade-in duration-300">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 className="font-black text-slate-800 text-base font-poppins">Operasional: Odontogram & Rekam Medis Gigi</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Pilih pasien untuk memuat data rekam medis gigi mereka secara dinamis.</p>
                  </div>
                  {/* Patient Selector */}
                  <select 
                    value={selectedPatientId} 
                    onChange={(e) => handleSelectPatient(e.target.value)}
                    className="text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  >
                    <option value="PT-001">Andi Saputra (PT-001)</option>
                    <option value="PT-002">Siti Aisyah (PT-002)</option>
                    <option value="PT-004">Dewi Lestari (PT-004)</option>
                    <option value="PT-007">Heri Wijaya (PT-007)</option>
                  </select>
                </div>

                {/* Patient Summary Widget */}
                {patientDetailData && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl text-xs font-semibold">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Nama Lengkap</span>
                      <span className="text-slate-805 text-slate-800">{patientDetailData.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Umur & Kota</span>
                      <span className="text-slate-805 text-slate-800">{patientDetailData.age} Thn · {patientDetailData.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Membership Tier</span>
                      <span className="text-biru font-black">💎 {patientDetailData.membershipLevel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Keluhan Awal</span>
                      <span className="text-slate-805 text-slate-800">{patientDetailData.complaint}</span>
                    </div>
                  </div>
                )}

                {/* Interactive Odontogram Map (Teeth layout) */}
                <div className="space-y-4 pt-2">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peta Odontogram Gigi Pasien (Klik nomor gigi untuk cek diagnosis)</h5>
                  
                  <div className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50 space-y-6">
                    {/* Upper row teeth */}
                    <div className="space-y-1">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider text-center">Barisan Gigi Atas</span>
                      <div className="flex justify-center gap-1.5 sm:gap-2.5 flex-wrap">
                        {[16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26].map(num => {
                          const statusInfo = getToothStatus(num);
                          const isSelected = selectedTooth === num;
                          return (
                            <button
                              key={num}
                              onClick={() => setSelectedTooth(num)}
                              className={`w-7.5 h-10 sm:w-9 sm:h-11 rounded-lg border text-xs font-extrabold flex flex-col items-center justify-between py-1 transition-all cursor-pointer ${
                                isSelected ? "ring-2 ring-biru scale-105" : ""
                              } ${statusInfo?.color}`}
                            >
                              <span>{num}</span>
                              <span className="text-[7px] font-black uppercase tracking-tighter block leading-none">
                                {statusInfo?.status === "Sehat" ? "OK" : statusInfo?.status.substring(0, 4)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Lower row teeth */}
                    <div className="space-y-1">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider text-center">Barisan Gigi Bawah</span>
                      <div className="flex justify-center gap-1.5 sm:gap-2.5 flex-wrap">
                        {[46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 38].map(num => {
                          const statusInfo = getToothStatus(num);
                          const isSelected = selectedTooth === num;
                          return (
                            <button
                              key={num}
                              onClick={() => setSelectedTooth(num)}
                              className={`w-7.5 h-10 sm:w-9 sm:h-11 rounded-lg border text-xs font-extrabold flex flex-col items-center justify-between py-1 transition-all cursor-pointer ${
                                isSelected ? "ring-2 ring-biru scale-105" : ""
                              } ${statusInfo?.color}`}
                            >
                              <span>{num}</span>
                              <span className="text-[7px] font-black uppercase tracking-tighter block leading-none">
                                {statusInfo?.status === "Sehat" ? "OK" : statusInfo?.status.substring(0, 4)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tooth Condition Detail Output */}
                {selectedTooth !== null ? (
                  <div className="bg-slate-55 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-semibold space-y-1 animate-in slide-in-from-bottom-2 duration-150">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-808 text-slate-800 font-extrabold text-sm font-poppins">Gigi Nomor {selectedTooth}</span>
                      <Badge className={
                        getToothStatus(selectedTooth)?.status === "Sehat" 
                          ? "bg-hijau/10 text-hijau" 
                          : "bg-merah/10 text-merah"
                      }>
                        {getToothStatus(selectedTooth)?.status}
                      </Badge>
                    </div>
                    <p className="text-slate-550 text-slate-600 font-medium leading-relaxed">{getToothStatus(selectedTooth)?.desc}</p>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 font-bold p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    💡 Silakan klik salah satu gigi di atas untuk mensimulasikan catatan odontogram digital.
                  </div>
                )}
              </div>
            )}

            {/* ANALYTICAL CRM WITH MULTI-METRICS TOGGLE CHART */}
            {activeCrmTab === "analytical" && (
              <div className="bg-white border border-slate-200/80 p-6 rounded-[32px] space-y-4 shadow-sm animate-in fade-in duration-300">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h4 className="font-black text-slate-800 text-base font-poppins">Analitikal: Metrik Grafik Bisnis Klinik</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Pantau visual statistik klinis dan retensi untuk keputusan manajemen.</p>
                  </div>
                  
                  {/* Metric Switcher */}
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {[
                      { id: "pendapatan", label: "Omset", icon: "💰" },
                      { id: "pasien", label: "Pasien Baru", icon: "👥" },
                      { id: "retensi", label: "Retensi %", icon: "📈" }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setSelectedMetric(btn.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedMetric === btn.id 
                            ? "bg-white text-hijau shadow-sm" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Responsive Recharts Container */}
                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metricData[selectedMetric]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedMetric === "pendapatan" ? "#3b82f6" : "#00B074"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={selectedMetric === "pendapatan" ? "#3b82f6" : "#00B074"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <ChartTooltip formatter={(value) => selectedMetric === "pendapatan" ? `Rp ${value.toLocaleString("id-ID")}` : selectedMetric === "retensi" ? `${value}%` : `${value} Pasien`} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={selectedMetric === "pendapatan" ? "#3b82f6" : "#00B074"} 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#metricGrad)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Chart insights box */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-semibold text-slate-500 flex items-center gap-3">
                  <span className="text-xl">📈</span>
                  <p>
                    {selectedMetric === "pendapatan" && "Kenaikan omset 25% di minggu ke-4 ditunjang oleh promo Scaling 10% via WhatsApp Broadcast."}
                    {selectedMetric === "pasien" && "Registrasi pasien baru terus meningkat berkat fitur pendaftaran mandiri digital."}
                    {selectedMetric === "retensi" && "Tingkat kunjungan berulang (retensi) mencapai 92% berkat program loyalitas koin berhadiah."}
                  </p>
                </div>
              </div>
            )}

            {/* STRATEGIC CRM & WHATSAPP NOTIFICATION SIMULATOR */}
            {activeCrmTab === "strategic" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* WhatsApp Notification Simulator Card */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-[32px] space-y-4 shadow-sm">
                  <div>
                    <h4 className="font-black text-slate-800 text-base font-poppins">Strategis: WhatsApp Notification Simulator</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Pilih template pesan dan saksikan bagaimana sistem mengabari pasien secara personal.</p>
                  </div>

                  {/* Template Picker */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: "reminder", label: "Pengingat Janji Temu", icon: "📅" },
                      { id: "promo", label: "Promo Naik Membership", icon: "💎" },
                      { id: "feedback", label: "Permintaan Feedback NPS", icon: "⭐" }
                    ].map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => setWaTemplate(tpl.id)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          waTemplate === tpl.id 
                            ? "bg-[#128C7E] text-white" 
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        {tpl.icon} {tpl.label}
                      </button>
                    ))}
                  </div>

                  {/* Inputs for simulator */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Nama Pasien</label>
                      <input 
                        type="text" 
                        value={waTargetName} 
                        onChange={(e) => setWaTargetName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Nomor Handphone</label>
                      <input 
                        type="text" 
                        value={waTargetPhone} 
                        onChange={(e) => setWaTargetPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone frame simulator */}
                  <div className="border border-slate-200 rounded-3xl overflow-hidden max-w-sm mx-auto shadow-md">
                    {/* Phone header */}
                    <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">🦷</div>
                        <div>
                          <p className="font-bold leading-none font-poppins">SmileDental Clinic</p>
                          <span className="text-[9px] text-[#25D366] block mt-0.5 leading-none">Online</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold opacity-60">WhatsApp Business</span>
                    </div>

                    {/* Chat screen */}
                    <div className="bg-[#e5ddd5] p-4 space-y-3 min-h-36 max-h-48 overflow-y-auto flex flex-col justify-end text-[11px] font-semibold font-barlow">
                      <div className="self-end bg-[#dcf8c6] text-slate-900 p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm border border-[#bbf0a2] relative">
                        <p className="whitespace-pre-wrap leading-relaxed">{getWaSimulatedMessage()}</p>
                        <div className="text-[8px] text-slate-400 font-bold mt-1 text-right">
                          12:15 WIB <span className="text-blue-500">✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Points Checker Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="rounded-[28px] border-slate-200 p-5 space-y-4 shadow-sm bg-white">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="text-xl">🔍</span>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm font-poppins">Points Balance Checker</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Cek poin pasien secara cepat di database.</p>
                      </div>
                    </div>
                    <form onSubmit={handleCheckPoints} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ID Pasien (PT-001) / No Hp"
                        className="flex-1 text-xs font-semibold px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none"
                      />
                      <Button type="submit" size="sm" className="bg-hijau hover:bg-hijau/90 text-white rounded-xl cursor-pointer font-bold">Cek Poin</Button>
                    </form>
                    {searchError && <p className="text-[9px] text-red-500 font-bold leading-normal">{searchError}</p>}
                    {patientPointsData && (
                      <div className="bg-hijau/10 border border-hijau/20 rounded-xl p-3.5 text-xs font-semibold space-y-1.5 animate-in slide-in-from-top-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-800 font-bold">{patientPointsData.name} ({patientPointsData.id})</span>
                          <Badge className="bg-hijau/20 text-hijau border-transparent">{patientPointsData.level} Member</Badge>
                        </div>
                        <p className="text-hijau font-black">Saldo Aktif: {patientPointsData.balance} Poin Reward</p>
                      </div>
                    )}
                  </Card>

                  {/* Patient Points Calculator Card */}
                  <Card className="rounded-[28px] border-slate-200 p-5 space-y-4 shadow-sm bg-white">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="text-xl">🧮</span>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm font-poppins">Points Calculator</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Hitung perolehan koin dari nominal kasir.</p>
                      </div>
                    </div>
                    <form onSubmit={handleCalculate} className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        placeholder="Contoh: 1500000"
                        className="flex-1 text-xs font-semibold px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none"
                      />
                      <Button type="submit" size="sm" className="bg-biru hover:bg-biru/90 text-white rounded-xl cursor-pointer font-bold">Hitung</Button>
                    </form>
                    {calculatedPoints > 0 && (
                      <p className="text-xs font-bold text-biru bg-biru/10 border border-biru/20 rounded-xl p-3 animate-in slide-in-from-top-1">
                        Transaksi Rp {parseFloat(billAmount).toLocaleString("id-ID")} = <span className="underline">{calculatedPoints} Poin Reward</span>!
                      </p>
                    )}
                  </Card>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Live Mock Dashboard Commands */}
          <div className="lg:col-span-5 bg-slate-900 text-slate-200 rounded-[36px] p-6 space-y-6 shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[8px] uppercase tracking-wider font-black rounded-full">🖥️ Command Center Mockup</Badge>
                <h4 className="text-sm font-black text-white mt-1.5 font-poppins">SmileDental Staff Console</h4>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
            </div>

            {/* Quick KPI stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/30 text-center">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Patients</span>
                <span className="text-base font-black text-white mt-1 block font-poppins">{totalPatients} Pasien</span>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/30 text-center">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">New Month</span>
                <span className="text-base font-black text-hijau mt-1 block font-poppins">+5 Baru</span>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/30 text-center">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">NPS Rating</span>
                <span className="text-base font-black text-hijau mt-1 block font-poppins">4.9 / 5.0</span>
              </div>
            </div>

            {/* Live recent activities simulation */}
            <div className="space-y-3.5">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <HiOutlineTrendingUp className="text-hijau" /> Live Audit CRM Activity Logs
              </h5>
              <div className="space-y-2">
                {[
                  { time: "10:30", type: "Booking", name: "Siti Aisyah", act: "Booking Odontektomi Gigi Bungsu" },
                  { time: "09:45", type: "Payment", name: "Andi Saputra", act: "Pembayaran Scaling Gigi lunas via QRIS" },
                  { time: "08:00", type: "System", name: "Budi Santoso", act: "Telah naik level ke Platinum Member" }
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-semibold bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800/40">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">{act.time} · {act.name}</span>
                      <span className="text-white block mt-1 text-[11px] font-medium leading-tight">{act.act}</span>
                    </div>
                    <Badge variant={act.type === "Payment" ? "success" : "default"} className="text-[8px] uppercase tracking-wider rounded-full">
                      {act.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2 text-center border-t border-slate-800">
              <Link to="/login">
                <span className="text-xs text-hijau hover:text-hijau/80 font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer">
                  Buka Portal Admin Lengkap <HiOutlineArrowRight />
                </span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* MEMBERSHIP PERKS & REWARDS CATALOG SECTION */}
      <WaveTop className="text-slate-100/60 bg-white" />
      <section className="bg-slate-100/60 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Membership Perks Explorer</Badge>
            <h2 className="text-3xl font-black text-slate-900 font-poppins">Keistimewaan Tingkatan Tier Loyalitas Pasien</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pilih tingkatan keanggotaan dan simulasikan claim keuntungan reward voucher di kasir</p>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                tier: "Bronze", 
                color: "from-amber-700 to-amber-500 text-amber-50", 
                points: "0 - 500 Poin", 
                perk: "Potongan harga 5% untuk Scaling Gigi", 
                voucher: "VCH-DISC5", 
                ptsNeeded: 100,
                patients: ["Andi Saputra", "Anton Wijaya"]
              },
              { 
                tier: "Silver", 
                color: "from-slate-500 to-slate-400 text-slate-50", 
                points: "501 - 1000 Poin", 
                perk: "Potongan harga 10% untuk Tambal Gigi", 
                voucher: "VCH-DISC10", 
                ptsNeeded: 200,
                patients: ["Dewi Lestari", "Heri Wijaya", "Gita Lestari"]
              },
              { 
                tier: "Gold", 
                color: "from-yellow-600 to-amber-400 text-yellow-50", 
                points: "1001 - 2000 Poin", 
                perk: "Diskon 10% All Treatment + Antrean WA Prioritas", 
                voucher: "VCH-DISC10", 
                ptsNeeded: 200,
                patients: ["Siti Aisyah", "Farida Putri", "Diana Rosa", "Hendra Kusuma"]
              },
              { 
                tier: "Platinum", 
                color: "from-biru to-blue-400 text-indigo-50", 
                points: "2000+ Poin", 
                perk: "Diskon 15% All Treatment + Free Laser Bleaching Gigi", 
                voucher: "VCH-FREEBLEACH", 
                ptsNeeded: 1500,
                patients: ["Budi Santoso", "Eko Prasetyo", "Ratih Pratiwi"]
              }
            ].map((perkItem) => {
              const isSelected = selectedPerkTier === perkItem.tier;
              return (
                <div 
                  key={perkItem.tier}
                  onClick={() => setSelectedPerkTier(perkItem.tier)}
                  className={`cursor-pointer rounded-[32px] p-6 space-y-4 border transition-all duration-300 ${
                    isSelected 
                      ? "bg-white border-hijau shadow-lg scale-105" 
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {/* Badge Tier Header */}
                  <div className={`p-4 rounded-2xl bg-gradient-to-tr ${perkItem.color} flex justify-between items-center`}>
                    <span className="font-black font-poppins text-sm uppercase tracking-wider">{perkItem.tier}</span>
                    <span className="text-[10px] font-bold">{perkItem.points}</span>
                  </div>
                  
                  {/* Perk Details */}
                  <div className="space-y-1.5 text-xs font-semibold">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Benefit Tier</span>
                    <p className="text-slate-800 leading-normal">{perkItem.perk}</p>
                  </div>

                  {/* Active patients list */}
                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Pasien Terverifikasi ({perkItem.patients.length})</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {perkItem.patients.map(p => (
                        <span key={p} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Simulation Button */}
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateRedeem(perkItem.patients[0], perkItem.voucher, perkItem.ptsNeeded);
                    }}
                    className="w-full text-[10px] font-black uppercase tracking-wider bg-slate-150 hover:bg-slate-200 text-slate-800 border-0 rounded-xl py-2 cursor-pointer font-bold"
                  >
                    Simulasi Klaim Poin
                  </Button>
                </div>
              );
            })}
          </div>

        </div>
      </section>
      <WaveBottom className="text-slate-100/60 bg-white" />

      {/* SMILE LEVEL CHECKER (Mood & Condition Analyzer) */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">
            Fitur Ceria: Smile Meter
          </Badge>
          <h2 className="text-3xl font-black text-slate-900 font-poppins">Bagaimana Keadaan Gigi & Senyum Anda Hari Ini?</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Simulasikan keluhan atau kondisi gigi Anda untuk mendapatkan rekomendasi tindakan CRM otomatis
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-[36px] p-8 shadow-md space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-hijau/5 rounded-full translate-x-10 -translate-y-10" />
          
          {/* Mood / Dental Status Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {[
              { 
                key: "sakit", 
                emoji: "😭", 
                label: "Sakit Gigi / Ngilu", 
                level: 25, 
                color: "bg-red-50 text-red-700 border-red-200"
              },
              { 
                key: "biasa", 
                emoji: "😕", 
                label: "Kurang Pede (Kuning/Karang)", 
                level: 50, 
                color: "bg-amber-50 text-amber-700 border-amber-200"
              },
              { 
                key: "sehat", 
                emoji: "😊", 
                label: "Gigi Sehat Terawat", 
                level: 80, 
                color: "bg-emerald-50 text-emerald-700 border-emerald-200"
              },
              { 
                key: "ceria", 
                emoji: "😁", 
                label: "Super Ceria & Berkilau", 
                level: 100, 
                color: "bg-hijau/10 text-hijau border-hijau/20"
              }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSmileStatus(item.key)}
                className={`p-5 rounded-3xl border flex flex-col items-center gap-3 transition-all duration-300 cursor-pointer ${
                  smileStatus === item.key 
                    ? "bg-white border-biru shadow-lg scale-105 ring-2 ring-biru/25" 
                    : "bg-slate-50 border-slate-200 hover:border-slate-350 hover:bg-white"
                }`}
              >
                <span className="text-4xl animate-bounce" style={{ animationDelay: smileStatus === item.key ? "0s" : "0.5s", animationDuration: "2s" }}>
                  {item.emoji}
                </span>
                <span className="text-xs font-black text-slate-805 text-slate-800 text-center tracking-tight leading-snug font-poppins">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Smile Level Meter Gauge */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400 tracking-wider">
              <span>Indeks Kebahagiaan Senyum (Smile Score)</span>
              <span className="text-biru font-black text-sm">
                {smileStatus === "sakit" && "25% (Butuh Penanganan Segera)"}
                {smileStatus === "biasa" && "50% (Perlu Perawatan Rutin)"}
                {smileStatus === "sehat" && "80% (Pertahankan & Kontrol)"}
                {smileStatus === "ceria" && "100% (Sempurna & Berkilau)"}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200/50">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-biru to-hijau"
                style={{ 
                  width: `${
                    smileStatus === "sakit" ? 25 :
                    smileStatus === "biasa" ? 50 :
                    smileStatus === "sehat" ? 80 : 100
                  }%` 
                }}
              />
            </div>
          </div>

          {/* Diagnosis & Treatment recommendation */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="text-5xl bg-white p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0">
              {smileStatus === "sakit" && "🏥"}
              {smileStatus === "biasa" && "🦷"}
              {smileStatus === "sehat" && "🛡️"}
              {smileStatus === "ceria" && "💎"}
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-biru bg-biru/10 px-2.5 py-1 rounded-full">
                  Rekomendasi Tindakan CRM
                </span>
                <h4 className="text-base font-black text-slate-808 text-slate-800 mt-2 font-poppins">
                  {smileStatus === "sakit" && "Perawatan Saluran Akar (Endodontik) / Tambalan Gigi"}
                  {smileStatus === "biasa" && "Pembersihan Karang Gigi (Scaling) & Poles Noda"}
                  {smileStatus === "sehat" && "Kontrol Rutin 6 Bulanan & Aplikasi Fluoride"}
                  {smileStatus === "ceria" && "Laser Bleaching Gigi (Pemutihan Premium)"}
                </h4>
              </div>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                {smileStatus === "sakit" && "Gigi berlubang parah atau pulpitis menyebabkan rasa ngilu berkepanjangan. CRM kami merekomendasikan pemeriksaan dokter spesialis konservasi gigi segera. Jadwal Anda akan diprioritaskan di sistem antrean."}
                {smileStatus === "biasa" && "Karang gigi menumpuk dapat memicu radang gusi dan bau mulut. Kami sarankan tindakan Scaling. Gunakan poin loyalitas SmileDental Anda untuk mengklaim diskon voucher di kasir!"}
                {smileStatus === "sehat" && "Kondisi gigi Anda prima! Cukup lakukan pemeliharaan rutin berupa scaling ringan dan pemeriksaan karies tersembunyi agar status membership Anda tetap aktif dan poin terus terkumpul."}
                {smileStatus === "ceria" && "Selamat! Senyum Anda adalah aset berharga. Jaga kecerahannya agar tetap berkilau dengan treatment Bleaching premium. Member Platinum mendapatkan benefit ini secara gratis!"}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="bg-biru hover:bg-biru/90 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md shadow-biru/10 cursor-pointer"
                >
                  Booking Perawatan Ini
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("demo")}
                  className="bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Simulasikan Poin Loyalty
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID (10 B2B CLINIC FEATURES) */}
      <section id="fitur" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Katalog Fitur Lengkap</Badge>
          <h2 className="text-3xl font-black text-slate-900 font-poppins">Fitur SaaS Komprehensif Klinik Gigi</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dirancang untuk memudahkan pekerjaan dokter, perawat, kasir, dan owner</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Patient Management (Customer 360)", icon: "👤", desc: "Profil lengkap pasien, nomor handphone, kota asal, alamat rumah, hingga riwayat membership secara terpusat." },
            { title: "Intelligent Appointment Scheduling", icon: "📅", desc: "Kalender dokter terpadu, konfirmasi kehadiran otomatis, serta input durasi tindakan yang presisi." },
            { title: "Digital Odontogram & Medical Records", icon: "🩺", desc: "Pencatatan klinis rekam medis, visualisasi gigi terdampak, diagnosa pulpitis/karies, dan resep obat digital." },
            { title: "Membership Level Tiers", icon: "💎", desc: "Pengelompokan otomatis tingkat member (Bronze, Silver, Gold, Platinum) berdasarkan perolehan poin transaksi." },
            { title: "Cashier Billing & Multi-Payments", icon: "💳", desc: "Invoice kasir otomatis, penghitungan diskon member, pelunasan via QRIS, Debit, Kartu Kredit, atau Transfer Bank." },
            { title: "CRM Dashboard Analytics", icon: "📊", desc: "Grafik visual komprehensif untuk memantau tren omset bulanan, rasio kunjungan harian, dan kepuasan NPS." },
            { title: "WhatsApp Auto-Reminders", icon: "💬", desc: "Otomasi notifikasi H-1 reservasi jadwal antrean dokter untuk menekan tingkat pembatalan pasien." },
            { title: "Patient Feedback & Review logs", icon: "⭐", desc: "Penilaian performa pelayanan dokter gigi serta penyelesaian keluhan (*Complaint Resolution*) secara profesional." },
            { title: "Inventory & Dental Kit Stock", icon: "📦", desc: "Pengawasan ketersediaan dental material, sikat gigi, obat bius lokal, dan jarum suntik steril." },
            { title: "Multi-branch / Klinik Cabang", icon: "🏢", desc: "Manajemen data staff dan performa antar cabang klinik gigi dalam satu dasbor super-admin." }
          ].map((f, idx) => (
            <Card key={idx} className="rounded-[32px] border-slate-200 bg-white p-6 space-y-4 hover:shadow-md transition-shadow duration-300">
              <span className="text-3xl bg-slate-50 p-3.5 rounded-2xl inline-block w-fit">{f.icon}</span>
              <h4 className="font-black text-slate-800 text-sm font-poppins">{f.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* BENEFITS GRID (6 PERFORMANCE BENEFIT CARDS) */}
      <WaveTop className="text-slate-100/60 bg-white" />
      <section className="bg-slate-100/60 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Keuntungan Bisnis</Badge>
            <h2 className="text-3xl font-black text-slate-900 font-poppins">Nilai Tambah untuk Investasi Klinik Anda</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Meningkatkan retensi laba klinik gigi secara berkelanjutan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Mereduksi Waktu Admin 40%", icon: "⚡", desc: "Menghemat durasi input manual pendaftaran dan verifikasi pembayaran kasir." },
              { title: "No-Show Turun Hingga 90%", icon: "📱", desc: "Mengirimkan pesan konfirmasi antrean berkala via integrasi WhatsApp API." },
              { title: "Keamanan Sandi Enkripsi Cloud", icon: "🔒", desc: "Menjaga data rekam medis pasien aman terenkripsi di server basis data cloud." },
              { title: "Akurasi Keuangan Kasir", icon: "💰", desc: "Mengeliminasi selisih kas harian dengan pencatatan invoice digital yang ketat." },
              { title: "Laporan Bisnis Sekali Klik", icon: "📄", desc: "Mengunduh laporan neraca laba-rugi serta performa harian klinik dengan instan." },
              { title: "Meningkatkan Loyalitas Pasien", icon: "💝", desc: "Memacu kunjungan berulang dengan program penukaran voucher koin loyalitas." }
            ].map((b, idx) => (
              <div key={idx} className="bg-white rounded-[32px] border border-slate-200/60 p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300 font-semibold text-xs">
                <span className="text-2xl bg-hijau/10 p-3 rounded-2xl inline-block w-fit text-hijau font-sans">{b.icon}</span>
                <h4 className="font-black text-slate-800 text-sm font-poppins leading-tight">{b.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveBottom className="text-slate-100/60 bg-white" />

      {/* INTEGRATIONS SECTION */}
      <section id="integrasi" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Konektivitas Sistem</Badge>
          <h2 className="text-3xl font-black text-slate-900 font-poppins">Terhubung dengan Ekosistem Pihak Ketiga</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Integrasi instan demi kelancaran operasional teknologi klinik gigi Anda</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { name: "Supabase DB", desc: "Cloud Database & Auth", icon: "⚡" },
            { name: "WhatsApp API", desc: "Notifikasi Otomatis", icon: "💬" },
            { name: "Google Calendar", desc: "Jadwal Dokter Sync", icon: "📅" },
            { name: "Gmail Service", desc: "Laporan Mingguan", icon: "✉️" },
            { name: "Payment Gateway", desc: "QRIS & Kartu Kredit", icon: "💳" }
          ].map((int, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-5 rounded-[28px] text-center space-y-3 shadow-sm hover:translate-y-[-4px] transition-all duration-300">
              <span className="text-3xl block">{int.icon}</span>
              <h5 className="font-extrabold text-slate-800 text-xs font-poppins leading-none">{int.name}</h5>
              <p className="text-[10px] text-slate-400 font-semibold">{int.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <WaveTop className="text-slate-100/60 bg-white" />
      <section id="testimoni" className="bg-slate-100/60 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Testimoni Pengguna</Badge>
            <h2 className="text-3xl font-black text-slate-900 font-poppins leading-tight">Apa Kata Mereka yang Menggunakan SmileDental?</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ulasan kepuasan dari owner klinik dan dokter gigi spesialis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "drg. Rina Amelia",
                role: "Owner DentCare Group",
                comment: "Sejak beralih dari pencatatan manual kertas ke SmileDental CRM, efisiensi pendaftaran kasir naik 40% dan pendapatan koin loyalitas memicu pasien datang scaling rutin.",
                stars: 5,
                tag: "Klinik Jakarta"
              },
              {
                name: "Lisa Anggraini",
                role: "Admin Manager Klinik Gigi Mulia",
                comment: "Dulu sering kesal karena pasien lupa janji temu (*no-show*). Berkat pengingat jadwal WhatsApp otomatis H-1 di SmileDental, antrean klinik menjadi teratur tanpa bolong.",
                stars: 5,
                tag: "Klinik Bandung"
              },
              {
                name: "drg. Budi Hermawan Sp.BM",
                role: "Spesialis Bedah Mulut",
                comment: "Sangat mudah mengakses riwayat rontgen panoramic dan odontogram rekam medis pasien langsung dari layar tablet saat operasi bedah mulut. Sangat direkomendasikan!",
                stars: 5,
                tag: "Klinik Surabaya"
              }
            ].map((t, idx) => (
              <Card key={idx} className="rounded-[32px] border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                <div className="space-y-4">
                  <Rating value={t.stars} readOnly />
                  <p className="text-xs text-slate-600 italic font-semibold leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4">
                  <div>
                    <h5 className="font-black text-slate-805 text-slate-800 text-xs font-poppins">{t.name}</h5>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.role}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] bg-slate-50 border-slate-200 text-slate-500 font-bold uppercase rounded-full">{t.tag}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <WaveBottom className="text-slate-100/60 bg-white" />

      {/* FAQ SECTION (10 ACCORDIONS) */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-hijau/10 text-hijau hover:bg-hijau/20 border-0 px-3 py-1 font-extrabold rounded-full">Pertanyaan Umum (FAQ)</Badge>
          <h2 className="text-3xl font-black text-slate-900 font-poppins leading-tight">Ada Pertanyaan Mengenai SmileDental?</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kami merangkum jawaban atas kendala yang sering diajukan calon pengguna</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "1. Apakah saya bisa mencoba SmileDental CRM secara gratis?",
              a: "Ya, tentu! Kami menyediakan masa uji coba gratis selama 14 hari penuh dengan akses ke seluruh fitur tanpa perlu memasukkan informasi kartu kredit."
            },
            {
              q: "2. Bagaimana cara mengimpor data pasien lama dari Microsoft Excel?",
              a: "Sistem kami menyediakan template file Excel (.xlsx). Anda cukup mengunduh template tersebut, menyalin nama dan nomor telepon pasien Anda, dan mengunggahnya kembali ke dasbor dalam 1 klik."
            },
            {
              q: "3. Apakah rekam medis pasien aman di dalam cloud?",
              a: "Sangat aman. Seluruh data medis gigi dienkripsi menggunakan standar keamanan cloud, terisolasi dengan otentikasi Supabase, dan memiliki backup otomatis harian."
            },
            {
              q: "4. Apakah WhatsApp pengingat janji temu memakan biaya kuota?",
              a: "Otomasi notifikasi janji temu kami kirimkan melalui gerbang API sistem kami yang terintegrasi secara otomatis, sehingga Anda tidak perlu membeli paket pulsa atau kuota seluler tambahan."
            },
            {
              q: "5. Apakah SmileDental mendukung pengelolaan banyak cabang klinik?",
              a: "Ya. Fitur Multi-Branch memungkinkan Anda memantau log administrasi, penanganan dokter, antrean kasir, serta omset gabungan dari seluruh cabang klinik Anda dalam satu akun super-admin."
            },
            {
              q: "6. Bagaimana metode penukaran poin loyalitas bagi pasien?",
              a: "Pasien dapat melihat poin mereka via modul Points Checker di Landing Page Anda. Saat melakukan pembayaran di kasir offline, staff dapat memotong saldo poin pasien untuk menerapkan diskon voucher yang dipilih."
            },
            {
              q: "7. Apakah dokter dapat menggunakan tablet iPad untuk menulis rekam medis?",
              a: "Tentu saja. Tampilan dashboard dan rekam medis kami dioptimalkan secara dinamis untuk kenyamanan penggunaan di layar tablet (*responsive tablet layouts*)."
            },
            {
              q: "8. Berapa lama proses migrasi database klinik gigi kami?",
              a: "Proses setup awal dan pembelajaran operasional staf kasir biasanya selesai kurang dari 1 hari karena antarmuka didesain intuitif dan ramah pengguna umum."
            },
            {
              q: "9. Apakah ada biaya bulanan tersembunyi?",
              a: "Tidak ada biaya tersembunyi. Skema berlangganan kami transparan sesuai paket bulanan/tahunan yang tertera di kontrak layanan."
            },
            {
              q: "10. Ke mana saya bisa menghubungi bantuan jika ada kendala sistem?",
              a: "Tim dukungan pelanggan SmileDental siap mendampingi Anda via WhatsApp Hotline 24/7 untuk memastikan operasional klinik gigi Anda berjalan lancar tanpa kendala teknis."
            }
          ].map((f, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-[22px] overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between text-xs font-black text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer font-poppins uppercase tracking-wide"
                >
                  <span>{f.q}</span>
                  <HiChevronDown className={`text-slate-400 text-base transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed font-semibold border-t border-slate-100 pt-3.5 animate-in slide-in-from-top-1 duration-150 font-barlow">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA BANNER & NEWSLETTER */}
      <section className="bg-gradient-to-br from-biru via-hijau to-slate-900 text-white py-16 px-6 relative overflow-hidden border-t border-blue-700 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <Badge className="bg-white/20 text-white border-0 text-[9px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full">🚀 Coba Sekarang</Badge>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight font-poppins">Siap Mengubah Operasional Klinik Gigi Anda?</h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed font-medium font-barlow">
            Gabung bersama ratusan jaringan klinik gigi profesional lain yang telah memangkas no-show rate janji temu dan meningkatkan kunjungan berulang pasien loyal dengan SmileDental CRM.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white hover:bg-slate-50 text-biru font-black px-8 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                Mulai Uji Coba Gratis 14 Hari
              </Button>
            </Link>
          </div>

          <div className="h-px bg-white/20 my-6" />

          {/* Newsletter Form */}
          <div className="space-y-3.5 max-w-md mx-auto">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-200 font-poppins">Berlangganan Newsletter & Strategi CRM Dental</h5>
            <form onSubmit={(e) => { e.preventDefault(); alert("Terima kasih telah berlangganan newsletter SmileDental!"); }} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Masukkan alamat email Anda"
                className="flex-1 text-xs font-semibold px-4 py-3 rounded-xl bg-white/10 border border-white/25 focus:outline-none focus:bg-white/20 placeholder-blue-200 text-white"
              />
              <Button type="submit" className="font-bold bg-white text-slate-800 hover:bg-slate-100 shadow-sm shrink-0 cursor-pointer rounded-xl font-barlow">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      {/* PUBLIC FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Logo Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-biru text-white flex items-center justify-center shadow-lg shadow-biru/10">
                <svg viewBox="0 0 64 80" fill="white" className="w-4.5 h-4.5">
                  <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
                </svg>
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white block font-poppins">
                Smile<span className="text-hijau">Dental</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold max-w-sm font-barlow">
              SmileDental CRM merupakan platform terintegrasi manajemen operasional klinik gigi & hubungan retensi loyalitas pasien berbasis cloud untuk mendorong performa dan efisiensi bisnis klinik dokter gigi Anda.
            </p>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-white text-xs font-black uppercase tracking-wider font-poppins">Navigasi Fitur</h5>
            <ul className="space-y-2.5 text-[11px] font-semibold font-barlow">
              <li><button onClick={() => scrollTo("fitur")} className="hover:text-white transition-colors cursor-pointer text-left">Patient & Doctor Scheduling</button></li>
              <li><button onClick={() => scrollTo("fitur")} className="hover:text-white transition-colors cursor-pointer text-left">Digital Dental Records & Odontogram</button></li>
              <li><button onClick={() => scrollTo("demo")} className="hover:text-white transition-colors cursor-pointer text-left">Interactive Dashboard Preview</button></li>
              <li><button onClick={() => scrollTo("demo")} className="hover:text-white transition-colors cursor-pointer text-left">Live Points Checker & Calculator</button></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:col-span-4 space-y-3 text-[11px] font-barlow">
            <h5 className="text-white text-xs font-black uppercase tracking-wider font-poppins">Kantor SmileDental CRM</h5>
            <p className="font-semibold text-slate-505 text-slate-500 leading-relaxed">
              📍 Wisma Bisnis Indonesia Lt. 12, Kav. 56, Kebayoran Baru, Jakarta Selatan, 12190
            </p>
            <p className="font-semibold text-slate-505 text-slate-500">
              🕒 Senin - Jumat: 09.00 - 18.00 WIB (Support 24/7)
            </p>
            <p className="font-semibold text-slate-505 text-slate-500">
              📞 WhatsApp Hotline: +62 812-3456-7890
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-barlow">
          <p>© {new Date().getFullYear()} SmileDental CRM SaaS Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white transition-colors">Portal Login Staff</Link>
            <Link to="/register" className="hover:text-white transition-colors">Daftar Akun Baru</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
