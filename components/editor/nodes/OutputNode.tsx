"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ImageIcon, Download, Copy, Loader2, Maximize2, X } from "lucide-react";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NodeDeleteButton } from "./NodeDeleteButton";

export function OutputNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const status         = (data.status        as string)      ?? "idle";
  const imageBase64    = data.imageBase64    as string | null;
  const size           = (data.size          as string)      ?? "";
  const prompt         = (data.prompt        as string)      ?? "";
  const originalPrompt = (data.originalPrompt as string | null) ?? null;

  const [fullscreen, setFullscreen] = useState(false);

  // Listen for global Cmd+Shift+F
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { imageBase64: string; prompt: unknown } | undefined;
      if (detail?.imageBase64 === imageBase64 && imageBase64) setFullscreen(true);
    };
    window.addEventListener("ac:fullscreen", handler);
    return () => window.removeEventListener("ac:fullscreen", handler);
  }, [imageBase64]);

  // Close on Escape
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen]);

  const handleDownload = () => {
    if (!imageBase64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = `atomicchain-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    if (!imageBase64) return;
    const blob = await fetch(`data:image/png;base64,${imageBase64}`).then((r) => r.blob());
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  };

  return (
    <div className="retro-node" style={{ width: 380 }}>
      <div className="retro-node-header node-drag-handle node-header-emerald">
        <ImageIcon size={16} />
        <span>Output</span>
        {size && (
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#2A6040" }}>
            {size}
          </span>
        )}
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight={!size} />
      </div>

      <div style={{ padding: "14px" }}>
        {status === "generating" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 200, gap: 14,
          }}>
            <Loader2 size={34} className="animate-spin" style={{ color: "#1A9E5A" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#2A6040" }}>
              Generating…
            </span>
            <div style={{
              width: "70%", height: 5, borderRadius: 3,
              background: "#180E0C", border: "1px solid #0A3020", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: "55%",
                background: "linear-gradient(90deg, #0A5030, #1A9E5A, #40D880)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.2s ease infinite",
                borderRadius: 3,
              }} />
            </div>
          </div>
        )}

        {!imageBase64 && status !== "generating" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 200, gap: 12,
            border: "2px dashed #1A3828", borderRadius: 10,
          }}>
            <ImageIcon size={38} style={{ color: "#1A3828" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#2A4030" }}>
              Output will appear here
            </span>
          </div>
        )}

        {imageBase64 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              borderRadius: 10, overflow: "hidden",
              border: "1.5px solid #1A3828",
              boxShadow: "0 4px 0 #040C08, inset 0 0 0 1px rgba(26,158,90,0.08)",
            }}>
              <NextImage
                src={`data:image/png;base64,${imageBase64}`}
                alt={prompt || "Generated image"}
                width={380}
                height={380}
                className="w-full h-auto"
                unoptimized
              />
            </div>

            {originalPrompt && (
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#506050" }}>{originalPrompt}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#2A8050", fontStyle: "italic" }}>→ {prompt}</p>
              </div>
            )}
            {!originalPrompt && prompt && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#506050", lineHeight: 1.6 }}>{prompt}</p>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleDownload} className="bubble-btn-ghost flex-1 flex items-center justify-center gap-2" style={{ padding: "8px 10px" }}>
                <Download size={14} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>SAVE</span>
              </button>
              <button onClick={handleCopy} className="bubble-btn-ghost flex-1 flex items-center justify-center gap-2" style={{ padding: "8px 10px" }}>
                <Copy size={14} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>COPY</span>
              </button>
              <button onClick={() => setFullscreen(true)} className="bubble-btn-ghost bubble-btn-icon" title="Fullscreen (⌘⇧F)" style={{ width: 42, height: 38 }}>
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left}  id="image-in"  style={{ top: "50%", background: "#1A9E5A", width: 16, height: 16 }} />
      <Handle type="source" position={Position.Right} id="image-out" style={{ top: "50%", background: "#0A7040", width: 16, height: 16 }} />

      {/* Fullscreen overlay — portalled to document.body so position:fixed
          is relative to the viewport, not the ReactFlow transform context */}
      {fullscreen && imageBase64 && typeof document !== "undefined" && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setFullscreen(false)}
        >
          {/* Image fills the viewport, letterboxed */}
          <img
            src={`data:image/png;base64,${imageBase64}`}
            alt={prompt || "Generated"}
            style={{
              maxWidth: "100vw",
              maxHeight: "100vh",
              objectFit: "contain",
              display: "block",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close button — top-right corner of viewport */}
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              background: "rgba(20,14,14,0.88)",
              border: "1.5px solid #4A3028",
              borderRadius: 8,
              color: "#C0A090",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>

          {/* Prompt caption — bottom-center, never overflows */}
          {prompt && (
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "16px 24px",
                background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "rgba(255,220,180,0.85)",
                  margin: 0,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {prompt}
              </p>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
