import React, { useState } from "react";

export function Avatar({ children, className = "", ...props }) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = "", className = "", ...props }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`aspect-square h-full w-full object-cover ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ children, className = "", ...props }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
