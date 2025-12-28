## Sacred Motion Agent

A browser-native agent that forges three short Hindu deity-inspired video meditations every day. Each clip is rendered locally with Canvas and MediaRecorder, combining mythic palettes, mantras, and animated motifs for a lightweight spiritual studio that runs entirely in the browser.

### Tech

- Next.js App Router + TypeScript  
- Tailwind CSS for layout and theming  
- Canvas 2D + MediaRecorder for video generation (WebM)

### Daily cycle

1. Deterministic daily seed selects three deities and palettes.  
2. Each selection animates lotus/mandala/chakra style patterns with mantra overlays.  
3. Clips are rendered as ~7s WebM videos on the client and exposed with download-friendly players.

### Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to interact with the agent. Use a modern Chromium-based browser (Chrome, Edge, Brave) so MediaRecorder and canvas capture are available.

### Production build

```bash
npm run build
npm start
```

### Deployment

This repo is optimized for Vercel. Environment already works with the one-click command shown in the deployment instructions (`vercel deploy --prod ...`).
