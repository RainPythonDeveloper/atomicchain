"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Zap, Loader2, CheckCircle, XCircle } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

// Handle order top→bottom: style, prompt, camera, lighting, fx
const HANDLE_LABELS = [
  { id: "style-in",    top: "15%", bg: "#9333EA", label: "style"    },
  { id: "prompt-in",   top: "28%", bg: "#2B7FE0", label: "prompt"   },
  { id: "camera-in",   top: "43%", bg: "#F59E0B", label: "camera"   },
  { id: "lighting-in", top: "58%", bg: "#FB923C", label: "lighting" },
  { id: "fx-in",       top: "73%", bg: "#9EF01A", label: "fx"       },
  { id: "modifier-in", top: "88%", bg: "#706060", label: "other"    },
];

export function GenerateNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const runWorkflow = useAtomicStore((s) => s.runWorkflow);
  const isRunning   = useAtomicStore((s) => s.isRunning);
  // Is THIS generate part of the active run? Drives this node's running visual,
  // so launching one Generate doesn't light up every Generate on the canvas.
  const isThisRunning = useAtomicStore((s) => s.runningChain.includes(id));
  const status = (data.status as string) ?? "idle";

  const statusCfg = {
    idle:       { label: "READY",  color: "#706060" },
    generating: { label: "PROC…",  color: "#F04D07" },
    done:       { label: "DONE",   color: "#1A9E5A" },
    error:      { label: "ERROR",  color: "#C42020" },
  }[status] ?? { label: "READY", color: "#706060" };

  const StatusIcon = { idle: Zap, generating: Loader2, done: CheckCircle, error: XCircle }[status] ?? Zap;

  return (
    <div className={`retro-node ${isThisRunning ? "node-generating" : ""}`} style={{ width: 240 }}>
      <div className="retro-node-header node-drag-handle node-header-orange">
        <StatusIcon size={16} className={status === "generating" ? "animate-spin" : ""} />
        <span>Generate</span>
        <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: statusCfg.color, textShadow: `0 0 8px ${statusCfg.color}99` }}>
          {statusCfg.label}
        </span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} />
      </div>

      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        {/* Input labels */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
          {HANDLE_LABELS.map((h) => (
            <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: h.bg, flexShrink: 0, boxShadow: `0 0 4px ${h.bg}88` }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#505050" }}>{h.label}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#180E0C", border: "1px solid #2A1410", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: status === "done" ? "100%" : status === "generating" ? "65%" : status === "error" ? "25%" : "0%",
            background: status === "done" ? "linear-gradient(90deg,#0A6E3A,#1A9E5A)" : status === "error" ? "#C42020" : "linear-gradient(90deg,#891A06,#F04D07)",
            transition: "width 0.5s ease",
            boxShadow: `0 0 8px ${status === "done" ? "rgba(26,158,90,0.7)" : "rgba(240,77,7,0.6)"}`,
          }} />
        </div>

        <button
          onClick={() => runWorkflow(id)}
          disabled={isRunning}
          className="nodrag bubble-btn w-full flex items-center justify-center gap-2"
          style={{ padding: "10px 16px", fontSize: "0.8rem" }}
        >
          {isThisRunning ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
          {isThisRunning ? "RUNNING…" : "RUN"}
        </button>
      </div>

      {HANDLE_LABELS.map((h) => (
        <Handle key={h.id} type="target" position={Position.Left} id={h.id}
          style={{ top: h.top, background: h.bg, width: 16, height: 16 }} />
      ))}
      <Handle type="source" position={Position.Right} id="image-out"
        style={{ top: "50%", background: "#F04D07", width: 16, height: 16 }} />
    </div>
  );
}
