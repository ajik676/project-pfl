import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../data/supabaseClient";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + "/login", // Redirect back to login after resetting
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess("Tautan reset kata sandi telah dikirim! Silakan periksa kotak masuk email Anda.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Gagal mengirimkan tautan reset kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <div
          className="flex items-center gap-2 mb-3"
          style={{
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#1769b0",
          }}
        >
          <span style={{ display: "inline-block", width: 18, height: 1.5, background: "#1769b0" }} />
          Keamanan Akun
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "2.2rem",
            fontWeight: 300,
            color: "#0a2540",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Lupa kata<br />
          <em style={{ color: "#1769b0", fontStyle: "italic" }}>sandi?</em>
        </h2>
        <p style={{ marginTop: "0.6rem", fontSize: "0.88rem", color: "#6b7f94", lineHeight: 1.65 }}>
          Tenang saja — masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
        </p>
      </div>

      {/* Info Box */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
        style={{ background: "#e8f2fc", border: "1.5px solid #bdd8f5" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1769b0"
          strokeWidth="1.8"
          style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p style={{ fontSize: "0.82rem", color: "#1769b0", lineHeight: 1.6 }}>
          Tautan reset akan dikirim ke email terdaftar dan berlaku selama <strong>15 menit</strong>.
        </p>
      </div>

      {/* Status Messages */}
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
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-1.5"
            style={{ fontSize: "0.8rem", fontWeight: 500, color: "#0a2540", letterSpacing: "0.01em" }}
          >
            Alamat Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@klinik.com"
              className="appearance-none block w-full rounded-xl text-sm transition-all duration-200"
              style={{
                padding: "11px 14px 11px 38px",
                border: "1.5px solid #dce8f5",
                background: "#f8fbff",
                color: "#0a2540",
                outline: "none",
                fontFamily: "'Geist', sans-serif",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#1769b0";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(23,105,176,0.1)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dce8f5";
                e.target.style.background = "#f8fbff";
                e.target.style.boxShadow = "none";
              }}
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b0c4d8"
              strokeWidth="1.8"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl text-white transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
            style={{
              padding: "13px",
              background: "#1769b0",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Geist', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 500,
              boxShadow: "0 4px 16px rgba(23,105,176,0.3)",
            }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background = "#1258a0"; }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.background = "#1769b0"; }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {loading ? "Mengirim..." : "Kirim Tautan Reset"}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div style={{ flex: 1, height: 1, background: "#e8f0f8" }} />
        <span style={{ fontSize: "0.75rem", color: "#9bb5cf" }}>atau</span>
        <div style={{ flex: 1, height: 1, background: "#e8f0f8" }} />
      </div>

      {/* Back to Login */}
      <Link
        to="/login"
        className="w-full flex items-center justify-center gap-2 rounded-xl transition-all duration-200 text-center"
        style={{
          display: "flex",
          padding: "12px",
          border: "1.5px solid #dce8f5",
          background: "#f8fbff",
          color: "#1769b0",
          fontFamily: "'Geist', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 500,
          textDecoration: "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#1769b0";
          e.currentTarget.style.background = "#fff";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#dce8f5";
          e.currentTarget.style.background = "#f8fbff";
        }}
      >
        Kembali ke Login
      </Link>
    </div>
  );
}