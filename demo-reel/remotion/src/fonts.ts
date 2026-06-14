import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

export const mono = loadMono("normal", { weights: ["400", "500", "700", "800"] });
export const sans = loadSans("normal", { weights: ["400", "600", "700", "800", "900"] });
