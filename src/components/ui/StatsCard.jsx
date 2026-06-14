import React from "react";
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from "react-icons/hi";

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, // positive number or negative number (e.g. +12, -3)
  trendLabel, 
  variant = "default", // "default", "gradient-blue", "gradient-emerald"
  className = "" 
}) {
  const bgStyles = {
    default: "bg-white border border-slate-200/60 shadow-sm",
    "gradient-blue": "bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/10",
    "gradient-emerald": "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/10",
  };

  const textColors = {
    default: {
      title: "text-slate-400",
      value: "text-slate-800",
      description: "text-slate-500"
    },
    "gradient-blue": {
      title: "text-blue-100",
      value: "text-white",
      description: "text-blue-150"
    },
    "gradient-emerald": {
      title: "text-emerald-100",
      value: "text-white",
      description: "text-emerald-150"
    }
  };

  return (
    <div className={`p-5 rounded-[22px] transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between ${bgStyles[variant]} ${className}`}>
      <div className="space-y-1.5 flex-1 min-w-0">
        <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${textColors[variant].title}`}>{title}</p>
        <h4 className={`text-2xl font-black truncate leading-none ${textColors[variant].value}`}>{value}</h4>
        
        <div className="flex items-center gap-1.5 flex-wrap">
          {trend !== undefined && (
            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
              trend > 0 
                ? (variant === "default" ? "bg-emerald-50 text-emerald-600" : "bg-white/20 text-white") 
                : (variant === "default" ? "bg-rose-50 text-rose-600" : "bg-white/20 text-white")
            }`}>
              {trend > 0 ? <HiOutlineTrendingUp className="text-[10px]" /> : <HiOutlineTrendingDown className="text-[10px]" />}
              {trend > 0 ? `+${trend}` : trend}%
            </span>
          )}
          {description && (
            <span className={`text-[10px] font-semibold truncate ${textColors[variant].description}`}>
              {description}
            </span>
          )}
        </div>
      </div>
      
      {Icon && (
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-inner ml-4 ${
          variant === "default" 
            ? "bg-slate-50 text-slate-500 border border-slate-100" 
            : "bg-white/15 text-white"
        }`}>
          <Icon />
        </div>
      )}
    </div>
  );
}
