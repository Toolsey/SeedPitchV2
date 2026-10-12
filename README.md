# Toolsey — Seed Vision Deck

Static HTML pitch deck (10 slides, 1920×1080). No build step.

## Files
- `index.html` — the deck
- `v2.css`, `v2.js` — styles and animations
- `deck-stage.js` — slide stage (scaling, keyboard nav, print-to-PDF)
- `tweaks-panel.jsx` — in-deck tweak controls
- `assets/` — logos and imagery
- `vercel.json` — routing and headers

## Deploy (GitHub → Vercel)
1. Unzip, then push the folder contents to a new GitHub repo:
   ```bash
   git init && git add . && git commit -m "Toolsey Seed Vision deck"
   git branch -M main
   git remote add origin https://github.com/<org>/<repo>.git
   git push -u origin main
   ```
2. On vercel.com/new, import the repo. Framework Preset: **Other**. Leave Build Command and Output Directory blank.
3. Deploy. Every push to `main` redeploys.

CLI alternative: `npm i -g vercel && vercel --prod`

## Run locally
`npm run dev` → http://localhost:3000

## Controls
← / → or Space to navigate · Cmd/Ctrl+P to save as PDF

© Toolsey, Inc. — Confidential. For investor review only.
