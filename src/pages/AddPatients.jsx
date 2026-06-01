import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  HiUser, 
  HiPhone, 
  HiLocationMarker, 
  HiCalendar, 
  HiArrowLeft,
  HiExclamationCircle,
  HiMail,
  HiBadgeCheck
} from "react-icons/hi";

export default function AddPatients() {
  const navigate = useNavigate();
  const location = useLocation();

  // Restore state if returning from preview
  const [form, setForm] = useState(location.state || {
    name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
    address: "",
    city: "Jakarta",
    membershipLevel: "Bronze",
    complaint: "",
    status: "Aktif",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.gender || !form.age) {
      setError("Nama Lengkap, Jenis Kelamin, dan Umur wajib diisi!");
      return;
    }

    // Go to preview step instead of saving directly
    navigate("/patients/add/preview", { state: form });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/patients")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors w-fit"
        >
          <HiArrowLeft className="text-base" />
          Kembali ke Daftar Pasien
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* HEADER */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900">Registrasi Pasien Baru</h1>
            <p className="text-xs text-slate-500 mt-1">
              Lengkapi formulir di bawah ini untuk didaftarkan ke sistem rekam medis SmileDental.
            </p>
          </div>

          <div className="p-8">
            {/* ERROR BANNER */}
            {error && (
              <div className="mb-6 flex items-center gap-3 bg-rose-50 text-rose-600 px-4 py-3 rounded-xl border border-rose-100 text-sm font-medium">
                <HiExclamationCircle className="text-lg shrink-0" />
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nama Lengkap */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Masukkan nama lengkap pasien"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                  >
                    <option value="" disabled>Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Umur */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Umur (Tahun) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="number"
                      name="age"
                      placeholder="Contoh: 25"
                      min="0"
                      value={form.age}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* No HP */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Nomor HP</label>
                  <div className="relative">
                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Contoh: 08123456789"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Email Pasien</label>
                  <div className="relative">
                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="email"
                      name="email"
                      placeholder="contoh: pasien@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Membership Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Membership Loyalty</label>
                  <select
                    name="membershipLevel"
                    value={form.membershipLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                  >
                    <option value="Bronze">Bronze (Diskon 0%)</option>
                    <option value="Silver">Silver (Diskon 5%)</option>
                    <option value="Gold">Gold (Diskon 10%)</option>
                    <option value="Platinum">Platinum (Diskon 15%)</option>
                  </select>
                </div>

                {/* Kota */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Kota Domisili</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Contoh: Jakarta"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                  />
                </div>

                {/* Keluhan Utama */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Keluhan Utama</label>
                  <input
                    type="text"
                    name="complaint"
                    placeholder="Contoh: Cabut gigi bungsu, Scaling, dsb."
                    value={form.complaint}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                  />
                </div>

                {/* Alamat */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Alamat Lengkap</label>
                  <div className="relative">
                    <HiLocationMarker className="absolute left-4 top-4 text-slate-400 text-lg" />
                    <textarea
                      name="address"
                      rows="3"
                      placeholder="Masukkan alamat lengkap pasien..."
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/patients")}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Lanjut ke Pratinjau
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}