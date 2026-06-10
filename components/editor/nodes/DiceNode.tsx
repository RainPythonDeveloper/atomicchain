"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Dices } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const SUBJECTS = [
  "a colossal whale", "a tiny robot", "an ancient dragon", "a wandering samurai",
  "a glass astronaut", "a steampunk owl", "a giant chess piece", "a lonely lighthouse keeper",
  "a mechanical elephant", "a ghostly pirate ship", "a crystal fox", "a floating castle",
  "an origami phoenix", "a neon jellyfish", "a clockwork ballerina", "a stone golem",
];

const SETTINGS = [
  "drifting through a nebula", "in a flooded cathedral", "atop a skyscraper at dawn",
  "inside a giant snow globe", "in an overgrown subway station", "on a mirror-like salt flat",
  "in a bioluminescent forest", "above the clouds at sunset", "in an abandoned amusement park",
  "deep in a coral canyon", "on the rings of Saturn", "in a library that never ends",
  "during a meteor shower", "in a field of giant mushrooms", "inside a kaleidoscope",
];

const DETAILS = [
  "volumetric god rays", "swirling fireflies", "floating lanterns", "falling cherry blossoms",
  "rising steam and mist", "shattered glass frozen mid-air", "aurora borealis overhead",
  "rain falling upwards", "glowing runes", "drifting paper boats", "snow mixed with embers",
];

const STYLES = [
  "cinematic lighting, ultra detailed, 8K", "dreamy pastel tones, soft focus",
  "dramatic chiaroscuro, oil painting feel", "hyperrealistic, sharp focus, HDR",
  "ethereal glow, fantasy concept art", "moody atmosphere, film grain, anamorphic",
];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export function DiceNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const prompt = (data.prompt as string) ?? "";
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    // Quick slot-machine effect: cycle a few intermediate prompts
    let ticks = 0;
    const interval = setInterval(() => {
      updateNodeData(id, {
        prompt: `${pick(SUBJECTS)} ${pick(SETTINGS)}, ${pick(DETAILS)}, ${pick(STYLES)}`,
      });
      ticks++;
      if (ticks >= 6) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 90);
  };

  return (
    <div className="retro-node" style={{ width: 340 }}>
      <div className="retro-node-header node-drag-handle node-header-pink">
        <Dices size={16} />
        <span>Surprise Me</span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight />
      </div>

      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 11 }}>
        <button
          onClick={roll}
          disabled={rolling}
          className="nodrag bubble-btn w-full flex items-center justify-center gap-2"
          style={{
            padding: "11px 16px", fontSize: "0.82rem",
            background: "linear-gradient(180deg, #F472B6 0%, #EC4899 45%, #BE185D 100%)",
            border: "1.5px solid #831843",
            borderBottomColor: "#500724",
            boxShadow: `
              0 0 0 1px #2A0514,
              0 5px 0 0 #9D174D,
              0 6px 0 1px #1A030C,
              inset 0 1px 0 rgba(255,180,220,0.45),
              0 0 16px rgba(236,72,153,0.25)
            `,
          }}
        >
          <Dices size={15} className={rolling ? "animate-spin" : ""} />
          {rolling ? "ROLLING…" : "ROLL THE DICE"}
        </button>

        {prompt && (
          <div style={{
            padding: "11px 13px", borderRadius: 8,
            background: "#180E0C", border: "1.5px solid rgba(236,72,153,0.3)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), 0 0 10px rgba(236,72,153,0.08)",
            fontFamily: "var(--font-mono)", fontSize: "0.74rem",
            color: "#F0A8CC", lineHeight: 1.6,
            transition: "all 0.1s",
          }}>
            {prompt}
          </div>
        )}

        {!prompt && (
          <div style={{
            padding: "14px", borderRadius: 8, textAlign: "center",
            border: "2px dashed rgba(236,72,153,0.2)",
            fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#604050",
          }}>
            🎲 Roll for a random scene idea
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="prompt-out"
        style={{ background: "#EC4899", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
