import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 font-sans"
      style={{ background: "#f0f7ff", fontFamily: "'Geist', sans-serif" }}
    >
      <div className="w-full max-w-[520px] mx-auto">

        {/* Top Bar: Logo + Step Indicator */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#1769b0" }}
            >
              <svg viewBox="0 0 64 80" fill="white" style={{ width: 20, height: 20 }}>
                <path d="M32 4C18 4 8 14 8 26c0 6 2 12 4 18l4 28c1 3 3 4 6 4s5-2 6-5l4-16 4 16c1 3 3 5 6 5s5-1 6-4l4-28c2-6 4-12 4-18C56 14 46 4 32 4z"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.15rem", color: "#0a2540" }}>
              Smile<span style={{ color: "#1769b0" }}>Dental</span>
            </span>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {[true, false, false].map((active, i) => (
              <div key={i} style={{
                width: active ? 22 : 8, height: 8,
                borderRadius: active ? 4 : "50%",
                background: active ? "#1769b0" : "#d0e6fa",
                transition: "all 0.2s"
              }} />
            ))}
          </div>
        </div>

        {/* Hero Text */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3"
            style={{ fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#1769b0" }}>
            <span style={{ display: "inline-block", width: 18, height: 1.5, background: "#1769b0" }} />
            Portal Admin
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2.6rem", fontWeight: 300,
            color: "#0a2540", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Selamat Datang <br/>
            <em style={{ color: "#1769b0", fontStyle: "italic" }}>Klink Smile Dental</em>
          </h1>
          <p style={{ marginTop: "0.8rem", fontSize: "0.88rem", color: "#6b7f94", lineHeight: 1.65 }}>
            Daftar sekali, kelola seluruh operasional klinik dari satu tempat yang aman.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl p-9"
          style={{ background: "#fff", boxShadow: "0 2px 4px rgba(10,37,64,0.04), 0 12px 40px rgba(10,37,64,0.08)",
            border: "1px solid rgba(10,37,64,0.06)" }}>
          <Outlet />

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div style={{ flex: 1, height: 1, background: "#e8f0f8" }} />
            <span style={{ fontSize: "0.75rem", color: "#9bb5cf", whiteSpace: "nowrap" }}>atau masuk dengan</span>
            <div style={{ flex: 1, height: 1, background: "#e8f0f8" }} />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-2.5">
            {["Google", "Microsoft"].map((name) => (
              <button key={name} style={{
                flex: 1, padding: "10px", border: "1.5px solid #dce8f5",
                borderRadius: 10, background: "#f8fbff", fontSize: "0.82rem",
                color: "#3d5a73", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: 7,
                fontFamily: "'Geist', sans-serif"
              }}>
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-7" style={{ fontSize: "0.84rem", color: "#7a93a8" }}>
          Sudah punya akun?{" "}
          <a href="/login" style={{ color: "#1769b0", fontWeight: 500, textDecoration: "none" }}>
            Masuk di sini
          </a>
        </p>

        {/* Trust Pills */}
        <div className="flex gap-2 justify-center mt-5 flex-wrap">
          {["Data Dienkripsi", "Terverifikasi", "Backup Otomatis"].map((label) => (
            <span key={label} style={{
              padding: "5px 12px", borderRadius: 999,
              background: "#e8f2fc", fontSize: "0.72rem",
              color: "#1769b0", fontWeight: 500
            }}>
              {label}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}