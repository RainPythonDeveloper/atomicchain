import type { Node, Edge } from "@xyflow/react";

const DRAG = ".node-drag-handle";
const E = { type: "ac-edge", animated: true };

export const DEMO_PRESET: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    // Single left column — top→bottom order matches handle order: style, prompt, camera, lighting, fx
    {
      id: "dp-style",
      type: "styleNode",
      dragHandle: DRAG,
      position: { x: 60, y: 20 },
      data: { styleModifier: "cinematic photography, photorealistic, 8K, anamorphic lens, shallow depth of field" },
    },
    {
      id: "dp-prompt",
      type: "promptNode",
      dragHandle: DRAG,
      position: { x: 60, y: 350 },
      data: { prompt: "A lone astronaut stands on the surface of Mars at sunset, looking toward a distant colony glowing on the horizon" },
    },
    {
      id: "dp-camera",
      type: "cameraNode",
      dragHandle: DRAG,
      position: { x: 60, y: 600 },
      data: { shot: "wide shot", angle: "low angle, looking up", modifier: "wide shot, low angle, looking up" },
    },
    {
      id: "dp-lighting",
      type: "lightingNode",
      dragHandle: DRAG,
      position: { x: 60, y: 1060 },
      data: { lighting: "golden hour", category: "Natural", modifier: "golden hour lighting, warm sunset hues, long dramatic shadows" },
    },
    {
      id: "dp-fx",
      type: "fxNode",
      dragHandle: DRAG,
      position: { x: 60, y: 1420 },
      data: { effects: ["lens flare", "film grain"], modifier: "anamorphic lens flare, Kodak film grain" },
    },
    // Generate — to the right, vertically centered
    {
      id: "dp-generate",
      type: "generateNode",
      dragHandle: DRAG,
      position: { x: 800, y: 820 },
      data: { status: "idle" },
    },
    // Output — far right
    {
      id: "dp-output",
      type: "outputNode",
      dragHandle: DRAG,
      position: { x: 1360, y: 720 },
      data: { imageBase64: null, status: "idle" },
    },
  ],
  edges: [
    { id: "dp-e2", source: "dp-style", target: "dp-generate", sourceHandle: "style-out", targetHandle: "style-in", ...E },
    { id: "dp-e1", source: "dp-prompt", target: "dp-generate", sourceHandle: "prompt-out", targetHandle: "prompt-in", ...E },
    { id: "dp-e3", source: "dp-camera", target: "dp-generate", sourceHandle: "camera-out", targetHandle: "camera-in", ...E },
    { id: "dp-e4", source: "dp-lighting", target: "dp-generate", sourceHandle: "lighting-out", targetHandle: "lighting-in", ...E },
    { id: "dp-e5", source: "dp-fx", target: "dp-generate", sourceHandle: "fx-out", targetHandle: "fx-in", ...E },
    { id: "dp-e6", source: "dp-generate", target: "dp-output", sourceHandle: "image-out", targetHandle: "image-in", ...E },
  ],
};
