import React from "react";

/**
 * IHEM Forge logo - an original mark.
 * A faceted hexagon (the forged "ingot") holding an "F" built from three bars,
 * with an ember spark struck beneath the arms of the F.
 *
 * Props:
 *  - size: pixel size of the mark (default 40)
 *  - withText: show the wordmark next to the mark (default true)
 *  - light: use light text for dark backgrounds (default false)
 */
export const LogoMark = ({ size = 40, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="IHEM Forge logo"
    className={className}
  >
    <defs>
      <linearGradient id="ihem-forge-grad" x1="8" y1="4" x2="56" y2="60">
        <stop offset="0" stopColor="#8D7EFB" />
        <stop offset="0.55" stopColor="#5A43E6" />
        <stop offset="1" stopColor="#2A1F73" />
      </linearGradient>
    </defs>

    {/* Hexagon ingot */}
    <path
      d="M32 3 L57 17.5 V46.5 L32 61 L7 46.5 V17.5 Z"
      fill="url(#ihem-forge-grad)"
      stroke="url(#ihem-forge-grad)"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    {/* "F" built from three rounded bars */}
    <rect x="21" y="17" width="7" height="30" rx="3.5" fill="#FFFFFF" />
    <rect x="21" y="17" width="23" height="7" rx="3.5" fill="#FFFFFF" />
    <rect x="21" y="30" width="15" height="7" rx="3.5" fill="#FFFFFF" />

    {/* Ember spark */}
    <path d="M45 36 L48.5 43 L45 50 L41.5 43 Z" fill="#FF9A1F" />
  </svg>
);

const Logo = ({ size = 40, withText = true, light = false }) => (
  <span className="inline-flex items-center gap-3">
    <LogoMark size={size} />
    {withText && (
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-extrabold tracking-tight ${
            light ? "text-white" : "text-forge-950"
          }`}
        >
          IHEM Forge
        </span>
        <span
          className={`mt-1 text-[10px] font-bold uppercase tracking-[0.25em] ${
            light ? "text-ember-400" : "text-forge-500"
          }`}
        >
          Tech Academy
        </span>
      </span>
    )}
  </span>
);

export default Logo;
