import React from "react";

export const Textarea = React.forwardRef(({ className = "", error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
          error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
        } rounded-xl text-xs text-slate-700 font-semibold focus:bg-white focus:outline-none focus:ring-4 transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-bold mt-1">{error}</p>}
    </div>
  );
});

Textarea.displayName = "Textarea";
