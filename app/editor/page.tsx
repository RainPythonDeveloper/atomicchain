"use client";

import { Toolbar } from "@/components/editor/Toolbar";
import { NodeSidebar } from "@/components/editor/NodeSidebar";
import { NodeCanvas } from "@/components/editor/NodeCanvas";

export default function EditorPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#1F1B1E" }}>
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <NodeSidebar />
        <NodeCanvas />
      </div>
    </div>
  );
}
