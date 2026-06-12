"use client";

import { useAtomicStore } from "@/lib/store";

function buildPreviewPrompt(
  nodes: ReturnType<typeof useAtomicStore.getState>["nodes"],
  edges: ReturnType<typeof useAtomicStore.getState>["edges"],
): string {
  const genNode = nodes.find((n) => n.type === "generateNode");
  if (!genNode) return "";

  let prompt = "";
  let styleModifier = "";
  const modifiers: string[] = [];

  for (const edge of edges) {
    if (edge.target !== genNode.id) continue;
    const src = nodes.find((n) => n.id === edge.source);
    if (!src) continue;

    if (src.type === "promptNode" || src.type === "diceNode") {
      prompt = (src.data.prompt as string) || prompt;
    } else if (src.type === "combinerNode") {
      prompt = (src.data.combined as string) || prompt;
    } else if (src.type === "refineNode") {
      const refined = (src.data.refinedPrompt as string) || "";
      const improvement = (src.data.improvement as string) || "";
      if (refined) prompt = refined;
      else if (improvement) prompt = prompt ? `${prompt}, ${improvement}` : improvement;
    } else if (src.type === "styleNode") {
      styleModifier = (src.data.styleModifier as string) || "";
    } else if (
      src.type === "cameraNode" || src.type === "moodNode" || src.type === "artistStyleNode" ||
      src.type === "lightingNode" || src.type === "colorPaletteNode" ||
      src.type === "materialNode" || src.type === "timeMachineNode" || src.type === "fxNode" ||
      src.type === "aspectRatioNode"
    ) {
      const m = (src.data.modifier as string) || "";
      if (m) modifiers.push(m);
    }
  }

  if (styleModifier && prompt) prompt = `${prompt}, ${styleModifier}`;
  if (modifiers.length) prompt = prompt ? `${prompt}, ${modifiers.join(", ")}` : modifiers.join(", ");

  return prompt;
}

export function PromptPreview() {
  const nodes = useAtomicStore((s) => s.nodes);
  const edges = useAtomicStore((s) => s.edges);
  const isRunning = useAtomicStore((s) => s.isRunning);

  const preview = buildPreviewPrompt(nodes, edges);
  if (!preview) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        pointerEvents: "none",
        padding: "10px 20px",
        background: "linear-gradient(0deg, rgba(10,8,10,0.92) 0%, rgba(10,8,10,0.0) 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: isRunning ? "#FFB040" : "#F04D07",
            flexShrink: 0,
            textShadow: isRunning ? "0 0 10px rgba(255,176,64,0.8)" : "0 0 6px rgba(240,77,7,0.5)",
            transition: "color 0.3s, text-shadow 0.3s",
          }}
        >
          PROMPT
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: isRunning ? "#FFD090" : "#C09070",
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            textShadow: isRunning ? "0 0 8px rgba(255,176,64,0.4)" : "none",
            transition: "color 0.3s, text-shadow 0.3s",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {preview}
        </span>
      </div>
    </div>
  );
}
