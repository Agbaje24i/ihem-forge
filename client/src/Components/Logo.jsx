import markImage from "../assets/ihemforge-mark.png";

/**
 * IHEM Forge Academy logo (the academy's own artwork).
 *
 * Props:
 *  - size: pixel size of the mark (default 40)
 *  - withText: show the wordmark next to the mark (default true)
 *  - light: for dark backgrounds - puts the mark on a white tile and uses light text
 */
export const LogoMark = ({ size = 40, className = "", light = false }) => (
  <img
    src={markImage}
    alt="IHEM Forge Academy logo"
    width={size}
    height={size}
    className={`object-contain ${light ? "rounded-xl bg-white p-1" : ""} ${className}`}
    style={{ width: size, height: size }}
  />
);

const Logo = ({ size = 40, withText = true, light = false }) => (
  <span className="inline-flex items-center gap-3">
    <LogoMark size={size} light={light} />
    {withText && (
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-extrabold tracking-tight ${
            light ? "text-white" : "text-forge-950"
          }`}
        >
          IHEMFORGE
        </span>
        <span
          className={`mt-1 text-[10px] font-bold uppercase tracking-[0.25em] ${
            light ? "text-ember-400" : "text-forge-500"
          }`}
        >
          Academy
        </span>
      </span>
    )}
  </span>
);

export default Logo;
