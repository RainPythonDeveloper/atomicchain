// atomicchain brand tokens — mirrored from app/globals.css
export const COLORS = {
  orange: "#F04D07",
  orangeLt: "#FF6B35",
  orangeDk: "#C43A00",
  red: "#891A06",
  redDk: "#5A1200",
  gray: "#989999",
  bg: "#1F1B1E",
  bgDeep: "#161214",
  surface: "#272122",
  surface2: "#302628",
  border: "#3D2C28",
  borderLt: "#5A3A32",
  text: "#F0E0D0",
  textDim: "#B09080",
  textMute: "#706060",
  // node accent colors (from editor)
  nodeBlue: "#4A90D9",
  nodeGreen: "#3FB57A",
  nodePurple: "#A66BD4",
} as const;

export const MONO = "JetBrains Mono, ui-monospace, monospace";
export const SANS = "Inter, ui-sans-serif, system-ui, sans-serif";

// shared scanline + glow helpers
export const scanlineBg = (base: string = COLORS.bg) =>
  `${base} repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.10) 3px, transparent 4px)`;
