"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Film, Loader2, Download, Link2, Unlink, Play } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const MOTION_PRESETS = [
  "gentle camera push-in",  "slow pan to the right",
  "wind moving through",    "drifting clouds",
  "subtle parallax depth",  "flickering light",
  "rippling water",         "cinematic dolly zoom",
];

// Cosmos resolution presets → [api value, label, aspect badge]
const RESOLUTIONS = [
  { value: "720_16_9", label: "720p", aspect: "16:9" },
  { value: "720_9_16", label: "720p", aspect: "9:16" },
  { value: "720_1_1",  label: "720p", aspect: "1:1"  },
  { value: "480_16_9", label: "480p", aspect: "16:9" },
];

// Duration presets at 24fps → frame counts
const DURATIONS = [
  { frames: 33,  label: "1.4s" },
  { frames: 57,  label: "2.4s" },
  { frames: 81,  label: "3.4s" },
  { frames: 121, label: "5.0s" },
];

export function VideoNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const nodes = useAtomicStore((s) => s.nodes);
  const edges = useAtomicStore((s) => s.edges);

  const motionPrompt = (data.motionPrompt as string)      ?? "";
  const resolution   = (data.resolution   as string)      ?? "720_16_9";
  const frames       = (data.frames       as number)      ?? 57;
  const status       = (data.status       as string)      ?? "idle";
  const videoBase64  = (data.videoBase64  as string | null) ?? null;
  const errorMsg     = (data.errorMsg     as string | null) ?? null;

  const incomingEdge = edges.find((e) => e.target === id && e.targetHandle === "image-in");
  const sourceNode   = incomingEdge ? nodes.find((n) => n.id === incomingEdge.source) : null;
  const sourceImage  = (sourceNode?.data?.imageBase64 as string | null) ?? null;
  const hasImage     = !!sourceImage;

  const isLoading = status === "generating";

  const handleGenerate = async () => {
    if (!sourceImage) return;
    updateNodeData(id, { status: "generating", errorMsg: null });
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: motionPrompt,
          image: sourceImage,
          resolution,
          num_output_frames: frames,
          fps: 24,
          seed: Math.floor(Math.random() * 100000),
        }),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        updateNodeData(id, { status: "error", errorMsg: result.error || "Generation failed" });
        return;
      }
      updateNodeData(id, { status: "done", videoBase64: result.videoBase64, errorMsg: null });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Request failed";
      updateNodeData(id, { status: "error", errorMsg: message });
    }
  };

  const handleDownload = () => {
    if (!videoBase64) return;
    const link = document.createElement("a");
    link.href = `data:video/mp4;base64,${videoBase64}`;
    link.download = `atomicchain-${Date.now()}.mp4`;
    link.click();
  };

  return (
    <div className="retro-node" style={{ width: 380 }}>
      <div className="retro-node-header node-drag-handle node-header-cyan">
        <Film size={16} />
        <span>Video</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          {hasImage ? (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#38D6F0" }}>
              <Link2 size={11} /> image
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#504040" }}>
              <Unlink size={11} /> no image
            </span>
          )}
        </div>
        <NodeDeleteButton id={id} show={!!isNodeSelected} />
      </div>

      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 11 }}>
        {/* Source image preview */}
        {hasImage && (
          <div style={{
            borderRadius: 8, overflow: "hidden", border: "1.5px solid #143840",
            boxShadow: "inset 0 0 0 1px rgba(56,214,240,0.08)", position: "relative",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${sourceImage}`}
              alt="Source frame"
              style={{ width: "100%", height: 110, objectFit: "cover", display: "block", opacity: 0.85 }}
            />
            <span style={{
              position: "absolute", top: 6, left: 6, padding: "2px 7px", borderRadius: 5,
              background: "rgba(8,20,24,0.85)", border: "1px solid rgba(56,214,240,0.3)",
              fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#38D6F0",
            }}>
              SOURCE FRAME
            </span>
          </div>
        )}

        {/* Motion prompt */}
        <div>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#706060", display: "block", marginBottom: 6 }}>
            Motion description
          </label>
          <Textarea
            value={motionPrompt}
            onChange={(e) => updateNodeData(id, { motionPrompt: e.target.value })}
            placeholder="gentle camera push-in, wind through the trees..."
            className="nodrag nowheel retro-input"
            style={{ minHeight: 64, resize: "none", fontSize: "0.85rem" }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {MOTION_PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => updateNodeData(id, { motionPrompt: motionPrompt ? `${motionPrompt}, ${s}` : s })}
              className="nodrag retro-chip"
            >
              +{s}
            </button>
          ))}
        </div>

        {/* Resolution */}
        <div>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#706060", display: "block", marginBottom: 6 }}>
            RESOLUTION
          </label>
          <div style={{ display: "flex", gap: 5 }}>
            {RESOLUTIONS.map((r) => {
              const active = resolution === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => updateNodeData(id, { resolution: r.value })}
                  className="nodrag"
                  style={{
                    flex: 1, padding: "7px 4px", borderRadius: 7, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700,
                    lineHeight: 1.3, transition: "all 0.08s",
                    background: active
                      ? "linear-gradient(180deg, #06B6D4 0%, #0878A0 100%)"
                      : "linear-gradient(180deg,#1A2226 0%,#141A1E 100%)",
                    border: `1.5px solid ${active ? "#0A6080" : "#243038"}`,
                    borderBottomColor: active ? "#04303F" : "#0C1216",
                    color: active ? "#fff" : "#607078",
                    boxShadow: active
                      ? "0 3px 0 #04303F,0 4px 0 1px #021820,0 0 12px rgba(6,182,212,0.3),inset 0 1px 0 rgba(255,255,255,0.2)"
                      : "0 3px 0 #0A0E10,0 4px 0 1px #060809",
                  }}
                >
                  {r.label}<br />
                  <span style={{ opacity: 0.75, fontSize: "0.56rem" }}>{r.aspect}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#706060", display: "block", marginBottom: 6 }}>
            DURATION (24 FPS)
          </label>
          <div style={{ display: "flex", gap: 5 }}>
            {DURATIONS.map((d) => {
              const active = frames === d.frames;
              return (
                <button
                  key={d.frames}
                  onClick={() => updateNodeData(id, { frames: d.frames })}
                  className="nodrag"
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 7, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 800,
                    transition: "all 0.08s",
                    background: active
                      ? "linear-gradient(180deg, #06B6D4 0%, #0878A0 100%)"
                      : "linear-gradient(180deg,#1A2226 0%,#141A1E 100%)",
                    border: `1.5px solid ${active ? "#0A6080" : "#243038"}`,
                    borderBottomColor: active ? "#04303F" : "#0C1216",
                    color: active ? "#fff" : "#607078",
                    boxShadow: active
                      ? "0 3px 0 #04303F,0 4px 0 1px #021820,0 0 12px rgba(6,182,212,0.3),inset 0 1px 0 rgba(255,255,255,0.2)"
                      : "0 3px 0 #0A0E10,0 4px 0 1px #060809",
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !hasImage}
          className="nodrag bubble-btn w-full flex items-center justify-center gap-2"
          style={{ padding: "11px 16px", fontSize: "0.82rem" }}
        >
          {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
          {isLoading ? "ANIMATING…" : hasImage ? "ANIMATE IMAGE" : "CONNECT AN IMAGE"}
        </button>

        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "#2A8090" }}>
              Cosmos is rendering frames — this can take up to a few minutes
            </span>
            <div style={{ width: "80%", height: 5, borderRadius: 3, background: "#0A1418", border: "1px solid #0A3038", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: "55%",
                background: "linear-gradient(90deg, #044050, #06B6D4, #5CE8FF)",
                backgroundSize: "200% 100%", animation: "shimmer 1.2s ease infinite", borderRadius: 3,
              }} />
            </div>
          </div>
        )}

        {errorMsg && status === "error" && (
          <div style={{
            padding: "9px 12px", borderRadius: 7,
            background: "#1E0A0A", border: "1px solid rgba(196,32,32,0.35)",
            fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "#E06060", lineHeight: 1.5,
          }}>
            {errorMsg}
          </div>
        )}

        {/* Result video */}
        {videoBase64 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              borderRadius: 10, overflow: "hidden", border: "1.5px solid #143840",
              boxShadow: "0 4px 0 #04141A, inset 0 0 0 1px rgba(56,214,240,0.1)",
            }}>
              <video
                src={`data:video/mp4;base64,${videoBase64}`}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="nowheel"
                style={{ width: "100%", display: "block", background: "#000" }}
              />
            </div>
            <button onClick={handleDownload} className="bubble-btn-ghost w-full flex items-center justify-center gap-2" style={{ padding: "8px 10px" }}>
              <Download size={14} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>SAVE MP4</span>
            </button>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="image-in"
        style={{ top: "50%", background: "#06B6D4", width: 16, height: 16 }} />
      <Handle type="source" position={Position.Right} id="video-out"
        style={{ top: "50%", background: "#0878A0", width: 16, height: 16 }} />
    </div>
  );
}
