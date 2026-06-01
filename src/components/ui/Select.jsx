import React from "react";

export const Select = React.forwardRef(({ children, className = "", error, ...props }, ref) => {
  return (
    <div className="w-full relative">
      <select
        ref={ref}
        className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
          error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
        } rounded-xl text-xs text-slate-700 font-semibold focus:bg-white focus:outline-none focus:ring-4 transition-all appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
      {/* Custom dropdown arrow indicator */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold mt-1">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";
