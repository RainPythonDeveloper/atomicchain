"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Textarea } from "@/components/ui/textarea";
import { useAtomicStore } from "@/lib/store";
import { MinusCircle } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const PRESETS = ["blurry, low quality", "distorted, ugly", "watermark, text", "nsfw, explicit"];

export function NegativeNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const prompt = (data.prompt as string) ?? "";

  return (
    <div className="retro-node" style={{ width: 380 }}>
      <div className="retro-node-header node-drag-handle node-header-crimson">
        <MinusCircle size={16} />
        <span>Negative Prompt</span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight />
      </div>
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Textarea
          value={prompt}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          placeholder="What to avoid..."
          className="nodrag nowheel retro-input"
          style={{ minHeight: 88, resize: "none", fontSize: "0.85rem" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => updateNodeData(id, { prompt: prompt ? `${prompt}, ${p}` : p })}
              className="nodrag retro-chip"
            >
              +{p.split(",")[0]}
            </button>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="negative-out"
        style={{ background: "#C42020", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
