"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useAtomicStore } from "@/lib/store";
import { Camera } from "lucide-react";
import { NodeDeleteButton } from "./NodeDeleteButton";

const SHOTS = [
  { label: "Extreme Close",  value: "extreme close-up shot" },
  { label: "Close-up",       value: "close-up shot" },
  { label: "Medium",         value: "medium shot" },
  { label: "Wide",           value: "wide shot" },
  { label: "Extreme Wide",   value: "extreme wide shot" },
  { label: "Aerial/Drone",   value: "aerial drone shot, bird's eye view" },
  { label: "Macro",          value: "macro photography" },
  { label: "POV",            value: "point of view shot, first person" },
];

const ANGLES = [
  { label: "Eye Level",  value: "eye level angle" },
  { label: "Low Angle",  value: "low angle, looking up" },
  { label: "High Angle", value: "high angle, looking down" },
  { label: "Dutch Tilt", value: "dutch tilt angle" },
  { label: "Bird's Eye", value: "bird's eye overhead view" },
  { label: "Worm's Eye", value: "worm's eye view, extreme low angle" },
];

export function CameraNode({ id, data, selected: isNodeSelected }: NodeProps) {
  const updateNodeData = useAtomicStore((s) => s.updateNodeData);
  const shot  = (data.shot  as string) ?? "";
  const angle = (data.angle as string) ?? "";

  const buildModifier = (s: string, a: string) => [s, a].filter(Boolean).join(", ");

  const selectShot = (v: string) => {
    const next = shot === v ? "" : v;
    updateNodeData(id, { shot: next, modifier: buildModifier(next, angle) });
  };
  const selectAngle = (v: string) => {
    const next = angle === v ? "" : v;
    updateNodeData(id, { angle: next, modifier: buildModifier(shot, next) });
  };

  return (
    <div className="retro-node" style={{ width: 320 }}>
      <div className="retro-node-header node-drag-handle node-header-amber">
        <Camera size={16} />
        <span>Camera Shot</span>
        <NodeDeleteButton id={id} show={!!isNodeSelected} pushRight />
      </div>
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Shot type */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#706060", marginBottom: 6 }}>SHOT TYPE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {SHOTS.map((s) => {
              const active = shot === s.value;
              return (
                <button key={s.value} onClick={() => selectShot(s.value)} className="nodrag"
                  style={{
                    padding: "7px 10px", borderRadius: 6, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: "0.68rem", textAlign: "center",
                    transition: "all 0.1s",
                    background: active ? "linear-gradient(180deg,rgba(245,158,11,0.22) 0%,rgba(180,110,6,0.14) 100%)" : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                    border: `1.5px solid ${active ? "rgba(245,158,11,0.5)" : "#3A2218"}`,
                    borderBottomColor: active ? "rgba(100,60,0,0.6)" : "#150C0A",
                    color: active ? "#FCD34D" : "#706060",
                    boxShadow: active ? "0 2px 0 #2A1800,0 0 10px rgba(245,158,11,0.15),inset 0 1px 0 rgba(252,211,77,0.1)" : "0 2px 0 #100806",
                  }}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Angle */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#706060", marginBottom: 6 }}>ANGLE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {ANGLES.map((a) => {
              const active = angle === a.value;
              return (
                <button key={a.value} onClick={() => selectAngle(a.value)} className="nodrag"
                  style={{
                    padding: "7px 6px", borderRadius: 6, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: "0.62rem", textAlign: "center",
                    transition: "all 0.1s",
                    background: active ? "linear-gradient(180deg,rgba(245,158,11,0.22) 0%,rgba(180,110,6,0.14) 100%)" : "linear-gradient(180deg,#231A18 0%,#1C1614 100%)",
                    border: `1.5px solid ${active ? "rgba(245,158,11,0.5)" : "#3A2218"}`,
                    borderBottomColor: active ? "rgba(100,60,0,0.6)" : "#150C0A",
                    color: active ? "#FCD34D" : "#706060",
                    boxShadow: active ? "0 2px 0 #2A1800,inset 0 1px 0 rgba(252,211,77,0.1)" : "0 2px 0 #100806",
                  }}>
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        {(shot || angle) && (
          <div style={{ padding: "7px 10px", borderRadius: 6, background: "#180E0C", border: "1px solid rgba(245,158,11,0.2)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#C89000" }}>
            {buildModifier(shot, angle)}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} id="camera-out"
        style={{ background: "#F59E0B", top: "50%", width: 16, height: 16 }} />
    </div>
  );
}
