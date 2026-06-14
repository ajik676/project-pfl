import React from "react";

export function Separator({ 
  label, 
  orientation = "horizontal", 
  className = "" 
}) {
  if (orientation === "vertical") {
    return <div className={`w-px bg-slate-200 self-stretch ${className}`} />;
  }

  return (
    <div className={`relative flex py-2 items-center w-full ${className}`}>
      <div className="flex-grow border-t border-slate-150"></div>
      {label && (
        <span className="flex-shrink mx-4 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-slate-150"></div>
    </div>
  );
}
