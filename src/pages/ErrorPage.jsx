import { Link } from "react-router-dom";

export default function ErrorPage({
  code = "404",
  description = "Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.",
  image,
}) {
  const getTitle = () => {
    switch (String(code)) {
      case "404": return "Page Not Found";
      case "400": return "Bad Request";
      case "401": return "Unauthorized";
      case "403": return "Forbidden";
      case "500": return "Server Error";
      default: return "Something Went Wrong";
    }
  };

  return (
    <div className="flex relative items-center justify-center min-h-[80vh] px-6 overflow-hidden bg-[#f8fbff]">

      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative text-center max-w-md z-10 flex flex-col items-center">

        {/* IMAGE / CODE */}
        {image ? (
          <img
            src={image}
            alt={`error-${code}`}
            className="w-48 sm:w-56 object-contain mb-6"
          />
        ) : (
          <div className="relative mb-4">
            <h1 className="text-[6rem] sm:text-[8rem] font-black text-blue-500/10 leading-none">
              {code}
            </h1>
            <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl font-bold text-blue-700">
              {code}
            </div>
          </div>
        )}

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-2">
          {getTitle()}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        {/* BUTTON */}
        <Link
          to={localStorage.getItem("user") ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2 mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95 text-xs font-bold uppercase"
        >
          {localStorage.getItem("user") ? "← Kembali ke Dashboard" : "← Kembali ke Beranda"}
        </Link>

      </div>
    </div>
  );
}