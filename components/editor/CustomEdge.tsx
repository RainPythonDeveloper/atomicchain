"use client";

import { useState, useCallback } from "react"; // useState kept for hover highlight
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import { Scissors } from "lucide-react";
import { useAtomicStore } from "@/lib/store";

export function CustomEdge({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  selected,
  animated,
}: EdgeProps) {
  const [hovered, setHovered] = useState(false);
  const setEdges = useAtomicStore((s) => s.setEdges);
  const edges    = useAtomicStore((s) => s.edges);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const deleteEdge = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges(edges.filter((edge) => edge.id !== id));
  }, [id, edges, setEdges]);

  // Visual highlight on hover OR selection; CUT button only on explicit selection (click)
  const isHighlighted = hovered || selected;

  return (
    <>
      {/* Wide invisible hit area — easier to hover/click */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Visible edge */}
      <BaseEdge
        path={edgePath}
        className={animated ? "ac-edge-animated" : ""}
        style={{
          stroke: isHighlighted ? "#FF8050" : "#F04D07",
          strokeWidth: isHighlighted ? 2.5 : 2,
          filter: `drop-shadow(0 0 ${isHighlighted ? 7 : 3}px rgba(240,77,7,${isHighlighted ? 0.85 : 0.45}))`,
          transition: "stroke 0.15s, stroke-width 0.15s, filter 0.15s",
        }}
      />

      <EdgeLabelRenderer>
        {selected && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              zIndex: 10,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              onClick={deleteEdge}
              title="Disconnect"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
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
                transition: "filter 0.1s, box-shadow 0.1s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "brightness(1.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px #1A0202, 0 1px 0 0 #5A0606, inset 0 2px 3px rgba(0,0,0,0.4)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              <Scissors size={11} />
              CUT
            </button>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
