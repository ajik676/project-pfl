import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  HiUser, 
  HiCalendar, 
  HiClock, 
  HiIdentification, 
  HiClipboardList,
  HiArrowLeft,
  HiExclamationCircle,
  HiOutlineDocumentText
} from "react-icons/hi";

export default function AddSchedule() {
  const navigate = useNavigate();
  const location = useLocation();

  // Restore state if returning from preview
  const [form, setForm] = useState(location.state || {
    patientName: "",
    date: "",
    time: "",
    doctor: "",
    complaint: "",
    status: "Menunggu",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.patientName || !form.date || !form.time || !form.doctor) {
      setError("Nama pasien, tanggal, waktu, dan dokter gigi wajib diisi!");
      return;
    }

    // Go to preview step
    navigate("/schedule/add/preview", { state: form });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/schedule")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-xs transition-colors w-fit"
        >
          <HiArrowLeft className="text-base" />
          Kembali ke Daftar Jadwal
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* HEADER */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900">Buat Jadwal Baru</h1>
            <p className="text-xs text-slate-500 mt-1">
              Atur jadwal pertemuan pasien dengan dokter gigi yang bertugas.
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
                
                {/* Nama Pasien (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Nama Pasien <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="text"
                      name="patientName"
                      placeholder="Masukkan nama pasien"
                      value={form.patientName}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Tanggal Kunjungan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Waktu */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Waktu / Jam Kunjungan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Nama Dokter */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Dokter Gigi Bertugas <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HiIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="text"
                      name="doctor"
                      placeholder="Contoh: drg. Rina, drg. Budi"
                      value={form.doctor}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Status Awal</label>
                  <div className="relative">
                    <HiClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold appearance-none"
                    >
                      <option value="Menunggu">Menunggu (Antrean)</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                {/* Keluhan */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Keluhan / Tindakan</label>
                  <div className="relative">
                    <HiOutlineDocumentText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="text"
                      name="complaint"
                      placeholder="Contoh: Scaling, Tambal resin komposit, dsb."
                      value={form.complaint}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/schedule")}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Lanjut ke Pratinjauu
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}