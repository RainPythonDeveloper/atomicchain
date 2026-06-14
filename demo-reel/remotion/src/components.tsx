import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, MONO } from "./theme";

// ---- Retro 3D button (matches the RUN button in the editor) ----
export const RetroButton: React.FC<{
  label: string;
  icon?: React.ReactNode;
  filled?: boolean;
  glow?: number; // 0..1
  fontSize?: number;
}> = ({ label, icon, filled = true, glow = 1, fontSize = 34 }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: `${fontSize * 0.55}px ${fontSize * 1.2}px`,
        background: filled
          ? `linear-gradient(180deg, ${COLORS.orangeLt} 0%, ${COLORS.orange} 55%, ${COLORS.orangeDk} 100%)`
          : COLORS.surface2,
        color: filled ? "#fff" : COLORS.text,
        fontFamily: MONO,
        fontWeight: 800,
        letterSpacing: 3,
        fontSize,
        borderRadius: 14,
        border: `2px solid ${filled ? COLORS.orangeLt : COLORS.borderLt}`,
        boxShadow: `0 6px 0 ${filled ? COLORS.redDk : "#000"}, 0 10px 30px rgba(240,77,7,${0.5 * glow}), inset 0 2px 2px rgba(255,255,255,0.25)`,
        textShadow: filled ? "0 1px 2px rgba(0,0,0,0.4)" : "none",
        textTransform: "uppercase",
      }}
    >
      {icon}
      {label}
    </div>
  );
};

// ---- Lightning bolt icon ----
export const Bolt: React.FC<{ size?: number; color?: string }> = ({ size = 28, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" />
  </svg>
);

// ---- A node card mimicking the editor's nodes ----
export const NodeCard: React.FC<{
  title: string;
  accent: string;
  width?: number;
  children?: React.ReactNode;
  glow?: number;
}> = ({ title, accent, width = 380, children, glow = 0 }) => {
  return (
    <div
      style={{
        width,
        background: COLORS.surface,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 16,
        boxShadow: `0 18px 50px rgba(0,0,0,0.55), 0 0 ${30 * glow}px rgba(240,77,7,${0.45 * glow})`,
        overflow: "hidden",
        fontFamily: MONO,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          background: `linear-gradient(180deg, ${accent}33, transparent)`,
          borderBottom: `1px solid ${COLORS.border}`,
          color: accent,
          fontWeight: 700,
          letterSpacing: 2,
          fontSize: 20,
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
        {title}
      </div>
      {children ? <div style={{ padding: "18px 20px" }}>{children}</div> : null}
    </div>
  );
};

// ---- Connection port dot ----
export const Port: React.FC<{ color?: string; glow?: number }> = ({ color = COLORS.orange, glow = 1 }) => (
  <span
    style={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: color,
      display: "inline-block",
      boxShadow: `0 0 ${14 * glow}px ${color}`,
      border: "2px solid rgba(0,0,0,0.3)",
    }}
  />
);

// ---- Word-by-word reveal helper ----
export const useStagger = (index: number, perItem = 4, delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay - index * perItem,
    fps,
    config: { damping, stiffness: 120, mass: 0.6 },
    durationInFrames: 24,
  });
};

// ---- Animated SVG connection path that "draws" itself ----
export const WireConnection: React.FC<{
  d: string;
  progress: number; // 0..1
  color?: string;
  width?: number;
  pulse?: boolean;
}> = ({ d, progress, color = COLORS.orange, width = 4 }) => {
  const len = 1000;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${len} ${len}`}
      strokeDashoffset={len - len * progress}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    />
  );
};

// ---- Subtle floating drift for parallax ----
export const useDrift = (amp = 10, speed = 0.02, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame * speed + phase) * amp;
};

// ---- Vignette overlay ----
export const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

// ---- Scanline overlay (the site's retro CRT texture) ----
export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.12 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,${opacity}) 0px, rgba(0,0,0,${opacity}) 1px, transparent 2px, transparent 4px)`,
      pointerEvents: "none",
      mixBlendMode: "multiply",
    }}
  />
);

export const fadeInOut = (frame: number, dur: number, hold = 12) =>
  interpolate(frame, [0, hold, dur - hold, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
