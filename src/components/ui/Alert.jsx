import React from "react";

export function Alert({ children, variant = "default", className = "", ...props }) {
  const variants = {
    default: "bg-slate-50 text-slate-800 border-slate-200",
    destructive: "bg-red-50 text-red-700 border-red-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-2xl border p-4 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = "", ...props }) {
  return (
    <h5 className={`font-bold tracking-tight mb-1 text-sm ${className}`} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className = "", ...props }) {
  return (
    <div className={`text-slate-500 font-medium leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
}
