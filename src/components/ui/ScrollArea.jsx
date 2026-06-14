import React from "react";

export function ScrollArea({ 
  children, 
  maxHeight = "400px", 
  className = "" 
}) {
  return (
    <div 
      className={`overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pr-1 ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
