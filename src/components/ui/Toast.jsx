import React, { useState, useEffect } from "react";

let toastListeners = [];
let toastsCount = 0;

export const toast = (message, type = "default") => {
  const id = ++toastsCount;
  toastListeners.forEach((listener) => listener({ id, message, type }));
};

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleNewToast = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    toastListeners.push(handleNewToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleNewToast);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center justify-between transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-bottom-5 ${
            t.type === "destructive"
              ? "bg-red-50 text-red-700 border-red-100"
              : t.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-white text-slate-800 border-slate-200"
          }`}
        >
          <span>{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
            className="text-slate-400 hover:text-slate-600 font-bold ml-3"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
