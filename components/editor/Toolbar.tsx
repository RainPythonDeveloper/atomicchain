"use client";

import { useAtomicStore } from "@/lib/store";
import { Zap, Save, FolderOpen, Trash2, Images, Loader2, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DEMO_PRESET } from "@/lib/presets";

export function Toolbar() {
  const { runWorkflow, saveWorkflow, loadWorkflow, clearCanvas, loadPreset, isRunning, generationStatus } = useAtomicStore();

  const statusInfo = {
    idle:       { label: "READY",       color: "#706060" },
    generating: { label: "GENERATING…", color: "#F04D07" },
    done:       { label: "DONE",        color: "#C07030" },
    error:      { label: "ERROR",       color: "#891A06" },
  }[generationStatus] ?? { label: "READY", color: "#706060" };

  return (
    <div
      className="flex items-center gap-3 px-5 shrink-0"
      style={{
        height: 68,
        background: "linear-gradient(180deg, #2A2224 0%, #221D1F 100%)",
        borderBottom: "2px solid #3D2C28",
        boxShadow: "0 2px 0 #0A0604, 0 3px 0 1px #050202, inset 0 1px 0 rgba(255,120,50,0.07)",
      }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center mr-4" style={{ gap: 0 }}>
        {/* Icon side */}
        <div style={{
          position: "relative",
          width: 52,
          height: 52,
          borderRadius: "10px 0 0 10px",
          background: "linear-gradient(160deg, #2E1C10 0%, #1C1010 100%)",
          border: "1.5px solid #6A3820",
          borderRight: "none",
          boxShadow: "inset 0 1px 0 rgba(255,130,50,0.14), -2px 0 0 #0A0400",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 85%, rgba(240,77,7,0.3) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />
          <Image
            src="/hephaestus.png"
            alt="AtomicChain"
            width={42}
            height={42}
            style={{ objectFit: "contain", position: "relative", zIndex: 1 }}
            priority
          />
        </div>

        {/* Text side */}
        <div style={{
          height: 52,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 16px",
          background: "linear-gradient(160deg, #261A10 0%, #1C1208 100%)",
          border: "1.5px solid #6A3820",
          borderLeft: "1px solid #3A2010",
          borderRadius: "0 10px 10px 0",
          boxShadow: "inset 0 1px 0 rgba(255,120,50,0.09), 2px 0 0 #0A0400",
          gap: 3,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#F5E0C8",
            lineHeight: 1,
            textShadow: "0 0 14px rgba(240,77,7,0.4)",
          }}>
            Atomic
          </span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#F04D07",
            lineHeight: 1,
            textShadow: "0 0 10px rgba(240,77,7,0.7)",
          }}>
            Chain
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "#3D2C28", flexShrink: 0 }} />

      {/* Run button */}
      <button
        onClick={() => runWorkflow()}
        disabled={isRunning}
        className="bubble-btn flex items-center gap-2"
        style={{ padding: "9px 22px", fontSize: "0.78rem" }}
      >
        {isRunning ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
        {isRunning ? "RUNNING…" : "RUN"}
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "#3D2C28", flexShrink: 0 }} />

      {/* Demo preset button */}
      <button
        onClick={() => loadPreset(DEMO_PRESET.nodes, DEMO_PRESET.edges)}
        disabled={isRunning}
        className="bubble-btn-ghost flex items-center gap-2"
        style={{ padding: "8px 14px", color: "#F0C060" }}
        title="Load demo pipeline"
      >
        <PlayCircle size={15} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.08em" }}>DEMO</span>
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "#3D2C28", flexShrink: 0 }} />

      {/* Icon buttons */}
      <button onClick={saveWorkflow}  className="bubble-btn-ghost bubble-btn-icon" title="Save (⌘S)"   style={{ width: 42, height: 42 }}><Save size={17} /></button>
      <button onClick={loadWorkflow}  className="bubble-btn-ghost bubble-btn-icon" title="Load"        style={{ width: 42, height: 42 }}><FolderOpen size={17} /></button>
      <button onClick={clearCanvas}   className="bubble-btn-ghost bubble-btn-icon" title="Reset"       style={{ width: 42, height: 42, color: "#891A06" }}><Trash2 size={17} /></button>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: statusInfo.color,
          textShadow: `0 0 10px ${statusInfo.color}99`,
        }}>
          {statusInfo.label}
        </span>

        <div style={{ width: 1, height: 28, background: "#3D2C28" }} />

        <Link href="/gallery">
          <button className="bubble-btn-ghost flex items-center gap-2" style={{ padding: "8px 16px" }}>
            <Images size={16} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", letterSpacing: "0.1em" }}>
              GALLERY
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}
