import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../data/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let emailToAuth = dataForm.email.trim();

      // Lookup email by username if input is not an email
      if (!emailToAuth.includes("@")) {
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", emailToAuth)
          .maybeSingle();

        if (profileErr) {
          throw new Error("Gagal memproses username: " + profileErr.message);
        }

        if (profile && profile.email) {
          emailToAuth = profile.email;
        } else {
          throw new Error("Username atau Email tidak ditemukan.");
        }
      }

      // Login to Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: dataForm.password,
      });

      if (authError) {
        throw authError;
      }

      // Fetch user profile from profiles table
      const { data: userProfile, error: profileFetchErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileFetchErr) {
        throw new Error("Gagal mengambil data profil: " + profileFetchErr.message);
      }

      const sessionUser = {
        id: data.user.id,
        email: data.user.email,
        name: userProfile?.name || data.user.user_metadata?.name || "Staff",
        username: userProfile?.username || data.user.user_metadata?.username || data.user.email.split("@")[0],
        role: userProfile?.role || data.user.user_metadata?.role || "Staff",
        permissions: userProfile?.permissions || ["READ_PATIENTS", "READ_TRANSACTIONS"],
        status: userProfile?.status || "Aktif",
      };

      if (sessionUser.status !== "Aktif") {
        await supabase.auth.signOut();
        throw new Error("Akun Anda telah dinonaktifkan. Silakan hubungi admin.");
      }

      localStorage.setItem("user", JSON.stringify(sessionUser));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Username/Email atau kata sandi salah");
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
            fontSize: "0.72rem", fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase", color: "#1769b0",
          }}
        >
          <span style={{ display: "inline-block", width: 18, height: 1.5, background: "#1769b0" }} />
          Portal Admin
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', serif", fontSize: "2.2rem",
            fontWeight: 300, color: "#0a2540", lineHeight: 1.15, letterSpacing: "-0.02em",
          }}
        >
          Selamat datang<br />
          <em style={{ color: "#1769b0", fontStyle: "italic" }}>kembali</em>
        </h2>
        <p style={{ marginTop: "0.6rem", fontSize: "0.88rem", color: "#6b7f94", lineHeight: 1.65 }}>
          Masukkan detail akun Anda untuk melanjutkan.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "#fff0f0", border: "1.5px solid #fcc",
            color: "#c0392b",
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Username */}
        <div>
          <label
            className="block mb-1.5"
            style={{ fontSize: "0.8rem", fontWeight: 500, color: "#0a2540", letterSpacing: "0.01em" }}
          >
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              required
              placeholder="Masukkan username"
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
              viewBox="0 0 24 24" fill="none" stroke="#b0c4d8" strokeWidth="1.8"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              style={{ fontSize: "0.8rem", fontWeight: 500, color: "#0a2540", letterSpacing: "0.01em" }}
            >
              Kata Sandi
            </label>
            <Link
              to="/forgot"
              style={{ fontSize: "0.78rem", color: "#1769b0", fontWeight: 500, textDecoration: "none" }}
            >
              Lupa kata sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
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
              viewBox="0 0 24 24" fill="none" stroke="#b0c4d8" strokeWidth="1.8"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl text-base font-medium text-white transition-all duration-200"
            style={{
              padding: "13px",
              background: loading ? "#7aabd4" : "#1769b0",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Geist', sans-serif",
              fontSize: "0.95rem",
              boxShadow: loading ? "none" : "0 4px 16px rgba(23,105,176,0.3)",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = "#1258a0"; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = "#1769b0"; }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  style={{ width: 18, height: 18 }}
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 17, height: 17 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Masuk
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center" style={{ fontSize: "0.84rem", color: "#7a93a8" }}>
        Belum punya akun?{" "}
        <Link
          to="/register"
          style={{ color: "#1769b0", fontWeight: 500, textDecoration: "none" }}
        >
          Daftar di sini
        </Link>
      </div>

    </div>
  );
}