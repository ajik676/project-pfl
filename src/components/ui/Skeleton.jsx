import React from "react";

export function Skeleton({ className = "", variant = "text", ...props }) {
  const variants = {
    text: "h-3 w-full rounded-md",
    circle: "h-10 w-10 rounded-full",
    rect: "h-20 w-full rounded-2xl",
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function SkeletonLoader({ count = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 items-center">
          <Skeleton variant="circle" className="shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" className="w-1/3 h-3.5" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
