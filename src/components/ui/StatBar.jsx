import React from "react";

export function StatBar({ 
  label, 
  value, 
  percentage, 
  colorClass = "bg-blue-600", 
  className = "" 
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
        <span className="truncate">{label}</span>
        <span className="text-slate-900 font-bold shrink-0">{value} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function MultiStatBar({ 
  segments = [], // { label, value, percentage, colorClass }
  className = "" 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50">
        {segments.map((s, idx) => (
          <div
            key={idx}
            className={`h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 ${s.colorClass}`}
            style={{ width: `${s.percentage}%` }}
            title={`${s.label}: ${s.value} (${s.percentage}%)`}
          />
        ))}
      </div>
      
      {/* Legend list */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-500">
        {segments.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.colorClass}`} />
            <span>{s.label}: <strong className="text-slate-700">{s.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}
