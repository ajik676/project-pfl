import React, { createContext, useContext, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const AccordionContext = createContext(null);

export function Accordion({ type = "single", children, defaultValue, className = "" }) {
  const [activeItem, setActiveItem] = useState(defaultValue);

  const toggleItem = (val) => {
    if (type === "single") {
      setActiveItem(activeItem === val ? null : val);
    }
  };

  return (
    <AccordionContext.Provider value={{ activeItem, toggleItem }}>
      <div className={`space-y-2.5 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = createContext(null);

export function AccordionItem({ value, children, className = "" }) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={`border-b border-slate-100 pb-2 ${className}`}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ children, className = "" }) {
  const { activeItem, toggleItem } = useContext(AccordionContext);
  const { value } = useContext(AccordionItemContext);

  const isOpen = activeItem === value;

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={`flex w-full items-center justify-between py-3 text-xs font-bold text-slate-800 transition-all hover:underline ${className}`}
    >
      {children}
      <HiChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400 ${
          isOpen ? "rotate-180 text-blue-600" : ""
        }`}
      />
    </button>
  );
}

export function AccordionContent({ children, className = "" }) {
  const { activeItem } = useContext(AccordionContext);
  const { value } = useContext(AccordionItemContext);

  const isOpen = activeItem === value;

  if (!isOpen) return null;

  return (
    <div className={`pb-3 text-xs text-slate-500 font-medium leading-relaxed transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${className}`}>
      {children}
    </div>
  );
}
