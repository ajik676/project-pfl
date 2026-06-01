import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="w-full space-y-8">

      {/* Badge */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
        style={{ background: "#d6f0ea", color: "#3dba9e" }}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Klinik Gigi Terpercaya
      </div>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: "#0d3557" }}>
          Daftar{" "}
          <span className="italic" style={{ color: "#2a8fd4" }}>Sekarang</span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#7a93a8" }}>
          Buat akun untuk jadwalkan konsultasi & pantau kesehatan gigi Anda.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #bde0f7, transparent)" }} />

      {/* Form */}
      <form className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#3d5c73" }}>
            Alamat Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="dokter@contoh.com"
              className="appearance-none block w-full pl-10 pr-4 py-3.5 border rounded-xl text-sm transition-all duration-200"
              style={{
                borderColor: "#c8d6e3",
                background: "#f5f8fc",
                color: "#0d3557",
                outline: "none",
              }}
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
          <label className="block text-sm font-semibold mb-2" style={{ color: "#3d5c73" }}>
            Kata Sandi
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              className="appearance-none block w-full pl-10 pr-4 py-3.5 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557" }}
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
          <label className="block text-sm font-semibold mb-2" style={{ color: "#3d5c73" }}>
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              className="appearance-none block w-full pl-10 pr-4 py-3.5 border rounded-xl text-sm transition-all duration-200"
              style={{ borderColor: "#c8d6e3", background: "#f5f8fc", color: "#0d3557" }}
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
        <div className="pt-1">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-base font-semibold text-white transition-all duration-200 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #2a8fd4, #1a6faa)",
              boxShadow: "0 4px 16px rgba(42,143,212,0.35)",
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Daftar Sekarang
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center text-sm" style={{ color: "#7a93a8" }}>
        Sudah punya akun?{" "}
        <Link to="/login" className="font-semibold transition-colors" style={{ color: "#2a8fd4" }}>
          Masuk di sini
        </Link>
      </div>

    </div>
  );
}