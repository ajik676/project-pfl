import React, { createContext, useContext, useEffect } from "react";

const DialogContext = createContext(null);

export function Dialog({ open, onOpenChange, children }) {
  const [isOpen, setIsOpen] = React.useState(open || false);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const toggle = (val) => {
    const nextState = val !== undefined ? val : !isOpen;
    setIsOpen(nextState);
    if (onOpenChange) {
      onOpenChange(nextState);
    }
  };

  return (
    <DialogContext.Provider value={{ isOpen, toggle }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild }) {
  const { toggle } = useContext(DialogContext);

  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        toggle(true);
      },
    });
  }

  return (
    <button type="button" onClick={() => toggle(true)}>
      {children}
    </button>
  );
}

export function DialogContent({ children, className = "" }) {
  const { isOpen, toggle } = useContext(DialogContext);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") toggle(false);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={() => toggle(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out"
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden z-10 transition-all duration-300 transform scale-100 opacity-100 animate-in zoom-in-95 ease-out p-6 ${className}`}>
        
        {/* Close Button */}
        <button
          onClick={() => toggle(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-50 transition-all duration-150"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`space-y-1.5 text-left mb-6 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "" }) {
  return (
    <h2 className={`text-lg font-bold text-slate-900 tracking-tight leading-none ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`text-xs text-slate-500 font-medium ${className}`}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6 ${className}`}>
      {children}
    </div>
  );
}
