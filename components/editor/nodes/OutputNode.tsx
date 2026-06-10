"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ImageIcon, Download, Copy, Loader2 } from "lucide-react";
import Image from "next/image";
import { NodeDeleteButton } from "./NodeDeleteButton";

export function OutputNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const status         = (data.status        as string)      ?? "idle";
  const imageBase64    = data.imageBase64    as string | null;
  const size           = (data.size          as string)      ?? "";
  const prompt         = (data.prompt        as string)      ?? "";
  const originalPrompt = (data.originalPrompt as string | null) ?? null;

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
              <Image
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
            </div>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left}  id="image-in"  style={{ top: "50%", background: "#1A9E5A", width: 16, height: 16 }} />
      <Handle type="source" position={Position.Right} id="image-out" style={{ top: "50%", background: "#0A7040", width: 16, height: 16 }} />
    </div>
  );
}
