"use client";

import { create } from "zustand";
import {
  type Node,
  type Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react";

export type GenerationStatus = "idle" | "generating" | "done" | "error";

export interface GenerationResult {
  imageBase64: string;
  size: string;
  prompt: string;
  timestamp: number;
}

interface AtomicStore {
  nodes: Node[];
  edges: Edge[];
  isRunning: boolean;
  generationStatus: GenerationStatus;
  gallery: GenerationResult[];

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;

  addNode: (type: string, defaultData: Record<string, unknown>, position?: { x: number; y: number }) => void;
  runWorkflow: () => Promise<void>;
  saveWorkflow: () => void;
  loadWorkflow: () => void;
  clearCanvas: () => void;
  addToGallery: (result: GenerationResult) => void;
}

const DRAG_HANDLE = ".node-drag-handle";

const defaultNodes: Node[] = [
  {
    id: "prompt-1",
    type: "promptNode",
    dragHandle: DRAG_HANDLE,
    position: { x: 80, y: 200 },
    data: { prompt: "A futuristic city in the mountains at sunrise, cinematic lighting, ultra detailed" },
  },
  {
    id: "size-1",
    type: "sizeNode",
    dragHandle: DRAG_HANDLE,
    position: { x: 80, y: 420 },
    data: { size: "1024x1024" },
  },
  {
    id: "generate-1",
    type: "generateNode",
    dragHandle: DRAG_HANDLE,
    position: { x: 420, y: 280 },
    data: { status: "idle" },
  },
  {
    id: "output-1",
    type: "outputNode",
    dragHandle: DRAG_HANDLE,
    position: { x: 760, y: 200 },
    data: { imageBase64: null, status: "idle" },
  },
];

const EDGE_DEFAULTS = {
  type: "smoothstep" as const,
  animated: true,
  style: { stroke: "#6e56cf", strokeWidth: 2 },
};

const defaultEdges: Edge[] = [
  { id: "e-prompt-gen", source: "prompt-1", target: "generate-1", sourceHandle: "prompt-out", targetHandle: "prompt-in", ...EDGE_DEFAULTS },
  { id: "e-size-gen",   source: "size-1",   target: "generate-1", sourceHandle: "size-out",   targetHandle: "size-in",   ...EDGE_DEFAULTS },
  { id: "e-gen-out",   source: "generate-1", target: "output-1",  sourceHandle: "image-out",  targetHandle: "image-in",  ...EDGE_DEFAULTS },
];

export const useAtomicStore = create<AtomicStore>((set, get) => ({
  nodes: defaultNodes,
  edges: defaultEdges,
  isRunning: false,
  generationStatus: "idle",
  gallery: [],

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set((s) => ({
      edges: addEdge({
        ...connection,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6e56cf", strokeWidth: 2 },
      }, s.edges),
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (type, defaultData, position) => {
    const { nodes } = get();
    const id = `${type}-${Date.now()}`;
    let x = position?.x ?? 200;
    let y = position?.y ?? 200;
    if (!position && nodes.length > 0) {
      const maxX = Math.max(...nodes.map((n) => n.position?.x ?? 0));
      const avgY = nodes.reduce((sum, n) => sum + (n.position?.y ?? 0), 0) / nodes.length;
      x = maxX + 320;
      y = avgY;
    }
    const newNode: Node = {
      id,
      type,
      dragHandle: DRAG_HANDLE,
      position: { x, y },
      data: { ...defaultData },
    };
    set((s) => ({ nodes: [...s.nodes, newNode] }));
  },

  updateNodeData: (nodeId, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  runWorkflow: async () => {
    const { nodes, edges, updateNodeData } = get();
    set({ isRunning: true, generationStatus: "generating" });

    // Find ALL generate nodes — run each pipeline independently
    const genNodes = nodes.filter((n) => n.type === "generateNode");
    if (genNodes.length === 0) {
      set({ isRunning: false, generationStatus: "error" });
      return;
    }

    let anyError = false;

    for (const genNode of genNodes) {
      let prompt = "";
      let negativePrompt = "";
      let size = "1024x1024";
      let styleModifier = "";

      // Collect inputs from every node connected to this GenerateNode
      for (const edge of edges) {
        if (edge.target !== genNode.id) continue;
        const src = nodes.find((n) => n.id === edge.source);
        if (!src) continue;

        if (src.type === "promptNode") {
          prompt = (src.data.prompt as string) || "";
        } else if (src.type === "negativeNode") {
          negativePrompt = (src.data.prompt as string) || "";
        } else if (src.type === "sizeNode") {
          size = (src.data.size as string) || "1024x1024";
        } else if (src.type === "styleNode") {
          styleModifier = (src.data.styleModifier as string) || "";
        } else if (src.type === "combinerNode") {
          prompt = (src.data.combined as string) || prompt;
        } else if (src.type === "refineNode") {
          const refined = (src.data.refinedPrompt as string) || "";
          const improvement = (src.data.improvement as string) || "";
          if (refined) prompt = refined;
          else if (improvement) prompt = prompt ? `${prompt}, ${improvement}` : improvement;
        }
      }

      if (styleModifier && prompt) prompt = `${prompt}, ${styleModifier}`;

      // Skip this GenerateNode if there's no prompt at all
      if (!prompt.trim()) continue;

      updateNodeData(genNode.id, { status: "generating" });

      // Find the OutputNode connected to this GenerateNode (match by target node type)
      const outputEdge = edges.find(
        (e) => e.source === genNode.id && nodes.find((n) => n.id === e.target)?.type === "outputNode"
      );
      const outputNode = outputEdge ? nodes.find((n) => n.id === outputEdge.target) : null;

      if (outputNode) {
        updateNodeData(outputNode.id, { status: "generating" });
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, negative_prompt: negativePrompt, size }),
        });

        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Generation failed");

        const displayPrompt = data.translatedPrompt ?? prompt;
        const originalPrompt = data.originalPrompt ?? null;

        updateNodeData(genNode.id, { status: "done" });

        if (outputNode) {
          updateNodeData(outputNode.id, {
            imageBase64: data.imageBase64,
            size: data.size,
            prompt: displayPrompt,
            originalPrompt,
            status: "done",
          });
        }

        get().addToGallery({
          imageBase64: data.imageBase64,
          size: data.size,
          prompt: displayPrompt,
          timestamp: Date.now(),
        });
      } catch {
        updateNodeData(genNode.id, { status: "error" });
        if (outputNode) updateNodeData(outputNode.id, { status: "idle" });
        anyError = true;
      }
    }

    set({ isRunning: false, generationStatus: anyError ? "error" : "done" });
  },

  saveWorkflow: () => {
    const { nodes, edges } = get();
    const workflow = { nodes, edges, version: 1, savedAt: Date.now() };
    localStorage.setItem("ac-workflow", JSON.stringify(workflow));
  },

  loadWorkflow: () => {
    const raw = localStorage.getItem("ac-workflow");
    if (!raw) return;
    try {
      const { nodes, edges } = JSON.parse(raw);
      set({ nodes, edges });
    } catch {
      // ignore corrupt data
    }
  },

  clearCanvas: () => set({ nodes: defaultNodes, edges: defaultEdges, generationStatus: "idle" }),

  addToGallery: (result) =>
    set((s) => {
      const gallery = [result, ...s.gallery].slice(0, 50);
      try { localStorage.setItem("ac-gallery", JSON.stringify(gallery)); } catch {}
      return { gallery };
    }),
}));
