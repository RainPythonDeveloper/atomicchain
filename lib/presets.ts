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

// ────────────────────────────────────────────────────────────────────────────
// CHAIN_PRESET — a full multi-stage pipeline.
//
// Three Generate → Output stages wired into a single "chain of changes":
//
//   STAGE 1 (base scene)
//     Prompt + Style + Camera + Lighting + Size + Negative ─▶ Generate-1 ─▶ Output-1
//
//   STAGE 2 (evolve the result)
//     Output-1 ─▶ Refine-1 ─┐
//     Prompt + Prompt ─▶ Combiner ─┤
//     Mood + Artist + Color + Material ─▶ Generate-2 ─▶ Output-2
//
//   STAGE 3 (final variations + motion)
//     Output-2 ─▶ Refine-2 ─┐
//     Surprise Me (Dice) ───┤
//     Time + FX + Aspect + Style + Batch ─▶ Generate-3 ─▶ Output-3 ─▶ Video
//
// Every one of the 20 node types is used (several more than once). Pressing RUN
// executes Generate-1 → Generate-2 → Generate-3 in order, each building on the
// previous stage's image via the Refine node sitting on the seam between them.
// ────────────────────────────────────────────────────────────────────────────
export const CHAIN_PRESET: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    // ── STAGE 1 inputs ──────────────────────────────────────────────────────
    {
      id: "ch-prompt-1",
      type: "promptNode",
      dragHandle: DRAG,
      position: { x: 0, y: 0 },
      data: { prompt: "A lone wanderer in a long coat stands at the edge of a vast alien canyon, twin moons rising over distant megastructures, epic establishing shot" },
    },
    {
      id: "ch-style-1",
      type: "styleNode",
      dragHandle: DRAG,
      position: { x: 0, y: 460 },
      data: { styleModifier: "photorealistic, 8k, detailed" },
    },
    {
      id: "ch-camera-1",
      type: "cameraNode",
      dragHandle: DRAG,
      position: { x: 0, y: 780 },
      data: { shot: "extreme wide shot", angle: "low angle, looking up", modifier: "extreme wide shot, low angle, looking up" },
    },
    {
      id: "ch-light-1",
      type: "lightingNode",
      dragHandle: DRAG,
      position: { x: 0, y: 1240 },
      data: { lighting: "golden hour sunlight, warm directional light", category: "Natural", modifier: "golden hour sunlight, warm directional light" },
    },
    {
      id: "ch-size-1",
      type: "sizeNode",
      dragHandle: DRAG,
      position: { x: 0, y: 1640 },
      data: { size: "1024x1024" },
    },
    {
      id: "ch-neg-1",
      type: "negativeNode",
      dragHandle: DRAG,
      position: { x: 0, y: 1940 },
      data: { prompt: "blurry, low quality, distorted, watermark, text, extra limbs" },
    },
    {
      id: "ch-generate-1",
      type: "generateNode",
      dragHandle: DRAG,
      position: { x: 560, y: 860 },
      data: { status: "idle" },
    },
    {
      id: "ch-output-1",
      type: "outputNode",
      dragHandle: DRAG,
      position: { x: 1120, y: 820 },
      data: { imageBase64: null, status: "idle" },
    },

    // ── STAGE 2 inputs ──────────────────────────────────────────────────────
    {
      id: "ch-refine-1",
      type: "refineNode",
      dragHandle: DRAG,
      position: { x: 1680, y: 0 },
      data: { improvement: "more atmospheric depth, volumetric haze, richer detail, dramatic contrast", refinedPrompt: "", isLoading: false },
    },
    {
      id: "ch-prompt-2a",
      type: "promptNode",
      dragHandle: DRAG,
      position: { x: 1680, y: 560 },
      data: { prompt: "a towering figure of light emerging from the canyon mist" },
    },
    {
      id: "ch-prompt-2b",
      type: "promptNode",
      dragHandle: DRAG,
      position: { x: 1680, y: 960 },
      data: { prompt: "ancient symbols glowing across floating monoliths" },
    },
    {
      id: "ch-combiner-1",
      type: "combinerNode",
      dragHandle: DRAG,
      position: { x: 2240, y: 820 },
      data: { combined: "" },
    },
    {
      id: "ch-mood-1",
      type: "moodNode",
      dragHandle: DRAG,
      position: { x: 2240, y: 1140 },
      data: { time: "blue hour, magical twilight", weather: "thick fog, misty atmosphere", vibe: "epic scale, dramatic, awe-inspiring", modifier: "blue hour, magical twilight, thick fog, misty atmosphere, epic scale, dramatic, awe-inspiring" },
    },
    {
      id: "ch-artist-1",
      type: "artistStyleNode",
      dragHandle: DRAG,
      position: { x: 2240, y: 1640 },
      data: { artist: "Syd Mead style, retrofuturist industrial design, chrome and neon", era: "Sci-fi", modifier: "Syd Mead style, retrofuturist industrial design, chrome and neon" },
    },
    {
      id: "ch-color-1",
      type: "colorPaletteNode",
      dragHandle: DRAG,
      position: { x: 2240, y: 0 },
      data: { colors: ["#F04D07", "#1F1B1E", "#2B7FE0"], modifier: "dominant color palette of deep orange, near-black, and electric blue" },
    },
    {
      id: "ch-material-1",
      type: "materialNode",
      dragHandle: DRAG,
      position: { x: 2240, y: 360 },
      data: { material: "carved from glowing crystal, faceted gemstone surfaces", modifier: "carved from glowing crystal, faceted gemstone surfaces" },
    },
    {
      id: "ch-generate-2",
      type: "generateNode",
      dragHandle: DRAG,
      position: { x: 2800, y: 860 },
      data: { status: "idle" },
    },
    {
      id: "ch-output-2",
      type: "outputNode",
      dragHandle: DRAG,
      position: { x: 3360, y: 820 },
      data: { imageBase64: null, status: "idle" },
    },

    // ── STAGE 3 inputs ──────────────────────────────────────────────────────
    {
      id: "ch-refine-2",
      type: "refineNode",
      dragHandle: DRAG,
      position: { x: 3920, y: 0 },
      data: { improvement: "ultra sharp focus, intricate textures, heightened color grading, epic scale", refinedPrompt: "", isLoading: false },
    },
    {
      id: "ch-dice-1",
      type: "diceNode",
      dragHandle: DRAG,
      position: { x: 3920, y: 560 },
      data: { prompt: "a colossal ancient robot reclaimed by glowing jungle vines, shafts of golden light" },
    },
    {
      id: "ch-time-1",
      type: "timeMachineNode",
      dragHandle: DRAG,
      position: { x: 3920, y: 900 },
      data: { era: "futuristic cyberpunk city, holograms, flying vehicles, neon rain", modifier: "futuristic cyberpunk city, holograms, flying vehicles, neon rain" },
    },
    {
      id: "ch-fx-1",
      type: "fxNode",
      dragHandle: DRAG,
      position: { x: 4480, y: 720 },
      data: { effects: ["long exposure photography, motion light trails"], modifier: "long exposure photography, motion light trails" },
    },
    {
      id: "ch-aspect-1",
      type: "aspectRatioNode",
      dragHandle: DRAG,
      position: { x: 4480, y: 1100 },
      data: { ratio: "land169", size: "1024x576", prompt: "widescreen landscape, 16:9" },
    },
    {
      id: "ch-style-2",
      type: "styleNode",
      dragHandle: DRAG,
      position: { x: 4480, y: 320 },
      data: { styleModifier: "cyberpunk, neon lights, dystopian, futuristic" },
    },
    {
      id: "ch-batch-1",
      type: "batchNode",
      dragHandle: DRAG,
      position: { x: 4480, y: 0 },
      data: { count: 2 },
    },
    {
      id: "ch-generate-3",
      type: "generateNode",
      dragHandle: DRAG,
      position: { x: 5040, y: 860 },
      data: { status: "idle" },
    },
    {
      id: "ch-output-3",
      type: "outputNode",
      dragHandle: DRAG,
      position: { x: 5600, y: 820 },
      data: { imageBase64: null, status: "idle" },
    },
    {
      id: "ch-video-1",
      type: "videoNode",
      dragHandle: DRAG,
      position: { x: 6160, y: 820 },
      data: { motionPrompt: "slow cinematic push-in, drifting particles, subtle camera parallax", resolution: "720_16_9", frames: 57, status: "idle", videoBase64: null },
    },
  ],
  edges: [
    // STAGE 1 → Generate-1 → Output-1
    { id: "ch-e1",  source: "ch-prompt-1", target: "ch-generate-1", sourceHandle: "prompt-out",   targetHandle: "prompt-in",   ...E },
    { id: "ch-e2",  source: "ch-style-1",  target: "ch-generate-1", sourceHandle: "style-out",    targetHandle: "style-in",    ...E },
    { id: "ch-e3",  source: "ch-camera-1", target: "ch-generate-1", sourceHandle: "camera-out",   targetHandle: "camera-in",   ...E },
    { id: "ch-e4",  source: "ch-light-1",  target: "ch-generate-1", sourceHandle: "lighting-out", targetHandle: "lighting-in", ...E },
    { id: "ch-e5",  source: "ch-size-1",   target: "ch-generate-1", sourceHandle: "size-out",     targetHandle: "modifier-in", ...E },
    { id: "ch-e6",  source: "ch-neg-1",    target: "ch-generate-1", sourceHandle: "negative-out", targetHandle: "modifier-in", ...E },
    { id: "ch-e7",  source: "ch-generate-1", target: "ch-output-1", sourceHandle: "image-out",    targetHandle: "image-in",    ...E },

    // SEAM 1 → Output-1 feeds Refine-1 (chain of changes)
    { id: "ch-e8",  source: "ch-output-1", target: "ch-refine-1",   sourceHandle: "image-out",    targetHandle: "image-in",    ...E },

    // STAGE 2 → Generate-2 → Output-2
    { id: "ch-e9",  source: "ch-prompt-2a",  target: "ch-combiner-1", sourceHandle: "prompt-out",   targetHandle: "a-in",        ...E },
    { id: "ch-e10", source: "ch-prompt-2b",  target: "ch-combiner-1", sourceHandle: "prompt-out",   targetHandle: "b-in",        ...E },
    { id: "ch-e11", source: "ch-combiner-1", target: "ch-generate-2", sourceHandle: "combined-out", targetHandle: "prompt-in",   ...E },
    { id: "ch-e12", source: "ch-refine-1",   target: "ch-generate-2", sourceHandle: "refined-out",  targetHandle: "prompt-in",   ...E },
    { id: "ch-e13", source: "ch-mood-1",     target: "ch-generate-2", sourceHandle: "mood-out",     targetHandle: "modifier-in", ...E },
    { id: "ch-e14", source: "ch-artist-1",   target: "ch-generate-2", sourceHandle: "artist-out",   targetHandle: "modifier-in", ...E },
    { id: "ch-e15", source: "ch-color-1",    target: "ch-generate-2", sourceHandle: "color-out",    targetHandle: "modifier-in", ...E },
    { id: "ch-e16", source: "ch-material-1", target: "ch-generate-2", sourceHandle: "material-out", targetHandle: "modifier-in", ...E },
    { id: "ch-e17", source: "ch-generate-2", target: "ch-output-2",   sourceHandle: "image-out",    targetHandle: "image-in",    ...E },

    // SEAM 2 → Output-2 feeds Refine-2 (chain of changes)
    { id: "ch-e18", source: "ch-output-2", target: "ch-refine-2",     sourceHandle: "image-out",    targetHandle: "image-in",    ...E },

    // STAGE 3 → Generate-3 → Output-3
    { id: "ch-e19", source: "ch-dice-1",   target: "ch-generate-3", sourceHandle: "prompt-out",   targetHandle: "prompt-in",   ...E },
    { id: "ch-e20", source: "ch-refine-2", target: "ch-generate-3", sourceHandle: "refined-out",  targetHandle: "prompt-in",   ...E },
    { id: "ch-e21", source: "ch-time-1",   target: "ch-generate-3", sourceHandle: "era-out",      targetHandle: "modifier-in", ...E },
    { id: "ch-e22", source: "ch-fx-1",     target: "ch-generate-3", sourceHandle: "fx-out",       targetHandle: "fx-in",       ...E },
    { id: "ch-e23", source: "ch-aspect-1", target: "ch-generate-3", sourceHandle: "aspect-out",   targetHandle: "modifier-in", ...E },
    { id: "ch-e24", source: "ch-style-2",  target: "ch-generate-3", sourceHandle: "style-out",    targetHandle: "style-in",    ...E },
    { id: "ch-e25", source: "ch-batch-1",  target: "ch-generate-3", sourceHandle: "batch-out",    targetHandle: "modifier-in", ...E },
    { id: "ch-e26", source: "ch-generate-3", target: "ch-output-3", sourceHandle: "image-out",    targetHandle: "image-in",    ...E },

    // SEAM 3 → Output-3 feeds the Video animator (final link)
    { id: "ch-e27", source: "ch-output-3", target: "ch-video-1",    sourceHandle: "image-out",    targetHandle: "image-in",    ...E },
  ],
};
