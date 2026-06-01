import React from "react";
import { HiOutlineCalendar } from "react-icons/hi";

export function DatePicker({ value, onChange, error, className = "", ...props }) {
  return (
    <div className="relative w-full">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
        <HiOutlineCalendar />
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
          error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
        } rounded-xl text-xs text-slate-700 font-semibold focus:bg-white focus:outline-none focus:ring-4 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-bold mt-1">{error}</p>}
    </div>
  );
}
