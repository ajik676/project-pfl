import React, { useState } from "react";
import { HiOutlineStar, HiStar } from "react-icons/hi";

export function Rating({ 
  value = 0, 
  max = 5, 
  onChange, 
  readOnly = false, 
  className = "", 
  starClassName = "" 
}) {
  const [hoverValue, setHoverValue] = useState(null);

  const handleStarClick = (val) => {
    if (!readOnly && onChange) {
      onChange(val);
    }
  };

  const handleStarHover = (val) => {
    if (!readOnly) {
      setHoverValue(val);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div 
      className={`flex items-center gap-0.5 ${className}`} 
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }).map((_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= displayValue;

        return (
          <span
            key={i}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            className={`transition-colors ${readOnly ? "" : "cursor-pointer active:scale-90 transform"} ${starClassName}`}
          >
            {isFilled ? (
              <HiStar className="text-amber-400 text-base fill-amber-400" />
            ) : (
              <HiOutlineStar className="text-slate-200 text-base" />
            )}
          </span>
        );
      })}
    </div>
  );
}
