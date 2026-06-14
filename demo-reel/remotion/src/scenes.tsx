import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS, MONO } from "./theme";
import { RetroButton, Bolt, Scanlines, Vignette, useDrift, fadeInOut } from "./components";
import { EDITOR_NODES, EDITOR_ASPECT } from "./editorNodes";

// ── house-style easings ──
const EXPO = Easing.bezier(0.16, 1, 0.3, 1); // entrances
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ii = (f: number, a: number, b: number, c: number, d: number, easing = EXPO) =>
  interpolate(f, [a, b], [c, d], { ...clamp, easing });

const Bg: React.FC<{ children?: React.ReactNode; deep?: boolean; glow?: number }> = ({ children, deep, glow = 0.1 }) => (
  <AbsoluteFill style={{ background: deep ? COLORS.bgDeep : COLORS.bg }}>
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 70% 60% at 50% 42%, rgba(240,77,7,${glow}), transparent 70%)` }}
    />
    {/* dot grid (editor texture) */}
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${COLORS.border} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        opacity: 0.25,
      }}
    />
    {children}
    <Scanlines opacity={0.07} />
    <Vignette />
  </AbsoluteFill>
);

const StageTag: React.FC<{ text: string; vis: [number, number] }> = ({ text, vis }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [vis[0], vis[0] + 10, vis[1] - 10, vis[1]], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 90, top: 70, opacity: o, display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ width: 14, height: 14, borderRadius: 4, background: COLORS.orange, boxShadow: `0 0 14px ${COLORS.orange}` }} />
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: COLORS.text, textShadow: "0 2px 14px #000" }}>
        {text}
      </span>
    </div>
  );
};

const BottomCaption: React.FC<{ text: string; accentWord?: string; vis: [number, number]; size?: number }> = ({
  text, accentWord, vis, size = 40,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [vis[0], vis[0] + 12, vis[1] - 12, vis[1]], [0, 1, 1, 0], clamp);
  const y = ii(f, vis[0], vis[0] + 16, 22, 0);
  return (
    <div
      style={{
        position: "absolute", left: 90, bottom: 80, opacity: o, transform: `translateY(${y}px)`,
        fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: 2, color: COLORS.text,
        textShadow: "0 3px 18px rgba(0,0,0,0.9)",
      }}
    >
      {text}
      {accentWord ? <span style={{ color: COLORS.orange, textShadow: `0 0 26px ${COLORS.orange}` }}> {accentWord}</span> : null}
    </div>
  );
};

// energy line — the film's signature element
const EnergyLine: React.FC<{ progress: number; height?: number; glow?: number }> = ({ progress, height = 3, glow = 1 }) => (
  <div
    style={{
      width: "100%", height, transformOrigin: "center", transform: `scaleX(${progress})`,
      background: `linear-gradient(90deg, transparent, ${COLORS.orange} 20%, ${COLORS.orangeLt} 50%, ${COLORS.orange} 80%, transparent)`,
      boxShadow: `0 0 ${20 * glow}px ${COLORS.orange}`,
    }}
  />
);

// =================================================================
// SCENE 1 — COLD OPEN · ignition (120f)
// =================================================================
export const SceneColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sparkO = interpolate(frame, [0, 8, 24, 30], [0, 1, 1, 0], clamp);
  const lineP = ii(frame, 8, 28, 0, 1);
  const logoSpring = spring({ frame: frame - 24, fps, config: { damping: 12, stiffness: 90, mass: 0.8 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const flash = interpolate(frame, [42, 46, 54], [0, 1, 0], clamp);
  const pulse = 0.85 + Math.sin(frame * 0.25) * 0.15;

  const word = "Atomic Chain";
  const out = ii(frame, durationInFrames - 24, durationInFrames, 1, 0);
  const outY = ii(frame, durationInFrames - 24, durationInFrames, 0, -60);
  const outBlur = ii(frame, durationInFrames - 20, durationInFrames, 0, 6);

  return (
    <Bg deep glow={0.14}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out, transform: `translateY(${outY}px)`, filter: `blur(${outBlur}px)` }}>
        <div style={{ position: "relative", width: 1400, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          {/* logo above socket */}
          <div style={{ position: "relative", transform: `scale(${logoScale})` }}>
            <div style={{ position: "absolute", inset: -50, background: `radial-gradient(circle, rgba(240,77,7,${(0.5 + flash * 0.5) * pulse}), transparent 65%)`, filter: "blur(22px)" }} />
            <Img src={staticFile("logo.png")} style={{ width: 190, height: 190, filter: `drop-shadow(0 0 ${22 * pulse}px rgba(240,77,7,0.75))` }} />
          </div>

          {/* node socket */}
          <div style={{ position: "relative", marginTop: -6 }}>
            <span style={{ display: "block", width: 18, height: 18, borderRadius: 5, background: COLORS.orange, boxShadow: `0 0 ${16 * pulse}px ${COLORS.orange}`, opacity: lineP }} />
          </div>

          {/* the energy line */}
          <div style={{ width: "100%", position: "relative" }}>
            <EnergyLine progress={lineP} glow={pulse} />
            {/* spark riding the line */}
            <div style={{ position: "absolute", top: -3, left: `${lineP * 100}%`, width: 8, height: 8, borderRadius: "50%", background: "#fff", opacity: sparkO, boxShadow: `0 0 16px ${COLORS.orangeLt}`, transform: "translateX(-50%)" }} />
          </div>

          {/* wordmark types on */}
          <div style={{ display: "flex", fontFamily: MONO, fontWeight: 800, fontSize: 80, letterSpacing: 10, marginTop: 6 }}>
            {word.split("").map((c, i) => {
              const on = frame >= 46 + i * 2;
              const isChain = i >= 7; // "Chain" (after "Atomic ")
              return (
                <span key={i} style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 12}px)`, transition: "none", color: isChain ? COLORS.orange : COLORS.text, textShadow: isChain ? `0 0 26px ${COLORS.orange}` : "none" }}>
                  {c === " " ? " " : c}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

// =================================================================
// SCENE 2 — THE HOOK (185f)
// =================================================================
// Three animated emoji that act out "one prompt is never enough"
const HOOK_TILES = [
  { emoji: "💬", label: "one prompt", accent: COLORS.nodeBlue },
  { emoji: "🎲", label: "one-shot", accent: COLORS.orangeLt },
  { emoji: "😩", label: "never enough", accent: COLORS.red },
];

const EmojiTile: React.FC<{ i: number; appear: number; emoji: string; label: string; accent: string }> = ({ i, appear, emoji, label, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 58 - i * 6, fps, config: { damping: 11, stiffness: 120, mass: 0.7 } });

  // per-emoji idle motion
  let anim = "";
  if (i === 0) {
    const bob = Math.sin(frame * 0.2) * 8;
    anim = `translateY(${bob}px) scale(${1 + Math.sin(frame * 0.2) * 0.05})`;
  } else if (i === 1) {
    const roll = Math.sin(frame * 0.45) * 16;
    const hop = -Math.abs(Math.sin(frame * 0.22)) * 10;
    anim = `rotate(${roll}deg) translateY(${hop}px)`;
  } else {
    const shake = Math.sin(frame * 0.9) * 6;
    const sink = (Math.sin(frame * 0.16) + 1) * 3;
    anim = `translateX(${shake}px) translateY(${sink}px)`;
  }

  const o = appear * pop;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: o, transform: `translateY(${(1 - pop) * 30}px) scale(${interpolate(pop, [0, 1], [0.6, 1])})` }}>
      <div style={{ width: 170, height: 170, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${COLORS.surface2}, ${COLORS.surface})`, border: `1.5px solid ${accent}66`, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 24px ${accent}33`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 35%, ${accent}22, transparent 65%)` }} />
        <span style={{ fontSize: 92, lineHeight: 1, transform: anim, display: "inline-block", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))" }}>{emoji}</span>
      </div>
      <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 1, color: COLORS.textDim }}>{label}</span>
    </div>
  );
};

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, durationInFrames, 14);

  const l1 = spring({ frame: frame - 4, fps, config: { damping: 200, stiffness: 120 } });
  const l2 = spring({ frame: frame - 20, fps, config: { damping: 200, stiffness: 120 } });
  const phaseA = interpolate(frame, [0, 6, 90, 106], [0, 1, 1, 0], clamp);
  // emoji tiles fade in (container handles the exit)
  const tilesIn = interpolate(frame, [54, 72], [0, 1], clamp);

  // phase B — held long enough to read comfortably (~2s on screen)
  const qO = ii(frame, 104, 122, 0, 1);
  const qY = ii(frame, 104, 124, 18, 0);
  const underline = ii(frame, 118, 140, 0, 1);

  return (
    <Bg glow={0.08}>
      <AbsoluteFill style={{ opacity: out, justifyContent: "center", alignItems: "center" }}>
        {/* phase A — the problem */}
        <div style={{ opacity: phaseA, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "absolute" }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 120, letterSpacing: 4, color: COLORS.text, opacity: l1, transform: `translateY(${(1 - l1) * 30}px)` }}>
            One prompt
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 120, letterSpacing: 4, color: COLORS.textDim, opacity: l2, transform: `translateY(${(1 - l2) * 30}px)` }}>
            is never enough.
          </div>
          {/* animated emoji acting out the line */}
          <div style={{ display: "flex", gap: 40, marginTop: 46 }}>
            {HOOK_TILES.map((t, i) => (
              <EmojiTile key={t.label} i={i} appear={tilesIn} emoji={t.emoji} label={t.label} accent={t.accent} />
            ))}
          </div>
        </div>

        {/* phase B — the promise */}
        <div style={{ opacity: qO, transform: `translateY(${qY}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 96, letterSpacing: 4, color: COLORS.text, textAlign: "center", lineHeight: 1.15 }}>
            What if you could<br />
            <span style={{ color: COLORS.orange, textShadow: `0 0 36px ${COLORS.orange}` }}>chain</span> them?
          </div>
          <div style={{ width: 360, marginTop: 10 }}>
            <EnergyLine progress={underline} />
          </div>
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

// =================================================================
// SCENE 3 — CANVAS REVEAL (150f) — with glowing node outlines
// =================================================================
const NODE_ACCENT: Record<string, string> = {
  promptNode: COLORS.nodeBlue,
  sizeNode: COLORS.nodeGreen,
  generateNode: COLORS.orange,
  outputNode: COLORS.nodeGreen,
};

const GlowBorder: React.FC<{ rect: { x: number; y: number; w: number; h: number }; imgW: number; imgH: number; accent: string; delay: number }> = ({ rect, imgW, imgH, accent, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 110, mass: 0.7 } });
  const pulse = 0.5 + Math.sin((frame - delay) * 0.13) * 0.5;
  const glow = 8 + pulse * 30;
  const pad = 7;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x * imgW - pad,
        top: rect.y * imgH - pad,
        width: rect.w * imgW + pad * 2,
        height: rect.h * imgH + pad * 2,
        borderRadius: 18,
        border: `2px solid ${accent}`,
        opacity: intro * (0.85 + pulse * 0.15),
        boxShadow: `0 0 ${glow}px ${accent}, 0 0 ${glow * 2}px ${accent}66, inset 0 0 ${glow * 0.6}px ${accent}44`,
        transform: `scale(${interpolate(intro, [0, 1], [0.96, 1])})`,
      }}
    />
  );
};

export const SceneCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, durationInFrames, 14);

  const scale = ii(frame, 0, durationInFrames, 1.15, 1.02, Easing.out(Easing.ease));
  const blur = ii(frame, 0, 14, 8, 0);
  const drift = useDrift(10, 0.014);

  const imgW = 1920;
  const imgH = imgW / EDITOR_ASPECT;
  // light the nodes in chain order: prompt → size → generate → output
  const order: Record<string, number> = { promptNode: 16, sizeNode: 26, generateNode: 38, outputNode: 50 };

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: out }}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", width: imgW, height: imgH, transform: `scale(${scale}) translate(${drift}px,0)` }}>
            <Img src={staticFile("editor-clean.png")} style={{ width: imgW, height: imgH, filter: `blur(${blur}px)`, borderRadius: 4, display: "block" }} />
            {/* glowing outlines tracking each node */}
            {EDITOR_NODES.map((n) => (
              <GlowBorder key={n.type} rect={n} imgW={imgW} imgH={imgH} accent={NODE_ACCENT[n.type] ?? COLORS.orange} delay={order[n.type] ?? 20} />
            ))}
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "rgba(22,18,20,0.22)" }} />
        <Scanlines opacity={0.05} />
        <BottomCaption text="An infinite" accentWord="node canvas." vis={[10, 150]} />
      </AbsoluteFill>
    </Bg>
  );
};

// =================================================================
// SCENE 4 — THE NODES (120f)
// =================================================================
const NODE_NAMES = [
  "Prompt", "Style", "Camera", "Lighting", "Refine", "Mood",
  "Artist", "Color", "Material", "FX", "Time Machine", "Aspect",
  "Combiner", "Batch", "Surprise Me", "Video", "Negative", "Size",
];
const ACCENTS = [COLORS.nodeBlue, COLORS.nodePurple, COLORS.orangeLt, COLORS.orange, COLORS.nodeGreen];

export const SceneNodes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, durationInFrames, 12);
  const headS = spring({ frame, fps, config: { damping: 200, stiffness: 120 } });

  // chips magnetize toward center then collapse
  const gather = ii(frame, 70, 100, 0, 1);
  const collapse = ii(frame, 100, 118, 0, 1);

  return (
    <Bg glow={0.1}>
      <AbsoluteFill style={{ opacity: out, justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 80, letterSpacing: 4, color: COLORS.text, opacity: headS, transform: `translateY(${(1 - headS) * 24}px)`, position: "absolute", top: 120 }}>
          <span style={{ color: COLORS.orange, textShadow: `0 0 30px ${COLORS.orange}` }}>20</span> node types.
        </div>

        <div style={{ position: "relative", width: 1500, height: 560, marginTop: 60 }}>
          {NODE_NAMES.map((name, i) => {
            const col = i % 6, row = Math.floor(i / 6);
            const baseX = 120 + col * 230;
            const baseY = 60 + row * 170;
            const cx = 750, cy = 280;
            const s = spring({ frame: frame - 10 - i * 2.2, fps, config: { damping: 200, stiffness: 130 } });
            const x = interpolate(gather, [0, 1], [baseX, cx]) * (1 - collapse) + cx * collapse;
            const y = interpolate(gather, [0, 1], [baseY, cy]) * (1 - collapse) + cy * collapse;
            const sc = (interpolate(s, [0, 1], [0.8, 1])) * (1 - collapse * 0.85);
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={name}
                style={{
                  position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, opacity: s * (1 - collapse * 0.6),
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10,
                  background: COLORS.surface, border: `1.5px solid ${accent}`,
                  fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 1, color: COLORS.text, whiteSpace: "nowrap",
                  boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 16px ${accent}44`,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: 3, background: accent, boxShadow: `0 0 10px ${accent}` }} />
                {name}
              </div>
            );
          })}
          {/* collapse flash → first node */}
          <div style={{ position: "absolute", left: 750, top: 280, transform: "translate(-50%,-50%)", width: 30, height: 30, borderRadius: 8, background: COLORS.orangeLt, opacity: collapse, boxShadow: `0 0 ${40 * collapse}px 10px ${COLORS.orange}` }} />
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

// =================================================================
// SCENE 5 — BUILD THE CHAIN ★ (300f)
// =================================================================
const Board: React.FC<{
  src: string; opacity: number; reveal: [number, number]; push: [number, number]; scaleA?: number; scaleB?: number; width?: number;
}> = ({ src, opacity, reveal, push, scaleA = 1, scaleB = 1.06, width = 1660 }) => {
  const frame = useCurrentFrame();
  const r = ii(frame, reveal[0], reveal[1], 0, 1);
  const scale = ii(frame, push[0], push[1], scaleA, scaleB, Easing.out(Easing.ease));
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ position: "relative", width, transform: `scale(${scale})` }}>
        <div style={{ clipPath: `inset(0 ${(1 - r) * 100}% 0 0)` }}>
          <Img src={staticFile(src)} style={{ width, borderRadius: 10, border: `1px solid ${COLORS.borderLt}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
        </div>
        {r > 0.002 && r < 0.998 && (
          <div style={{ position: "absolute", top: -6, bottom: -6, left: `${r * 100}%`, width: 5, transform: "translateX(-2.5px)", background: COLORS.orangeLt, boxShadow: `0 0 30px 8px ${COLORS.orange}` }} />
        )}
      </div>
    </AbsoluteFill>
  );
};

const KeyCap: React.FC<{ vis: [number, number] }> = ({ vis }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [vis[0], vis[0] + 10, vis[1]], [0, 1, 1], clamp);
  const pulse = 0.6 + Math.sin(f * 0.3) * 0.4;
  return (
    <div style={{ position: "absolute", right: 100, bottom: 84, opacity: o, display: "flex", alignItems: "center", gap: 12 }}>
      {["⌘", "↵"].map((k) => (
        <span key={k} style={{
          fontFamily: MONO, fontWeight: 800, fontSize: 34, color: COLORS.text, padding: "10px 18px", borderRadius: 10,
          background: COLORS.surface2, border: `2px solid ${COLORS.borderLt}`, boxShadow: `0 4px 0 #000, 0 0 ${18 * pulse}px ${COLORS.orange}66`,
        }}>{k}</span>
      ))}
    </div>
  );
};

export const SceneBuildChain: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, durationInFrames, 12);

  const oStage1 = interpolate(frame, [0, 6, 95, 115], [0, 1, 1, 0], clamp);
  const oHub = interpolate(frame, [95, 115, 185, 205], [0, 1, 1, 0], clamp);
  const oStage3 = interpolate(frame, [185, 205, 250, 270], [0, 1, 1, 0], clamp);
  const oOverview = interpolate(frame, [250, 275], [0, 1], clamp);
  const overviewScale = ii(frame, 250, 300, 1.5, 1.0); // pull-back

  return (
    <Bg deep glow={0.08}>
      <AbsoluteFill style={{ opacity: out }}>
        <Board src="chain-stage1.png" opacity={oStage1} reveal={[8, 80]} push={[0, 110]} />
        <Board src="chain-hub.png" opacity={oHub} reveal={[105, 168]} push={[95, 205]} />
        <Board src="chain-stage3.png" opacity={oStage3} reveal={[198, 255]} push={[185, 270]} />
        {/* pull-back to full overview */}
        {oOverview > 0.001 && (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: oOverview }}>
            <Img src={staticFile("chain-overview.png")} style={{ width: 1820, transform: `scale(${overviewScale})`, borderRadius: 10, border: `1px solid ${COLORS.borderLt}`, boxShadow: "0 30px 90px rgba(0,0,0,0.65)" }} />
          </AbsoluteFill>
        )}

        <StageTag text="01 · COMPOSE" vis={[0, 95]} />
        <StageTag text="02 · EVOLVE" vis={[95, 185]} />
        <StageTag text="03 · VARY + ANIMATE" vis={[185, 250]} />
        <StageTag text="ONE PIPELINE." vis={[252, 300]} />

        <BottomCaption text="Inputs →" accentWord="Generate → Output" vis={[28, 95]} size={36} />
        <BottomCaption text="Output →" accentWord="Refine → next stage" vis={[118, 185]} size={36} />
        <BottomCaption text="Variations," accentWord="batch & motion" vis={[206, 250]} size={36} />
        <BottomCaption text="Run the whole chain —" accentWord="one keystroke." vis={[262, 300]} size={40} />
        <KeyCap vis={[262, 300]} />
      </AbsoluteFill>
    </Bg>
  );
};

// =================================================================
// SCENE 6 — RUN · the release (150f)
// =================================================================
export const SceneRun: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, durationInFrames, 10);

  const baseScale = ii(frame, 0, durationInFrames, 1.0, 1.05, Easing.out(Easing.ease));
  const flash = interpolate(frame, [0, 4, 12], [0.9, 0.5, 0], clamp);
  const sweep = ii(frame, 6, 70, 0, 1); // energy cascade L→R, accelerating
  // completion pulse — the whole board "powers on" at once (no second traveling line)
  const donePulse = interpolate(frame, [68, 82, 116], [0, 1, 0], clamp);
  const doneRing = ii(frame, 68, 110, 0, 1);
  const settle = 0.5 + Math.sin(frame * 0.3) * 0.5;

  return (
    <Bg deep glow={0.16}>
      <AbsoluteFill style={{ opacity: out }}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Img src={staticFile("chain-running.png")} style={{ width: 1820, transform: `scale(${baseScale})`, borderRadius: 10, border: `1px solid ${COLORS.borderLt}`, boxShadow: "0 30px 90px rgba(0,0,0,0.65)" }} />
        </AbsoluteFill>

        {/* energy cascade bloom following the sweep */}
        {sweep > 0 && sweep < 1 && (
          <>
            <AbsoluteFill style={{ background: `radial-gradient(circle 320px at ${sweep * 100}% 50%, rgba(240,77,7,0.35), transparent 60%)`, mixBlendMode: "screen" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep * 100}%`, width: 6, transform: "translateX(-3px)", background: COLORS.orangeLt, boxShadow: `0 0 50px 14px ${COLORS.orange}` }} />
          </>
        )}

        {/* completion pulse — full-board bloom + expanding ring (replaces a 2nd sweep) */}
        {donePulse > 0.001 && (
          <>
            <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 85% at 50% 50%, rgba(240,77,7,${0.3 * donePulse}), transparent 62%)`, mixBlendMode: "screen" }} />
            <AbsoluteFill style={{ background: "#fff", opacity: 0.1 * donePulse, mixBlendMode: "screen" }} />
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <div style={{ width: 300 + doneRing * 2200, height: 300 + doneRing * 2200, borderRadius: "50%", border: `3px solid rgba(240,77,7,${(1 - doneRing) * 0.6})`, boxShadow: `0 0 40px rgba(240,77,7,${(1 - doneRing) * 0.5})` }} />
            </AbsoluteFill>
          </>
        )}

        {/* drop flash */}
        <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />

        {/* steady glow after run */}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(240,77,7,${0.06 * settle}), transparent 70%)`, opacity: ii(frame, 70, 90, 0, 1) }} />

        {/* RUNNING badge */}
        <div style={{ position: "absolute", top: 70, left: 90, opacity: interpolate(frame, [2, 12, 120, 140], [0, 1, 1, 0], clamp), display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderRadius: 12, background: `linear-gradient(180deg, ${COLORS.orangeLt}, ${COLORS.orangeDk})`, border: `2px solid ${COLORS.orangeLt}`, boxShadow: `0 6px 0 ${COLORS.redDk}, 0 0 30px ${COLORS.orange}` }}>
          <Bolt size={28} />
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: "#fff" }}>RUNNING…</span>
        </div>

        <BottomCaption text="Executing the" accentWord="full chain." vis={[14, 150]} />
      </AbsoluteFill>
    </Bg>
  );
};

// =================================================================
// SCENE 7 — RESULTS EVOLVE (150f)
// =================================================================
const CARD = 460;
const CARD_TOP = 300;
const CARD_CY = CARD_TOP + CARD / 2; // vertical center of cards

const ResultCard: React.FC<{ src: string; label: string; pop: number; ignite: number; x: number }> = ({ src, label, pop, ignite, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - pop, fps, config: { damping: 16, stiffness: 110, mass: 0.7 } });
  const float = Math.sin((frame - pop) * 0.05) * 6;

  // highlight ignition: flare burst on arrival, settling to a steady pulsing glow
  const lit = interpolate(frame, [ignite, ignite + 8], [0, 1], clamp);
  const flare = interpolate(frame, [ignite, ignite + 6, ignite + 28], [0, 1, 0.5], clamp);
  const pulse = 0.5 + Math.sin(frame * 0.15) * 0.5;
  const glowAmt = lit * (flare * 0.7 + 0.3 + pulse * 0.18);
  const glowPx = 6 + glowAmt * 50;
  const borderCol = lit > 0.04 ? COLORS.orange : COLORS.borderLt;

  return (
    <div style={{ position: "absolute", left: x, top: CARD_TOP, transform: `translateX(-50%) translateY(${(1 - s) * 50 + float}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`, opacity: s, textAlign: "center" }}>
      <div
        style={{
          width: CARD, height: CARD, borderRadius: 16, overflow: "hidden", background: COLORS.surface,
          border: `${2 + lit * 1.5}px solid ${borderCol}`,
          boxShadow: `0 26px 70px rgba(0,0,0,0.6), 0 0 ${glowPx}px rgba(240,77,7,${0.25 + glowAmt * 0.6}), 0 0 ${glowPx * 2}px rgba(240,77,7,${glowAmt * 0.35}), inset 0 0 ${glowPx * 0.6}px rgba(240,77,7,${glowAmt * 0.5})`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: CARD, height: CARD, objectFit: "cover" }} />
        {/* brief white-hot sweep across the image on ignition */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.9)", mixBlendMode: "screen", opacity: interpolate(frame, [ignite, ignite + 5, ignite + 16], [0, 0.18, 0], clamp) }} />
      </div>
      <div style={{ marginTop: 20, fontFamily: MONO, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: lit > 0.5 ? COLORS.text : COLORS.textDim, textShadow: lit > 0.5 ? `0 0 ${glowAmt * 18}px ${COLORS.orange}` : "none" }}>{label}</div>
    </div>
  );
};

// glowing connector that fills, with a bright dot crossing it
const Thread: React.FC<{ x1: number; x2: number; y: number; delay: number }> = ({ x1, x2, y, delay }) => {
  const frame = useCurrentFrame();
  const p = ii(frame, delay, delay + 18, 0, 1);
  const dotX = interpolate(p, [0, 1], [x1, x2]);
  const litGlow = interpolate(frame, [delay, delay + 18, delay + 60], [0.2, 1, 0.55], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: x1, top: y - 2.5, width: (x2 - x1) * p, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.orangeLt})`, boxShadow: `0 0 ${10 + litGlow * 18}px ${COLORS.orange}` }} />
      {p > 0.02 && p < 0.99 && (
        <div style={{ position: "absolute", left: dotX, top: y - 8, width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: `0 0 22px 4px ${COLORS.orangeLt}`, transform: "translateX(-50%)" }} />
      )}
    </>
  );
};

export const SceneResults: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = fadeInOut(frame, durationInFrames, 14);
  const capO = ii(frame, 122, 142, 0, 1);

  // chain of highlights: card lights → line travels → next card lights → …
  // card1 ignite 22 │ thread1 34→52 → card2 ignite 54 │ thread2 66→84 → card3 ignite 86
  return (
    <Bg deep glow={0.1}>
      <AbsoluteFill style={{ opacity: out }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, letterSpacing: 4, color: COLORS.text, position: "absolute", top: 120, width: "100%", textAlign: "center", opacity: ii(frame, 4, 20, 0, 1) }}>
          A <span style={{ color: COLORS.orange }}>chain of changes.</span>
        </div>

        {/* connectors sit in the gaps between adjacent cards */}
        <Thread x1={690} x2={730} y={CARD_CY} delay={34} />
        <Thread x1={1190} x2={1230} y={CARD_CY} delay={66} />

        <ResultCard src="result-1.png" label="STAGE 1 · BASE" pop={8} ignite={22} x={460} />
        <ResultCard src="result-2.png" label="STAGE 2 · REFINED" pop={34} ignite={54} x={960} />
        <ResultCard src="result-3.png" label="STAGE 3 · FINAL" pop={64} ignite={86} x={1460} />

        <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", opacity: capO, fontFamily: MONO, fontWeight: 800, fontSize: 50, letterSpacing: 3, color: COLORS.text }}>
          Three generations. <span style={{ color: COLORS.orange, textShadow: `0 0 28px ${COLORS.orange}` }}>One run.</span>
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

// =================================================================
// SCENE 8 — GALLERY + CTA (150f)
// =================================================================
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // gallery beat
  const galScale = ii(frame, 0, 90, 1.05, 1.16, Easing.inOut(Easing.ease));
  const galTy = interpolate(frame, [0, 90], [20, -20], clamp);
  const galOut = interpolate(frame, [70, 92], [1, 0], clamp);
  const galBlur = ii(frame, 70, 92, 0, 12);
  const galCapO = interpolate(frame, [10, 28, 66, 80], [0, 1, 1, 0], clamp);

  // CTA beat
  const ctaIn = interpolate(frame, [80, 95], [0, 1], clamp);
  const logoS = spring({ frame: frame - 80, fps, config: { damping: 14, stiffness: 90 } });
  const titleS = spring({ frame: frame - 92, fps, config: { damping: 200, stiffness: 120 } });
  const btnS = spring({ frame: frame - 108, fps, config: { damping: 12, stiffness: 120 } });
  const urlO = ii(frame, 126, 144, 0, 1);
  const pulse = 0.85 + Math.sin(frame * 0.25) * 0.15;
  const finalFade = interpolate(frame, [142, 150], [1, 0], clamp);

  return (
    <Bg deep glow={0.12}>
      <AbsoluteFill style={{ opacity: finalFade }}>
        {/* gallery */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: galOut, filter: `blur(${galBlur}px)` }}>
          <Img src={staticFile("gallery.png")} style={{ width: 1920, transform: `scale(${galScale}) translateY(${galTy}px)` }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(22,18,20,0.25), rgba(22,18,20,0) 35%, rgba(22,18,20,0.8) 100%)", opacity: galOut }} />
        <div style={{ position: "absolute", left: 120, bottom: 110, opacity: galCapO, fontFamily: MONO, fontWeight: 800, fontSize: 66, letterSpacing: 2, color: COLORS.text, textShadow: "0 4px 20px #000" }}>
          Every run, <span style={{ color: COLORS.orange }}>saved.</span>
        </div>

        {/* CTA */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: ctaIn }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 50% at 50% 45%, rgba(240,77,7,${0.18 * pulse}), transparent 70%)` }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ position: "relative", transform: `scale(${interpolate(logoS, [0, 1], [0.6, 1])})` }}>
              <div style={{ position: "absolute", inset: -30, background: `radial-gradient(circle, rgba(240,77,7,${0.5 * pulse}), transparent 65%)`, filter: "blur(16px)" }} />
              <Img src={staticFile("logo.png")} style={{ width: 120, height: 120, filter: "drop-shadow(0 0 18px rgba(240,77,7,0.7))" }} />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 22, fontFamily: MONO, fontWeight: 800, fontSize: 78, letterSpacing: 8, opacity: titleS, transform: `translateY(${(1 - titleS) * 18}px)` }}>
              <span style={{ color: COLORS.text }}>Atomic</span>
              <span style={{ color: COLORS.orange, textShadow: `0 0 28px ${COLORS.orange}` }}>Chain</span>
            </div>
            <div style={{ width: 300 }}><EnergyLine progress={titleS} /></div>
            <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: COLORS.textDim, textTransform: "uppercase", opacity: titleS }}>
              Build pipelines, not prompts.
            </div>
            <div style={{ transform: `scale(${interpolate(btnS, [0, 1], [0.7, 1])})`, opacity: btnS, marginTop: 4 }}>
              <RetroButton label="Start building" icon={<Bolt size={28} />} glow={pulse} fontSize={36} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: COLORS.textMute, opacity: urlO, marginTop: 4 }}>atomicchain.app</div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Bg>
  );
};
