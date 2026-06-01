import React, { useState } from "react";

export function TooltipProvider({ children }) {
  return <>{children}</>;
}

export function Tooltip({ children, content, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-2.5 py-1 text-[10px] font-bold text-white bg-slate-900 rounded-lg whitespace-nowrap shadow-md transition-opacity duration-200 animate-in fade-in zoom-in-95 ${className}`}>
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
