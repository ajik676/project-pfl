import React from "react";

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100",
    destructive: "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-100",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    ghost: "hover:bg-slate-100 text-slate-700",
    link: "text-blue-600 hover:underline bg-transparent !p-0 !ring-0 !scale-100",
  };

  const sizes = {
    default: "px-4 py-2.5 text-[13px]",
    sm: "px-3 py-1.5 text-xs rounded-lg",
    lg: "px-6 py-3 text-sm rounded-2xl",
    icon: "h-10 w-10 p-0 text-lg rounded-xl",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
