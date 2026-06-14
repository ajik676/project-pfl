import React from "react";

export function Timeline({ children, className = "" }) {
  return (
    <div className={`relative border-l border-slate-200 ml-3.5 pl-6 space-y-5 ${className}`}>
      {children}
    </div>
  );
}

export function TimelineItem({ 
  title, 
  time, 
  description, 
  icon: Icon, 
  isActive = false, 
  className = "" 
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline bullet dot */}
      <span className={`absolute -left-[31px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 transition-all ${
        isActive 
          ? "bg-blue-600 border-white shadow-md shadow-blue-600/25 ring-4 ring-blue-50" 
          : "bg-white border-slate-300"
      }`}>
        {Icon ? (
          <span className={`text-[9px] ${isActive ? "text-white" : "text-slate-400"}`}>{Icon}</span>
        ) : (
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-white" : "bg-slate-300"}`} />
        )}
      </span>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <h5 className="text-xs font-bold text-slate-800 leading-tight">{title}</h5>
          {time && <span className="text-[10px] text-slate-400 font-semibold shrink-0">{time}</span>}
        </div>
        {description && (
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
