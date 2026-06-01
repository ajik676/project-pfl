export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        
        {/* Efek Glow di Belakang Logo (Animasi Pulse) */}
        <div className="absolute top-2 w-16 h-16 bg-[#1258a0]/30 rounded-full blur-2xl animate-pulse"></div>

        {/* Logo BloomBites */}
        <img
          src="/img/logo2.png"
          alt="BloomBites Cafe"
          className="w-40 h-40 object-contain relative z-10 mb-6 drop-shadow-sm"
        />

        {/* Spinner Elegan (Dua lapis border) */}
        <div className="relative w-10 h-10 mb-5">
          {/* Track / Lingkaran background abu-abu pudar */}
          <div className="absolute inset-0 border-[3px] border-gray-100 rounded-full"></div>
          {/* Spinner hijau yang berputar */}
          <div className="absolute inset-0 border-[3px] border-[#1258a0] border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Teks Loading */}
        <p className="text-[#2c3619] font-semibold tracking-wide text-lg">
          Brewing your workspace...
        </p>
        <p className="text-sm text-gray-500 font-light mt-1.5 animate-pulse">
          Please wait a moment
        </p>
        
      </div>
    </div>
  );
}