import React from "react";

export const Input = React.forwardRef(({ className = "", type = "text", error, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
          <Icon />
        </div>
      )}
      <input
        type={type}
        ref={ref}
        className={`w-full ${Icon ? "pl-10" : "px-3.5"} py-2.5 bg-slate-50 border ${
          error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
        } rounded-xl text-xs text-slate-700 font-semibold focus:bg-white focus:outline-none focus:ring-4 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-bold mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
