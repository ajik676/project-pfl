import React, { useState, useEffect, useRef } from "react";

export function DropdownMenu({ children, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (!child) return null;
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen
          });
        }
        if (child.type === DropdownMenuContent) {
          return isOpen ? React.cloneElement(child, { onClose: () => setIsOpen(false) }) : null;
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ children, onClick, isOpen, asChild }) {
  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        onClick();
      },
      "aria-expanded": isOpen
    });
  }

  return (
    <button type="button" onClick={onClick} aria-expanded={isOpen}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, onClose, className = "", align = "right" }) {
  const alignStyles = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
  };

  return (
    <div className={`absolute ${alignStyles[align]} mt-2.5 w-48 bg-white border border-slate-150 rounded-2xl shadow-xl py-2 z-55 animate-in fade-in slide-in-from-top-2 duration-150 text-xs font-semibold text-slate-600 ${className}`}>
      {React.Children.map(children, (child) => {
        if (!child) return null;
        if (child.type === DropdownMenuItem) {
          return React.cloneElement(child, {
            onClick: (e) => {
              if (child.props.onClick) child.props.onClick(e);
              onClose();
            }
          });
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className = "", ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2 hover:bg-slate-50 hover:text-slate-800 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
