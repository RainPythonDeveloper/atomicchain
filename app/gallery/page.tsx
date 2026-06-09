"use client";

import { useAtomicStore } from "@/lib/store";
import { ArrowLeft, Download, Images } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function GalleryPage() {
  const { gallery, addToGallery } = useAtomicStore();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ac-gallery");
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items) && items.length > 0 && gallery.length === 0) {
          items.forEach((item) => addToGallery(item));
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = (imageBase64: string, idx: number) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = `atomicchain-${idx + 1}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen retro-bg" style={{ color: "var(--ac-text)" }}>
      {/* Header */}
      <div style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 16px",
        background: "linear-gradient(180deg, #272122 0%, #221D1F 100%)",
        borderBottom: "2px solid #3D2C28",
        boxShadow: "0 2px 0 #0A0604, 0 3px 0 1px #050202",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* Icon badge */}
          <div style={{
            width: 34, height: 34,
            borderRadius: "8px 0 0 8px",
            background: "linear-gradient(160deg, #2A1810 0%, #1A1010 100%)",
            border: "1.5px solid #5A3020",
            borderRight: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", position: "relative", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 80%, rgba(240,77,7,0.22) 0%, transparent 70%)",
            }} />
            <Image src="/hephaestus.png" alt="logo" width={26} height={26}
              style={{ objectFit: "contain", position: "relative", zIndex: 1 }} />
          </div>
          {/* Text badge */}
          <div style={{
            height: 34,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 10px",
            background: "linear-gradient(160deg, #221810 0%, #1A1208 100%)",
            border: "1.5px solid #5A3020",
            borderLeft: "1px solid #3A2010",
            borderRadius: "0 8px 8px 0",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#F0D8C0", lineHeight: 1 }}>Atomic</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#F04D07", lineHeight: 1, marginTop: 2, textShadow: "0 0 8px rgba(240,77,7,0.6)" }}>Chain</span>
          </div>
        </div>

        <div style={{ width: 1, height: 20, background: "#3D2C28" }} />

        <Link href="/editor">
          <button className="bubble-btn-ghost flex items-center gap-1.5" style={{ padding: "5px 10px" }}>
            <ArrowLeft size={12} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
              EDITOR
            </span>
          </button>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Images size={13} style={{ color: "#706060" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em" }}>
            Gallery
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.65rem",
            color: "#F04D07", marginLeft: 2,
            textShadow: "0 0 8px rgba(240,77,7,0.5)",
          }}>
            ({gallery.length})
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {gallery.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 400, gap: 16,
          }}>
            <Images size={48} style={{ color: "#3A2218", opacity: 0.5 }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", fontWeight: 700, color: "#706060", letterSpacing: "0.08em" }}>
                NO IMAGES YET
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#504040", marginTop: 6 }}>
                Generate images in the editor to see them here
              </p>
            </div>
            <Link href="/editor">
              <button className="bubble-btn flex items-center gap-1.5" style={{ padding: "8px 20px" }}>
                Open Editor
              </button>
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}>
            {gallery.map((item, idx) => (
              <div
                key={`${item.timestamp}-${idx}`}
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--ac-surface)",
                  border: "1.5px solid #3D2C28",
                  boxShadow: "0 0 0 1px #0A0604, 0 5px 0 0 #1A0E0C, 0 6px 0 1px #080402",
                  transition: "filter 0.15s ease, border-color 0.15s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = "brightness(1.08)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#5A3020";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = "";
                  (e.currentTarget as HTMLElement).style.borderColor = "#3D2C28";
                }}
              >
                <Image
                  src={`data:image/png;base64,${item.imageBase64}`}
                  alt={item.prompt || "Generated image"}
                  width={256}
                  height={256}
                  className="w-full h-auto"
                  unoptimized
                />
                {/* Overlay */}
                <div className="group" style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(20,8,4,0.92) 0%, transparent 50%)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "10px",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
                >
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                    color: "#D0A080", lineHeight: 1.4, marginBottom: 8,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {item.prompt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#706060" }}>
                      {item.size}
                    </span>
                    <button
                      onClick={() => handleDownload(item.imageBase64, idx)}
                      className="bubble-btn-ghost bubble-btn-icon"
                      style={{ width: 28, height: 28, borderRadius: 6 }}
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
