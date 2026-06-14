import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../data/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Rating } from "../components/ui/Rating";
import { 
  HiOutlineUserCircle, 
  HiOutlineGift, 
  HiOutlineBadgeCheck, 
  HiOutlineChatAlt, 
  HiOutlineHeart, 
  HiArrowRight, 
  HiCheckCircle, 
  HiSearch, 
  HiCalculator 
} from "react-icons/hi";

export default function Landing() {
  const navigate = useNavigate();

  // Search state for Points Checker
  const [searchQuery, setSearchQuery] = useState("");
  const [patientPointsData, setPatientPointsData] = useState(null);
  const [searchError, setSearchError] = useState("");

  // Points Calculator state
  const [billAmount, setBillAmount] = useState("");
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  // Live data states
  const [vouchers, setVouchers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    // Fetch live catalogs and ulasan from db.js
    setVouchers(db.getLoyaltyRewards().vouchers || []);
    setFeedbacks(db.getFeedbacks().slice(0, 3) || []);
    setTreatments(db.getTreatments() || []);
  }, []);

  // Point Checker Handler
  const handleCheckPoints = (e) => {
    e.preventDefault();
    setSearchError("");
    setPatientPointsData(null);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError("Silakan masukkan ID Pasien atau Nomor Telepon Anda.");
      return;
    }

    // Find patient in DB
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
      setSearchError("Data tidak ditemukan. Pastikan ID Pasien (contoh: PT-001) atau nomor telepon Anda benar.");
    }
  };

  // Calculator Handler
  const handleCalculate = (e) => {
    e.preventDefault();
    const amount = parseFloat(billAmount);
    if (isNaN(amount) || amount <= 0) {
      setCalculatedPoints(0);
      return;
    }
    // 1 Point = Rp 10.000 spent
    const points = Math.floor(amount / 10000);
    setCalculatedPoints(points);
  };

  // Scroll to Anchor helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getMembershipColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case "platinum": return "from-slate-700 to-slate-900 text-white border-slate-800 shadow-slate-900/10";
      case "gold": return "from-amber-400 to-yellow-600 text-white border-amber-500 shadow-amber-600/10";
      case "silver": return "from-slate-300 to-slate-500 text-white border-slate-400 shadow-slate-400/10";
      default: return "from-orange-400 to-amber-700 text-white border-orange-600 shadow-orange-700/10";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 selection:bg-blue-100 selection:text-blue-800">
      
      {/* PUBLIC HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg viewBox="0 0 64 80" fill="white" className="w-5 h-5">
              <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
            </svg>
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            Smile<span className="text-blue-600">Dental</span>
          </span>
        </div>

        {/* Public Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500">
          <button onClick={() => scrollToSection("layanan")} className="hover:text-blue-600 transition-colors cursor-pointer">Layanan</button>
          <button onClick={() => scrollToSection("membership")} className="hover:text-blue-600 transition-colors cursor-pointer">Membership</button>
          <button onClick={() => scrollToSection("point-checker")} className="hover:text-blue-600 transition-colors cursor-pointer">Cek Poin</button>
          <button onClick={() => scrollToSection("vouchers")} className="hover:text-blue-600 transition-colors cursor-pointer">Katalog Reward</button>
          <button onClick={() => scrollToSection("testimoni")} className="hover:text-blue-600 transition-colors cursor-pointer">Ulasan Pasien</button>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
              Portal Staff
            </Button>
          </Link>
          <button onClick={() => scrollToSection("point-checker")} className="cursor-pointer">
            <Button size="sm" className="text-xs font-bold shadow-md shadow-blue-500/10">
              Cek Poin Saya
            </Button>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 py-16 px-6 md:py-24">
        {/* Floating circles blur */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-0 px-3 py-1 font-bold tracking-wide text-[10px] uppercase">
              ✨ Klinik Estetika & Restorasi Gigi Modern
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Senyum Sehat Menawan, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Penuh Apresiasi Poin
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-xl leading-relaxed mx-auto lg:mx-0">
              SmileDental menghadirkan perawatan gigi spesialis berteknologi mutakhir terintegrasi dengan program CRM loyalitas. Dapatkan poin tiap kali checkup, kumpulkan voucher diskon, dan nikmati privilese membership eksklusif.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button onClick={() => scrollToSection("point-checker")} className="cursor-pointer">
                <Button size="lg" className="flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
                  Cek Poin Loyalitas <HiArrowRight />
                </Button>
              </button>
              <button onClick={() => scrollToSection("layanan")} className="cursor-pointer">
                <Button variant="outline" size="lg" className="font-bold border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
                  Lihat Katalog Layanan
                </Button>
              </button>
            </div>
          </div>

          {/* Right Cards Showcase */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            {/* Quick stats floating card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 hover:translate-y-[-4px] transition-transform">
              <span className="text-2xl">🏆</span>
              <h4 className="font-black text-slate-800 text-sm">Privilese Member</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Diskon perawatan hingga 15% untuk member Gold & Platinum.</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 mt-6 hover:translate-y-[-4px] transition-transform">
              <span className="text-2xl">🎁</span>
              <h4 className="font-black text-slate-800 text-sm">Loyalty Points</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Poin berlipat tiap transaksi scaling, behel, dan whitening gigi.</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 hover:translate-y-[-4px] transition-transform">
              <span className="text-2xl">⭐</span>
              <h4 className="font-black text-slate-800 text-sm">Sistem Kepuasan</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Ulasan Anda membantu kami meningkatkan mutu penanganan spesialis.</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 mt-6 hover:translate-y-[-4px] transition-transform">
              <span className="text-2xl">🩺</span>
              <h4 className="font-black text-slate-800 text-sm">Dokter Spesialis</h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Diarsiteki oleh tim Endodontis, Ortodontis, & Bedah Mulut berpengalaman.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DENTAL LAYANAN / TREATMENT CATALOG */}
      <section id="layanan" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-0">Katalog Treatment</Badge>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Layanan & Harga Transparan</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tarif perawatan gigi terbaik terdaftar resmi di kasir</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {treatments.slice(0, 3).map((tr, idx) => (
            <Card key={idx} className="rounded-3xl border-slate-200/60 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md tracking-wider uppercase inline-block mb-3 w-fit">
                  {tr.category}
                </span>
                <CardTitle className="text-base font-extrabold text-slate-800">{tr.name}</CardTitle>
                <CardDescription className="text-xs text-slate-400 leading-relaxed font-semibold mt-1.5">{tr.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Tarif Mulai</span>
                  <span className="text-xl font-black text-slate-900">Rp {tr.price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <span>⏱️</span> Durasi: {tr.duration}
                </div>
                <button 
                  onClick={() => alert(`Silakan hubungi admin kasir via WhatsApp atau datang langsung ke klinik untuk reservasi jadwal layanan "${tr.name}"!`)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer mt-2"
                >
                  Jadwalkan Konsultasi <HiArrowRight />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* MEMBERSHIP TIERS SECTION */}
      <section id="membership" className="bg-slate-100/50 py-20 px-6 border-y border-slate-200/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-100 border-0">Program CRM Membership</Badge>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Tingkatan Keanggotaan Member</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Semakin aktif checkup gigi, semakin banyak privilese yang didapatkan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                tier: "Bronze",
                range: "0 - 749 Poin",
                disc: "Free Consultation",
                perks: ["1 Poin tiap transaksi Rp 10.000", "Layanan Checkup berkala", "Edukasi kesehatan gigi gratis"]
              },
              {
                tier: "Silver",
                range: "750 - 1.099 Poin",
                disc: "Diskon Perawatan 5%",
                perks: ["Seluruh benefit member Bronze", "Prioritas konfirmasi antrean", "Diskon 5% untuk tambal gigi", "Voucher ulang tahun"]
              },
              {
                tier: "Gold",
                range: "1.100 - 2.499 Poin",
                disc: "Diskon Perawatan 10%",
                perks: ["Seluruh benefit member Silver", "Diskon 10% scaling & bleaching", "Jalur antrean khusus klinik", "Voucher gift set eksklusif"]
              },
              {
                tier: "Platinum",
                range: "2.500+ Poin",
                disc: "Diskon Perawatan 15%",
                perks: ["Seluruh benefit member Gold", "Diskon 15% seluruh tindakan gigi", "Bebas antrean resepsionis", "Dokter gigi spesialis pilihan", "Hadiah akhir tahun"]
              }
            ].map((m, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-6 space-y-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${getMembershipColor(m.tier)} space-y-1.5 shadow-md`}>
                    <h4 className="text-lg font-black tracking-tight">{m.tier} Member</h4>
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider block">{m.range}</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Benefit Utama</span>
                    <p className="text-xs font-black text-blue-600">{m.disc}</p>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {m.perks.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 font-semibold text-[11px] leading-relaxed">
                        <HiCheckCircle className="text-blue-600 text-sm shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POINT CHECKER & CALCULATOR (INTERACTIVE!) */}
      <section id="point-checker" className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT CARD: Live Points Balance Checker */}
        <Card className="rounded-[24px] border-slate-200/60 shadow-md p-6 space-y-6">
          <CardHeader className="p-0 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><HiSearch /></div>
              <CardTitle className="text-base font-extrabold text-slate-800">Check Loyalty Points Balance</CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-400 font-semibold leading-relaxed">Pasien SmileDental dapat memeriksa saldo poin loyalitas dan status membership live.</CardDescription>
          </CardHeader>

          {/* Form */}
          <form onSubmit={handleCheckPoints} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">ID Pasien atau No. Telepon</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: PT-001 atau 08123456789"
                  className="flex-1 text-xs font-semibold px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
                <Button type="submit" className="font-bold shrink-0 cursor-pointer">Cari Data</Button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {searchError && (
            <div className="bg-red-50 border border-red-200/50 text-red-600 text-xs px-4 py-3.5 rounded-xl font-semibold leading-relaxed flex items-start gap-2 animate-in fade-in duration-200">
              <span>⚠️</span>
              <span>{searchError}</span>
            </div>
          )}

          {/* Points Results Display Card */}
          {patientPointsData && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100 rounded-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-blue-100/50 pb-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nama Pasien</span>
                  <h4 className="font-extrabold text-slate-800 text-sm">{patientPointsData.name}</h4>
                </div>
                <Badge variant="outline" className="text-[9px] font-bold tracking-wider uppercase bg-white border-blue-200 text-blue-600">
                  {patientPointsData.id}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Membership Tier</span>
                  <span className="text-xs font-black text-slate-700">{patientPointsData.level} Member</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Kota Asal</span>
                  <span className="text-xs font-semibold text-slate-700">{patientPointsData.city || "Jakarta"}</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm/5">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Sisa Saldo Poin</span>
                  <h5 className="text-xl font-black text-blue-600">{patientPointsData.balance} Poin</h5>
                </div>
                <span className="text-2xl">🎁</span>
              </div>
            </div>
          )}
        </Card>

        {/* RIGHT CARD: Points Earning Simulator Calculator */}
        <Card className="rounded-[24px] border-slate-200/60 shadow-md p-6 space-y-6">
          <CardHeader className="p-0 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center"><HiCalculator /></div>
              <CardTitle className="text-base font-extrabold text-slate-800">Kalkulator Simulasi Perolehan Poin</CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-400 font-semibold leading-relaxed">Simulasikan berapa banyak poin loyalitas yang akan Anda kumpulkan berdasarkan rencana tagihan perawatan Anda.</CardDescription>
          </CardHeader>

          {/* Form */}
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Estimasi Tagihan Pembayaran (Rupiah)</label>
              <input
                type="number"
                required
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="Contoh: 1500000"
                className="w-full text-xs font-semibold px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors mb-3"
              />
              <Button type="submit" className="w-full font-bold bg-indigo-600 hover:bg-indigo-700 shrink-0 cursor-pointer">Hitung Estimasi Poin</Button>
            </div>
          </form>

          {/* Simulator Result */}
          {calculatedPoints > 0 ? (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between animate-in zoom-in-95 duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estimasi Perolehan Poin</span>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">Dengan transaksi Rp {parseFloat(billAmount).toLocaleString("id-ID")}, Anda akan mengumpulkan:</p>
                <h4 className="text-lg font-black text-indigo-600">{calculatedPoints} Poin Reward</h4>
              </div>
              <span className="text-3xl">⭐</span>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/50 text-slate-400 text-xs px-4 py-3.5 rounded-xl font-bold italic text-center">
              Masukkan nominal tagihan transaksi untuk melihat hasil hitung poin.
            </div>
          )}
        </Card>
      </section>

      {/* REWARDS CATALOG / ACTIVE VOUCHERS */}
      <section id="vouchers" className="bg-slate-100/50 py-20 px-6 border-y border-slate-200/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-0">Katalog Voucher Reward</Badge>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Gunakan Poin untuk Tukarkan Reward</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Voucher diskon menarik yang siap diklaim di resepsionis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vouchers.map((v, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                {/* Coupon border effect */}
                <div className="absolute top-1/2 left-0 w-4 h-8 bg-[#F8FAFC] border-r border-slate-200/60 rounded-r-full -translate-y-1/2 z-10" />
                <div className="absolute top-1/2 right-0 w-4 h-8 bg-[#F8FAFC] border-l border-slate-200/60 rounded-l-full -translate-y-1/2 z-10" />
                
                <div className="p-6 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {v.code}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{v.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Dapat digunakan untuk satu kali transaksi kasir pendaftaran layanan.</p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-4 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Poin Butuh</span>
                    <span className="text-sm font-extrabold text-emerald-600">{v.pointsRequired} Poin</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDBACKS & REVIEW TESTIMONIALS */}
      <section id="testimoni" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-0">Review Pasien</Badge>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Ulasan Kepuasan Layanan Pasien</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Testimoni tulus langsung dari database rekam ulasan kasir</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.map((fb, idx) => (
            <Card key={idx} className="rounded-3xl border-slate-200/60 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="p-0 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-2">
                  <Rating value={fb.rating} readOnly />
                  <p className="text-xs text-slate-600 italic font-semibold leading-relaxed">
                    "{fb.comment}"
                  </p>
                </div>
                
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs">{fb.patientName}</h5>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Perawatan drg. {fb.doctorName?.split(". ")[1] || "Rina"}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{fb.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PUBLIC FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Logo Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/10">
                <svg viewBox="0 0 64 80" fill="white" className="w-4 h-4">
                  <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
                </svg>
              </div>
              <span className="font-black text-sm tracking-tight text-white">
                Smile<span className="text-blue-500">Dental</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Klinik kesehatan & estetika gigi modern berbasis CRM yang berfokus memberikan pelayanan premium serta apresiasi poin loyalitas bagi pasien kami secara berkelanjutan.
            </p>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-white text-xs font-black uppercase tracking-wider">Navigasi Publik</h5>
            <ul className="space-y-2 text-[11px] font-semibold">
              <li><button onClick={() => scrollToSection("layanan")} className="hover:text-white transition-colors cursor-pointer">Katalog Perawatan</button></li>
              <li><button onClick={() => scrollToSection("membership")} className="hover:text-white transition-colors cursor-pointer">Membership Benefit</button></li>
              <li><button onClick={() => scrollToSection("point-checker")} className="hover:text-white transition-colors cursor-pointer">Points Balance Checker</button></li>
              <li><button onClick={() => scrollToSection("vouchers")} className="hover:text-white transition-colors cursor-pointer">Katalog Reward Voucher</button></li>
            </ul>
          </div>

          {/* Location Info */}
          <div className="md:col-span-4 space-y-3 text-[11px]">
            <h5 className="text-white text-xs font-black uppercase tracking-wider">Klinik Operasional</h5>
            <p className="font-semibold text-slate-500">
              📍 Jl. Sudirman Kavling 21 No. 4, Kebayoran Baru, Jakarta Selatan, 12190
            </p>
            <p className="font-semibold text-slate-500">
              🕒 Senin - Sabtu: 09.00 - 20.00 WIB <br />
              🚫 Minggu & Hari Libur: Tutup
            </p>
            <p className="font-semibold text-slate-500">
              📞 WhatsApp Hotline: +62 812-3456-7890
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} SmileDental CRM Clinic Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white transition-colors">Portal Login Admin</Link>
            <Link to="/register" className="hover:text-white transition-colors">Pendaftaran Staff</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
