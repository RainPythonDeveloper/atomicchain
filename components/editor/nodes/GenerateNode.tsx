"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Zap, Loader2, CheckCircle, XCircle } from "lucide-react";

export function GenerateNode({ id, data }: NodeProps) {
  const { runWorkflow, isRunning } = useAtomicStore();
  const status = (data.status as string) ?? "idle";

  const statusCfg = {
    idle:       { label: "READY",  color: "#706060" },
    generating: { label: "PROC…",  color: "#F04D07" },
    done:       { label: "DONE",   color: "#1A9E5A" },
    error:      { label: "ERROR",  color: "#C42020" },
  }[status] ?? { label: "READY", color: "#706060" };

  const StatusIcon = { idle: Zap, generating: Loader2, done: CheckCircle, error: XCircle }[status] ?? Zap;

  return (
    <div className={`retro-node ${isRunning ? "node-generating" : ""}`} style={{ width: 240 }}>
      <div className="retro-node-header node-drag-handle node-header-orange">
        <StatusIcon size={16} className={status === "generating" ? "animate-spin" : ""} />
        <span>Generate</span>
        <span style={{
          marginLeft: "auto", fontSize: "0.68rem",
          color: statusCfg.color, textShadow: `0 0 8px ${statusCfg.color}99`,
        }}>
          {statusCfg.label}
        </span>
      </div>

      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        {/* Progress bar */}
        <div style={{
          width: "100%", height: 5, borderRadius: 3,
          background: "#180E0C", border: "1px solid #2A1410", overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: status === "done" ? "100%" : status === "generating" ? "65%" : status === "error" ? "25%" : "0%",
            background: status === "done"
              ? "linear-gradient(90deg, #0A6E3A, #1A9E5A)"
              : status === "error" ? "#C42020"
              : "linear-gradient(90deg, #891A06, #F04D07)",
            transition: "width 0.5s ease",
            boxShadow: `0 0 8px ${status === "done" ? "rgba(26,158,90,0.7)" : "rgba(240,77,7,0.6)"}`,
          }} />
        </div>

        <button
          onClick={() => runWorkflow()}
          disabled={isRunning}
          className="nodrag bubble-btn w-full flex items-center justify-center gap-2"
          style={{ padding: "10px 16px", fontSize: "0.8rem" }}
        >
          {isRunning ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
          {isRunning ? "RUNNING…" : "RUN"}
        </button>
      </div>

      <Handle type="target" position={Position.Left}  id="prompt-in"   style={{ top: "28%", background: "#2B7FE0", width: 16, height: 16 }} />
      <Handle type="target" position={Position.Left}  id="negative-in" style={{ top: "50%", background: "#C42020", width: 16, height: 16 }} />
      <Handle type="target" position={Position.Left}  id="size-in"     style={{ top: "72%", background: "#0A9E8A", width: 16, height: 16 }} />
      <Handle type="source" position={Position.Right} id="image-out"   style={{ top: "50%", background: "#F04D07", width: 16, height: 16 }} />
    </div>
  );
}
