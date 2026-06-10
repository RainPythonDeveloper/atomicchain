"use client";

import { X } from "lucide-react";
import { useAtomicStore } from "@/lib/store";

interface Props {
  id: string;
  show: boolean;
  pushRight?: boolean;
}

export function NodeDeleteButton({ id, show, pushRight }: Props) {
  const deleteNode = useAtomicStore((s) => s.deleteNode);

  if (!show) return null;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
      className="nodrag"
      title="Delete node"
      style={{
        marginLeft: pushRight ? "auto" : undefined,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 8px",
        color: "#fff",
        background: "linear-gradient(180deg, #C42020 0%, #8B0E0E 100%)",
        border: "1.5px solid #6A0808",
        borderBottomColor: "#2A0202",
        borderRadius: 6,
        cursor: "pointer",
        boxShadow: `
          0 0 0 1px #1A0202,
          0 3px 0 0 #5A0606,
          0 4px 0 1px #0A0101,
          inset 0 1px 0 rgba(255,120,120,0.3),
          0 0 12px rgba(196,32,32,0.5)
        `,
        transition: "filter 0.1s",
        animation: "nodeDeleteFadeIn 0.1s ease",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.2)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px #1A0202, 0 1px 0 0 #5A0606, inset 0 2px 3px rgba(0,0,0,0.4)";
      }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
    >
      <X size={13} />
    </button>
  );
}
