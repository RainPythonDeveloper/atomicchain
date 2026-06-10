"use client";

import { useState } from "react";
import { useAtomicStore } from "@/lib/store";
import {
  MessageSquare, MinusCircle, Expand, Palette, GitMerge, Zap,
  ImageIcon, Sparkles, RectangleHorizontal, Camera, CloudSun,
  PenLine, Sun, Pipette, Layers, Film, Dices, Gem, Hourglass, Wand2,
  CircleHelp,
} from "lucide-react";
import { NodeInfoModal } from "./NodeInfoModal";

export const SIDEBAR_NODE_TYPES = [
  {
    type: "promptNode",
    label: "Prompt",
    description: "Text input",
    icon: MessageSquare,
    accent: "#2B7FE0",
    shadow: "#0A2860",
    defaultData: { prompt: "" },
  },
  {
    type: "negativeNode",
    label: "Negative",
    description: "Avoid these",
    icon: MinusCircle,
    accent: "#C42020",
    shadow: "#4A0808",
    defaultData: { prompt: "blurry, low quality, distorted" },
  },
  {
    type: "sizeNode",
    label: "Size",
    description: "Resolution",
    icon: Expand,
    accent: "#0A9E8A",
    shadow: "#043830",
    defaultData: { size: "1024x1024" },
  },
  {
    type: "styleNode",
    label: "Style",
    description: "Visual preset",
    icon: Palette,
    accent: "#8A3FD0",
    shadow: "#2A0A50",
    defaultData: { styleModifier: "" },
  },
  {
    type: "combinerNode",
    label: "Combiner",
    description: "Merge prompts",
    icon: GitMerge,
    accent: "#C89000",
    shadow: "#503800",
    defaultData: { combined: "" },
  },
  {
    type: "generateNode",
    label: "Generate",
    description: "Run AI pipeline",
    icon: Zap,
    accent: "#F04D07",
    shadow: "#891A06",
    defaultData: { status: "idle" },
  },
  {
    type: "outputNode",
    label: "Output",
    description: "Result image",
    icon: ImageIcon,
    accent: "#1A9E5A",
    shadow: "#063820",
    defaultData: { imageBase64: null, status: "idle" },
  },
  {
    type: "refineNode",
    label: "Refine",
    description: "Improve image",
    icon: Sparkles,
    accent: "#C02880",
    shadow: "#480A30",
    defaultData: { improvement: "", refinedPrompt: "", isLoading: false },
  },
  {
    type: "videoNode",
    label: "Video",
    description: "Animate image → MP4",
    icon: Film,
    accent: "#06B6D4",
    shadow: "#04303F",
    defaultData: { motionPrompt: "", resolution: "720_16_9", frames: 57, status: "idle", videoBase64: null },
  },
  {
    type: "aspectRatioNode",
    label: "Aspect Ratio",
    description: "Frame format",
    icon: RectangleHorizontal,
    accent: "#0EA5E9",
    shadow: "#052840",
    defaultData: { ratio: "square", size: "1024x1024", prompt: "square composition" },
  },
  {
    type: "cameraNode",
    label: "Camera Shot",
    description: "Shot & angle",
    icon: Camera,
    accent: "#F59E0B",
    shadow: "#4A2E00",
    defaultData: { shot: "", angle: "", modifier: "" },
  },
  {
    type: "moodNode",
    label: "Mood",
    description: "Atmosphere & vibe",
    icon: CloudSun,
    accent: "#6366F1",
    shadow: "#1A1A60",
    defaultData: { time: "", weather: "", vibe: "", modifier: "" },
  },
  {
    type: "artistStyleNode",
    label: "Artist Style",
    description: "Art references",
    icon: PenLine,
    accent: "#E11D48",
    shadow: "#4A0618",
    defaultData: { artist: "", era: "Classic", modifier: "" },
  },
  {
    type: "lightingNode",
    label: "Lighting",
    description: "Light setup",
    icon: Sun,
    accent: "#FB923C",
    shadow: "#4A1800",
    defaultData: { lighting: "", category: "Natural", modifier: "" },
  },
  {
    type: "colorPaletteNode",
    label: "Color Palette",
    description: "Dominant colors",
    icon: Pipette,
    accent: "#9333EA",
    shadow: "#2A0850",
    defaultData: { colors: ["#F04D07", "#1F1B1E", "#989999"], modifier: "" },
  },
  {
    type: "batchNode",
    label: "Batch Generate",
    description: "Multiple variations",
    icon: Layers,
    accent: "#65A30D",
    shadow: "#1A3004",
    defaultData: { count: 2 },
  },
  {
    type: "diceNode",
    label: "Surprise Me",
    description: "Random scene idea",
    icon: Dices,
    accent: "#EC4899",
    shadow: "#500724",
    defaultData: { prompt: "" },
  },
  {
    type: "materialNode",
    label: "Made Of…",
    description: "Glass, LEGO, origami",
    icon: Gem,
    accent: "#5EEAD4",
    shadow: "#042A22",
    defaultData: { material: "", modifier: "" },
  },
  {
    type: "timeMachineNode",
    label: "Time Machine",
    description: "10000 BC → year 3000",
    icon: Hourglass,
    accent: "#C2702D",
    shadow: "#2A1808",
    defaultData: { era: "", modifier: "" },
  },
  {
    type: "fxNode",
    label: "Special FX",
    description: "Glitch, hologram, x-ray",
    icon: Wand2,
    accent: "#9EF01A",
    shadow: "#1A2A04",
    defaultData: { effects: [], modifier: "" },
  },
];

export function NodeSidebar() {
  const addNode = useAtomicStore((s) => s.addNode);
  const [infoNode, setInfoNode] = useState<(typeof SIDEBAR_NODE_TYPES)[number] | null>(null);

  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/atomicchain-node", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="w-48 flex flex-col shrink-0 overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #1A1618 0%, #1F1B1E 100%)",
        borderRight: "2px solid #3D2C28",
        boxShadow: "2px 0 0 #0A0604",
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-3"
        style={{
          borderBottom: "1.5px solid #3D2C28",
          background: "linear-gradient(180deg, #221E20 0%, #1A1618 100%)",
          boxShadow: "inset 0 -1px 0 #0A0604",
        }}
      >
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#F04D07",
          textShadow: "0 0 8px rgba(240,77,7,0.5)",
        }}>
          Nodes
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#706060", marginTop: 2 }}>
          Click or drag to canvas
        </p>
      </div>

      {/* Node buttons */}
      <div className="p-2 flex flex-col gap-1.5">
        {SIDEBAR_NODE_TYPES.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              onClick={() => addNode(node.type, node.defaultData as Record<string, unknown>)}
              className="flex items-center gap-2.5 w-full text-left"
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                background: `linear-gradient(180deg, #2A2022 0%, #231E20 100%)`,
                border: `1.5px solid #4A3028`,
                borderBottomColor: "#1A1010",
                boxShadow: `
                  0 0 0 1px #0A0604,
                  0 4px 0 0 ${node.shadow},
                  0 5px 0 1px #080402,
                  inset 0 1px 0 rgba(255,120,50,0.06)
                `,
                cursor: "grab",
                transition: "filter 0.1s ease, transform 0.08s ease, box-shadow 0.08s ease",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.filter = "brightness(1.15)";
                el.style.borderColor = node.accent + "80";
                el.style.boxShadow = `
                  0 0 0 1px #0A0604,
                  0 4px 0 0 ${node.shadow},
                  0 5px 0 1px #080402,
                  inset 0 1px 0 rgba(255,120,50,0.1),
                  0 0 10px ${node.accent}22
                `;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.filter = "";
                el.style.borderColor = "#4A3028";
                el.style.boxShadow = `
                  0 0 0 1px #0A0604,
                  0 4px 0 0 ${node.shadow},
                  0 5px 0 1px #080402,
                  inset 0 1px 0 rgba(255,120,50,0.06)
                `;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(3px)";
                e.currentTarget.style.boxShadow = `
                  0 0 0 1px #0A0604,
                  0 1px 0 0 ${node.shadow},
                  0 2px 0 1px #080402,
                  inset 0 2px 4px rgba(0,0,0,0.4)
                `;
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: `linear-gradient(180deg, ${node.accent}30 0%, ${node.accent}18 100%)`,
                border: `1.5px solid ${node.accent}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `inset 0 1px 0 rgba(255,200,100,0.1), 0 2px 0 ${node.shadow}`,
              }}>
                <Icon size={13} style={{ color: node.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#D0B0A0",
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.55rem",
                  color: "#706060",
                  marginTop: 1,
                }}>
                  {node.description}
                </div>
              </div>

              {/* Info popup trigger */}
              <button
                onClick={(e) => { e.stopPropagation(); setInfoNode(node); }}
                draggable={false}
                onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                title={`How ${node.label} works`}
                style={{
                  flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: 6,
                  background: "linear-gradient(180deg, #302628 0%, #272122 100%)",
                  border: "1.5px solid #4A3028",
                  borderBottomColor: "#1A1010",
                  color: "#706060",
                  cursor: "pointer",
                  boxShadow: "0 2px 0 #100806, inset 0 1px 0 rgba(255,160,80,0.06)",
                  transition: "color 0.1s, border-color 0.1s, box-shadow 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = node.accent;
                  e.currentTarget.style.borderColor = node.accent + "70";
                  e.currentTarget.style.boxShadow = `0 2px 0 #100806, 0 0 8px ${node.accent}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#706060";
                  e.currentTarget.style.borderColor = "#4A3028";
                  e.currentTarget.style.boxShadow = "0 2px 0 #100806, inset 0 1px 0 rgba(255,160,80,0.06)";
                }}
              >
                <CircleHelp size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div
        className="mt-auto p-3"
        style={{ borderTop: "1.5px solid #3D2C28" }}
      >
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#504040", lineHeight: 1.5 }}>
          ⌘+Enter → run<br />⌘+S → save
        </p>
      </div>

      {infoNode && (
        <NodeInfoModal
          nodeType={infoNode.type}
          label={infoNode.label}
          icon={infoNode.icon}
          accent={infoNode.accent}
          shadow={infoNode.shadow}
          onClose={() => setInfoNode(null)}
        />
      )}
    </div>
  );
}
