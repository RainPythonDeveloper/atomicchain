import React from "react";
import { AbsoluteFill, Series } from "remotion";
import "./fonts";
import {
  SceneColdOpen,
  SceneHook,
  SceneCanvas,
  SceneNodes,
  SceneBuildChain,
  SceneRun,
  SceneResults,
  SceneOutro,
} from "./scenes";

export const PROMO_FPS = 30;

// Scene durations in frames @ 30fps — mirrors demo-reel/CHAIN-DEMO-SCRIPT.md.
// Cuts land on musical bars (1 bar = 60f @ 120 BPM).
export const SCENES = {
  coldOpen: 120, // 0:00–0:04  ignition
  hook: 185, //     0:04–0:10  one prompt is never enough → what if you could chain them?
  canvas: 150, //   0:08–0:13  infinite node canvas
  nodes: 120, //    0:13–0:17  20 node types
  build: 300, //    0:17–0:27  ★ build the chain
  run: 150, //      0:27–0:32  RUN — the release
  results: 150, //  0:32–0:37  results evolve
  outro: 150, //    0:37–0:42  gallery + CTA
};
export const PROMO_DURATION = Object.values(SCENES).reduce((a, b) => a + b, 0); // 1260f = 42s

export const Promo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#161214" }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.coldOpen}>
          <SceneColdOpen />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.hook}>
          <SceneHook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.canvas}>
          <SceneCanvas />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.nodes}>
          <SceneNodes />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.build}>
          <SceneBuildChain />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.run}>
          <SceneRun />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.results}>
          <SceneResults />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENES.outro}>
          <SceneOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
