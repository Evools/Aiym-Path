"use client";

import React, { useEffect, useState } from "react";

interface DrumDigitProps {
  digit: string;
  delayMs?: number;
  durationMs?: number;
}

// Single rolling drum digit column
const DrumDigit: React.FC<DrumDigitProps> = ({
  digit,
  delayMs = 0,
  durationMs = 1200,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger the drum roll animation on mount
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // If it's a non-digit character like '.', ',', '~'
  const isNumber = /^\d$/.test(digit);
  if (!isNumber) {
    return <span className="inline-block px-0.5">{digit}</span>;
  }

  const targetDigit = parseInt(digit, 10);
  // Create a drum reel strip: 0..9 repeating so it has a rolling slot machine effect
  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, target]
  const drumNumbers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ];

  // Final position in the drum reel (2 loops + target digit)
  const finalIndex = 20 + targetDigit;
  const totalItems = drumNumbers.length;

  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-top leading-none select-none">
      <span
        className="flex flex-col will-change-transform"
        style={{
          transform: mounted
            ? `translateY(-${(finalIndex * 100) / totalItems}%)`
            : "translateY(0%)",
          transitionProperty: "transform",
          transitionDuration: `${durationMs}ms`,
          transitionDelay: `${delayMs}ms`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Smooth deceleration with mechanical snap
        }}
      >
        {drumNumbers.map((num, idx) => (
          <span
            key={idx}
            className="flex items-center justify-center h-[1.15em] leading-none"
          >
            {num}
          </span>
        ))}
      </span>
    </span>
  );
};

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1400,
}) => {
  const formattedString =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  const characters = formattedString.split("");

  return (
    <span
      className={`inline-flex items-baseline font-extrabold tracking-tight select-none ${className}`}
    >
      {prefix && <span className="mr-0.5">{prefix}</span>}

      {/* Drum Rolling Ticker for each character */}
      <span className="inline-flex items-baseline overflow-hidden py-0.5">
        {characters.map((char, index) => (
          <DrumDigit
            key={`${index}-${char}`}
            digit={char}
            delayMs={index * 120} // Cascading stagger for authentic drum feel
            durationMs={duration + index * 100}
          />
        ))}
      </span>

      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
