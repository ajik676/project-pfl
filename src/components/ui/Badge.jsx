import React from "react";

export function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors";

  const variants = {
    default: "bg-blue-600 text-white",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200/50",
    destructive: "bg-red-50 text-red-600 border border-red-100",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border border-amber-100",
    info: "bg-sky-50 text-sky-600 border border-sky-100",
    outline: "text-slate-700 border border-slate-300",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
