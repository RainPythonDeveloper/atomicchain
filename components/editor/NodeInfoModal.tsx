"use client";

import { useEffect, useState } from "react";
import { X, Film, BookOpen, ListOrdered, Cable, Lightbulb, type LucideIcon } from "lucide-react";
import { NODE_DOCS } from "@/lib/nodeDocs";

interface NodeInfoModalProps {
  nodeType: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  shadow: string;
  onClose: () => void;
}

export function NodeInfoModal({ nodeType, label, icon: Icon, accent, shadow, onClose }: NodeInfoModalProps) {
  const doc = NODE_DOCS[nodeType];
  const [videoMissing, setVideoMissing] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!doc) return null;

  const sectionLabel = (SIcon: LucideIcon, text: string) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, marginBottom: 7,
      fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 800,
      letterSpacing: "0.16em", textTransform: "uppercase", color: accent,
      textShadow: `0 0 8px ${accent}55`,
    }}>
      <SIcon size={12} />
      {text}
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(10,6,4,0.78)",
        backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "nodeDeleteFadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560, maxWidth: "100%", maxHeight: "88vh",
          display: "flex", flexDirection: "column",
          borderRadius: 14, overflow: "hidden",
          background: "linear-gradient(180deg, #241E20 0%, #1F1B1E 100%)",
          border: "2px solid #3D2C28",
          boxShadow: `
            0 0 0 1px #0A0604,
            0 8px 0 0 ${shadow},
            0 10px 0 1px #080402,
            0 24px 60px rgba(0,0,0,0.6),
            0 0 40px ${accent}18
          `,
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 16px",
          borderBottom: `1.5px solid ${accent}50`,
          background: `linear-gradient(180deg, ${accent}30 0%, ${accent}14 100%)`,
          flexShrink: 0,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: `linear-gradient(180deg, ${accent}38 0%, ${accent}1C 100%)`,
            border: `1.5px solid ${accent}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 0 ${shadow}`,
            flexShrink: 0,
          }}>
            <Icon size={17} style={{ color: accent }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 800,
              letterSpacing: "0.1em", textTransform: "uppercase", color: accent,
              textShadow: `0 0 10px ${accent}66`,
            }}>
              {label}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.64rem", color: "#988880", marginTop: 1 }}>
              {doc.tagline}
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            style={{
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "5px 9px", color: "#fff", cursor: "pointer", borderRadius: 6,
              background: "linear-gradient(180deg, #C42020 0%, #8B0E0E 100%)",
              border: "1.5px solid #6A0808", borderBottomColor: "#2A0202",
              boxShadow: "0 0 0 1px #1A0202, 0 3px 0 0 #5A0606, 0 4px 0 1px #0A0101, inset 0 1px 0 rgba(255,120,120,0.3)",
              transition: "filter 0.1s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ""; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(2px)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = ""; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Video tutorial slot */}
          <div>
            {sectionLabel(Film, "Video Tutorial")}
            {!videoMissing ? (
              <video
                src={`/node-videos/${nodeType}.mp4`}
                controls
                playsInline
                onError={() => setVideoMissing(true)}
                style={{
                  width: "100%", aspectRatio: "16/9", display: "block",
                  borderRadius: 10, background: "#0F0A08",
                  border: "1.5px solid #3A2218",
                  boxShadow: "0 4px 0 #100806, inset 0 0 0 1px rgba(240,77,7,0.06)",
                }}
              />
            ) : (
              <div style={{
                width: "100%", aspectRatio: "16/9",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                borderRadius: 10,
                background: "repeating-linear-gradient(-45deg, #16100E 0 14px, #1A1310 14px 28px)",
                border: `2px dashed ${accent}40`,
              }}>
                <Film size={30} style={{ color: `${accent}70` }} />
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.66rem", fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase", color: `${accent}90`,
                }}>
                  Video coming soon
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "#605048" }}>
                  /node-videos/{nodeType}.mp4
                </span>
              </div>
            )}
          </div>

          {/* What it does */}
          <div>
            {sectionLabel(BookOpen, "Что делает")}
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "0.74rem",
              color: "#C0ABA0", lineHeight: 1.7, margin: 0,
            }}>
              {doc.description}
            </p>
          </div>

          {/* How to use */}
          <div>
            {sectionLabel(ListOrdered, "Как использовать")}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {doc.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 800,
                    color: accent,
                    background: `linear-gradient(180deg, ${accent}24 0%, ${accent}10 100%)`,
                    border: `1.5px solid ${accent}40`,
                    boxShadow: `0 2px 0 ${shadow}`,
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#B0998E", lineHeight: 1.6 }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connections */}
          <div>
            {sectionLabel(Cable, "Соединения")}
            <div style={{
              padding: "9px 13px", borderRadius: 8,
              background: "#180E0C",
              border: `1.5px solid ${accent}30`,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
              fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: accent, lineHeight: 1.6,
            }}>
              {doc.connects}
            </div>
          </div>

          {/* Pro tip */}
          {doc.tip && (
            <div style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              padding: "11px 13px", borderRadius: 8,
              background: "linear-gradient(180deg, rgba(240,77,7,0.10) 0%, rgba(137,26,6,0.07) 100%)",
              border: "1.5px solid rgba(240,77,7,0.25)",
            }}>
              <Lightbulb size={14} style={{ color: "#F04D07", flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#D89070", lineHeight: 1.6 }}>
                {doc.tip}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
