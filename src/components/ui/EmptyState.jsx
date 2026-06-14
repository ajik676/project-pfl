import React from "react";
import { Button } from "./Button";

export function EmptyState({ 
  title, 
  description, 
  icon = "🔎", 
  actionLabel, 
  onActionClick, 
  className = "" 
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center max-w-sm mx-auto space-y-4 ${className}`}>
      <span className="text-4xl filter drop-shadow-sm select-none">{icon}</span>
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      {actionLabel && onActionClick && (
        <Button size="sm" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
