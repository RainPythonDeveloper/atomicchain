"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const SUGGESTIONS = [
  "more detailed", "better lighting", "higher quality",
  "vivid colors",  "sharper focus",  "dramatic shadows",
  "add fog",       "golden hour",
];

export function RefineNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const nodes = useAtomicStore((s) => s.nodes);
  const edges = useAtomicStore((s) => s.edges);

  const improvement   = (data.improvement   as string)  ?? "";
  const refinedPrompt = (data.refinedPrompt as string)  ?? "";
  const isLoading     = (data.isLoading     as boolean) ?? false;
  const usedVision    = (data.usedVision    as boolean) ?? false;

  const incomingEdge = edges.find((e) => e.target === id && e.targetHandle === "image-in");
  const sourceNode   = incomingEdge ? nodes.find((n) => n.id === incomingEdge.source) : null;
  const hasImage     = !!(sourceNode?.data?.imageBase64 as string | null);

  const handleAnalyze = async () => {
    updateNodeData(id, { isLoading: true });
    const imageBase64    = (sourceNode?.data?.imageBase64 as string) ?? null;
    const originalPrompt = (sourceNode?.data?.prompt       as string) ?? "";
    try {
      const res = await fetch("/api/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, originalPrompt, improvement }),
      });
      const result = await res.json();
      updateNodeData(id, { refinedPrompt: result.refinedPrompt, usedVision: result.usedVision, isLoading: false });
    } catch {
      updateNodeData(id, { isLoading: false });
    }
  };

  return (
    <div className="retro-node" style={{ width: 380 }}>
      <div className="retro-node-header node-drag-handle node-header-magenta">
        <Sparkles size={16} />
        <span>Refine</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          {hasImage ? (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#C02880" }}>
              <Eye size={11} /> connected
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#504040" }}>
              <EyeOff size={11} /> no image
            </span>
          )}
        </div>
        <NodeDeleteButton id={id} show={!!isNodeSelected} />
      </div>

      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 11 }}>
        <div>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#706060", display: "block", marginBottom: 6 }}>
            What to improve?
          </label>
          <Textarea
            value={improvement}
            onChange={(e) => updateNodeData(id, { improvement: e.target.value })}
            placeholder="more detailed, better lighting..."
            className="nodrag nowheel retro-input"
            style={{ minHeight: 80, resize: "none", fontSize: "0.85rem" }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => updateNodeData(id, { improvement: improvement ? `${improvement}, ${s}` : s })}
              className="nodrag retro-chip"
            >
              +{s}
            </button>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !improvement.trim()}
          className="nodrag bubble-btn w-full flex items-center justify-center gap-2"
          style={{ padding: "10px 16px", fontSize: "0.8rem" }}
        >
          {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {isLoading ? "ANALYZING…" : "BUILD PROMPT"}
        </button>

        {refinedPrompt && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <CheckCircle size={13} style={{ color: "#C02880" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#C02880" }}>
                {usedVision ? "NVIDIA Vision ✦" : "Text refined"}
              </span>
            </div>
            <div className="nowheel" style={{
              padding: "10px 13px",
              borderRadius: 7,
              background: "#180E0C",
              border: "1.5px solid rgba(192,40,128,0.25)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "#D080B0",
              lineHeight: 1.6,
              maxHeight: 100,
              overflowY: "auto",
            }}>
              {refinedPrompt}
            </div>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left}  id="image-in"   style={{ top: "50%", background: "#C02880", width: 16, height: 16 }} />
      <Handle type="source" position={Position.Right} id="refined-out" style={{ top: "50%", background: "#8A1860", width: 16, height: 16 }} />
    </div>
  );
}
