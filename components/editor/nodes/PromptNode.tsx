"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Textarea } from "@/components/ui/textarea";
import { useAtomicStore } from "@/lib/store";
import { MessageSquare } from "lucide-react";

export function PromptNode({ id, data }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const prompt = (data.prompt as string) ?? "";

  return (
    <div className="retro-node" style={{ width: 380 }}>
      <div className="retro-node-header node-drag-handle node-header-blue">
        <MessageSquare size={16} />
        <span>Prompt</span>
        <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "#4060A0" }}>
          {prompt.length} chars
        </span>
      </div>
      <div style={{ padding: "14px" }}>
        <Textarea
          value={prompt}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          placeholder="Describe your image..."
          className="nodrag nowheel retro-input"
          style={{ minHeight: 110, resize: "none", fontSize: "0.85rem" }}
        />
      </div>
      <Handle type="source" position={Position.Right} id="prompt-out"
        style={{ background: "#2B7FE0", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
