import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../data/supabaseClient";
import { db } from "../../data/db";

export default function Register() {
  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "Member", // Default role
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { name, username, email, phone, role, password, confirmPassword } = dataForm;

    // Validation
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      setLoading(false);
      return;
    }

    if (username.includes(" ")) {
      setError("Username tidak boleh mengandung spasi.");
      setLoading(false);
      return;
    }

    try {
      // Clean username (lowercase, remove @ if typed)
      const cleanUsername = username.replace("@", "").toLowerCase().trim();

      // Check if username is already taken in profiles table
      const { data: existingUser, error: checkErr } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (checkErr) {
        throw new Error("Gagal memeriksa ketersediaan username: " + checkErr.message);
      }

      if (existingUser) {
        throw new Error("Username sudah terdaftar, silakan pilih username lain.");
      }

      // Execute Supabase Auth Signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name.trim(),
            username: cleanUsername,
            role: role,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If registered as a Member, sync to our local database (db.js)
      if (role === "Member") {
        const patients = db.getPatients();
        const existingPatient = patients.find(p => p.email === email.trim() || p.phone === phone.trim());
        
        if (!existingPatient) {
          const nextId = "PT-" + String(patients.length + 1).padStart(3, "0");
          const newPatient = {
            id: nextId,
            name: name.trim(),
            gender: "Laki-laki", // Default placeholder
            age: 25,
            phone: phone.trim() || "08123456789",
            email: email.trim(),
            address: "Jl. Pendaftaran Online",
            city: "Jakarta",
            registeredDate: new Date().toISOString().split("T")[0],
            membershipStatus: "Aktif",
            membershipLevel: "Bronze",
            complaint: "Pendaftaran Online",
            status: "Aktif",
            adminNotes: "Registrasi online melalui portal member.",
            history: [],
            complaints: [],
            feedbacks: []
          };
          db.savePatient(newPatient);

          // Seed welcome points: 150 points for signing up
          const loyalty = db.getLoyaltyRewards();
          loyalty.points.push({
            patientId: nextId,
            patientName: name.trim(),
            balance: 150,
            tier: "Bronze"
          });
          db.saveLoyaltyRewards(loyalty);

          // Save activity
          db.saveCustomerActivity({
            id: "ACT-" + String(db.getCustomerActivities().length + 1).padStart(3, "0"),
            patientName: name.trim(),
            action: "Pendaftaran Member",
            detail: "Mendaftar mandiri via portal dan mendapatkan bonus awal 150 Poin",
            time: new Date().toISOString()
          });
        }
      }

      setSuccess("Pendaftaran berhasil! Anda akan segera diarahkan ke halaman login.");
      setDataForm({
        name: "",
        username: "",
        email: "",
        phone: "",
        role: "Member",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
        style={{ background: "#d6f0ea", color: "#00B074" }}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        SmileDental CRM
      </div>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: "#0d3557" }}>
          Daftar{" "}
          <span className="italic" style={{ color: "#3b82f6" }}>Sekarang</span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#7a93a8" }}>
          Pilih peran Anda dan buat akun untuk mengakses platform.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #bde0f7, transparent)" }} />

      {/* Notification Messages */}
      {error && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
          style={{ background: "#fff0f0", border: "1.5px solid #fcc", color: "#c0392b" }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
          style={{ background: "#eefbf7", border: "1.5px solid #ccefe6", color: "#27ae60" }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: "#3d5c73" }}>
            Peran Pendaftaran
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDataForm({ ...dataForm, role: "Member" })}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                dataForm.role === "Member"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Pasien (Member)
            </button>
            <button
              type="button"
              onClick={() => setDataForm({ ...dataForm, role: "Staff" })}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                dataForm.role === "Staff"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Staf Klinik (Staff)
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#3d5c73" }}>
            Nama Lengkap
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={dataForm.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap Anda"
              className="appearance-none block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557", outline: "none" }}
              onFocus={e => {
                e.target.style.borderColor = "#2a8fd4";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(42,143,212,0.12)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#c8d6e3";
                e.target.style.background = "#f5f8fc";
                e.target.style.boxShadow = "none";
              }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#c8d6e3" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#3d5c73" }}>
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={dataForm.username}
              onChange={handleChange}
              required
              placeholder="Contoh: andi_member"
              className="appearance-none block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557", outline: "none" }}
              onFocus={e => {
                e.target.style.borderColor = "#2a8fd4";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(42,143,212,0.12)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#c8d6e3";
                e.target.style.background = "#f5f8fc";
                e.target.style.boxShadow = "none";
              }}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">@</span>
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#3d5c73" }}>
            Nomor Telepon
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={dataForm.phone}
              onChange={handleChange}
              required
              placeholder="Contoh: 08123456789"
              className="appearance-none block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557", outline: "none" }}
              onFocus={e => {
                e.target.style.borderColor = "#2a8fd4";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(42,143,212,0.12)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#c8d6e3";
                e.target.style.background = "#f5f8fc";
                e.target.style.boxShadow = "none";
              }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#c8d6e3" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#3d5c73" }}>
            Alamat Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              required
              placeholder="nama@email.com"
              className="appearance-none block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557", outline: "none" }}
              onFocus={e => {
                e.target.style.borderColor = "#2a8fd4";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(42,143,212,0.12)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#c8d6e3";
                e.target.style.background = "#f5f8fc";
                e.target.style.boxShadow = "none";
              }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#c8d6e3" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#3d5c73" }}>
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="appearance-none block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557", outline: "none" }}
              onFocus={e => {
                e.target.style.borderColor = "#2a8fd4";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(42,143,212,0.12)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#c8d6e3";
                e.target.style.background = "#f5f8fc";
                e.target.style.boxShadow = "none";
              }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#c8d6e3" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#3d5c73" }}>
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={dataForm.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="appearance-none block w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557", outline: "none" }}
              onFocus={e => {
                e.target.style.borderColor = "#2a8fd4";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(42,143,212,0.12)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#c8d6e3";
                e.target.style.background = "#f5f8fc";
                e.target.style.boxShadow = "none";
              }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#c8d6e3" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #00B074, #1a6faa)",
              boxShadow: "0 4px 16px rgba(0, 176, 116, 0.25)",
            }}
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center text-sm" style={{ color: "#7a93a8" }}>
        Sudah punya akun?{" "}
        <Link to="/login" className="font-semibold transition-colors" style={{ color: "#00B074" }}>
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}