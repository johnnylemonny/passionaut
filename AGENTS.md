# AGENTS.md

## Project Context
This is **Passionaut**, an AI-powered 3D knowledge graph visualizer built for a DEV.to hackathon by `johnnylemonny`. 

## Architecture & Constraints
- **Framework:** Next.js 16 (App Router) with `output: "export"`.
- **Hosting:** Designed for GitHub Pages. **DO NOT add API routes.** All logic must be client-side.
- **AI:** Google Gemini API (`@google/genai`). The API key is stored in `localStorage` via Zustand because it's a static app. Model used: `gemini-3.1-flash-lite`.
- **Styling:** Tailwind CSS v4. Use CSS variables defined in `globals.css` for the "Cosmic Explorer" theme (OLED blacks, neon cyan/magenta/amber glows).
- **Animations:** Exclusively use `react-spring`. Do not introduce `framer-motion`.
- **3D Graph:** Uses `react-force-graph-3d` which relies on WebGL. It must be dynamically imported with `ssr: false` to avoid Next.js hydration mismatch errors.
- **Audio FX:** Web Audio API synth tones are triggered on node hover, click, and search phases.
- **State Structure:** Zustand store handles `apiKey` (persisted), `history` (persisted search logs), `currentDomain`, `graphData`, and `selectedNode`.

## Maintenance Notes
- If modifying `gemini.ts`, ensure the JSON schema strictly matches the expected `{ nodes: [], links: [] }` format.
- Ensure 3D text labels inside `AtlasGraph.tsx` do not clip. The canvas sizing is dynamic: `Math.max(256, textWidth + 48)` and sprites are scaled proportionally using the canvas aspect ratio.
- Do not run `npm`. Use `pnpm` exclusively.
