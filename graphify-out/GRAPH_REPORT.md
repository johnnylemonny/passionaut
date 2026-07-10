# Graph Report - passionaut  (2026-07-10)

## Corpus Check
- 16 files · ~4,259 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 54 nodes · 68 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4dd3e4a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]

## God Nodes (most connected - your core abstractions)
1. `useStore` - 11 edges
2. `Passionaut 🌌 — Deep-Dive Passion Atlas` - 6 edges
3. `playBeep()` - 4 edges
4. `Installation` - 4 edges
5. `getAudioContext()` - 3 edges
6. `playSuccessSweep()` - 3 edges
7. `📦 Getting Started` - 3 edges
8. `Home()` - 2 edges
9. `APIKeyTerminal()` - 2 edges
10. `AtlasGraph()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `AtlasGraph()` --calls--> `useStore`  [EXTRACTED]
  src/components/AtlasGraph.tsx → src/store/useStore.ts
- `SearchBar()` --calls--> `useStore`  [EXTRACTED]
  src/components/SearchBar.tsx → src/store/useStore.ts
- `Home()` --calls--> `useStore`  [EXTRACTED]
  src/app/page.tsx → src/store/useStore.ts
- `APIKeyTerminal()` --calls--> `useStore`  [EXTRACTED]
  src/components/APIKeyTerminal.tsx → src/store/useStore.ts
- `Sidebar()` --calls--> `useStore`  [EXTRACTED]
  src/components/Sidebar.tsx → src/store/useStore.ts

## Communities (12 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.43
Nodes (5): AtlasGraph, Home(), APIKeyTerminal(), Sidebar(), useStore

### Community 1 - "Community 1"
Cohesion: 0.36
Nodes (5): SearchBar(), generateGraph(), AppState, GraphData, PassionLink

### Community 2 - "Community 2"
Cohesion: 0.43
Nodes (5): AtlasGraph(), getAudioContext(), playBeep(), playSuccessSweep(), PassionNode

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (6): 🏆 DEV.to Weekend Challenge, 🚀 Features, 📄 License, Passionaut 🌌 — Deep-Dive Passion Atlas, 🛠️ Tech Stack, Why Passionaut?

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (6): code:bash (git clone https://github.com/johnnylemonny/passionaut.git), code:bash (pnpm install), code:bash (pnpm dev), 📦 Getting Started, Installation, Prerequisites

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (3): inter, metadata, spaceGrotesk

### Community 6 - "Community 6"
Cohesion: 0.4
Nodes (3): Architecture & Constraints, Maintenance Notes, Project Context

## Knowledge Gaps
- **20 isolated node(s):** `eslintConfig`, `nextConfig`, `config`, `inter`, `spaceGrotesk` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useStore` connect `Community 0` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `Passionaut 🌌 — Deep-Dive Passion Atlas` connect `Community 3` to `Community 4`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `📦 Getting Started` connect `Community 4` to `Community 3`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `config` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._