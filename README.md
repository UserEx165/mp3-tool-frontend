# MP3 Frontend (Next.js) — Free, In‑Browser Conversion

This app converts audio/video to MP3 **in your browser** using `ffmpeg.wasm`, so there is **no server cost**.

## Quick start

```bash
npm i
npm run dev
```

Open http://localhost:3000 and pick a file. Your file never leaves your device.

### Server‑side page (optional)

If you also deploy the optional backend, set:

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

Then visit `/server` to use the server converter.

## Deploy to Vercel (Free)

1. Push this folder to GitHub.
2. In Vercel → **New Project** → import this repo → **Deploy**.
3. (Optional) Add env var `NEXT_PUBLIC_BACKEND_URL` in Vercel project settings if you use the backend.

## AdSense (Monetization)

1. Apply for AdSense and add your site.
2. After approval, add your publisher ID in `pages/_app.js` (uncomment script).
3. Place an ad unit where you want (example comment in `pages/index.js`).
4. Add `/public/ads.txt` with the exact line Google provides (create this file in your project root under `public/ads.txt`).

> Ads will only serve after your site is reviewed and approved.
