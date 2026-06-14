import React from "react";

export function ImageCard({ 
  fallbackText, 
  title, 
  subtitle, 
  badge, 
  onClick, 
  className = "" 
}) {
  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden bg-white border border-slate-200 rounded-[20px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* Decorative colored grid pattern or color blocks */}
      <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 relative flex items-center justify-center">
        {badge && (
          <span className="absolute top-3 right-3 text-[9px] font-black tracking-wider uppercase bg-white/20 text-white border border-white/20 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        
        {/* Large Floating fallback avatar */}
        <div className="absolute -bottom-8 w-16 h-16 rounded-[16px] bg-white text-blue-600 border border-slate-100 shadow-md flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform duration-200">
          {fallbackText}
        </div>
      </div>

      <div className="pt-10 pb-5 px-5 text-center space-y-1">
        <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h4>
        {subtitle && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
