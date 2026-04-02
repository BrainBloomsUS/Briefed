# Briefed — Zero to Expert, Any Role

AI-powered field guides for any job description. Built for sales reps, solutions engineers, and anyone preparing for a new role.

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1 — Push to GitHub
1. Go to [github.com/new](https://github.com/new)
2. Create a new repo called `briefed` (private or public)
3. Upload all files from this folder

### Step 2 — Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → select `briefed`
3. Framework: **Next.js** (auto-detected)
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy**

Your app will be live at `https://briefed.vercel.app` in ~60 seconds.

### Step 3 — Custom Domain (optional)
Vercel Dashboard → Settings → Domains → Add your domain.

---

## 🛠 Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
briefed/
├── app/
│   ├── page.tsx              ← Main UI (hero, form, guide renderer)
│   ├── layout.tsx            ← Root layout + SEO metadata
│   ├── globals.css           ← Complete design system
│   └── api/
│       └── generate/
│           └── route.ts      ← Claude API call (server-side, streamed)
├── lib/
│   ├── types.ts              ← TypeScript types
│   └── constants.ts          ← System prompt, examples, options
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## 💰 Cost Estimate

| Component | Cost |
|-----------|------|
| Vercel hosting | Free (Hobby plan) |
| Anthropic API per guide | ~$0.08–0.20 (claude-opus-4-5) |
| Custom domain | ~$12/year |

---

## 🔧 Customization

**Change the AI model:** Edit `app/api/generate/route.ts` → change `model: 'claude-opus-4-5'`

**Add more example JDs:** Edit `lib/constants.ts` → `EXAMPLE_JDS` array

**Change branding:** Edit colors in `app/globals.css` → `:root` section

**Add user auth / history:** Integrate Clerk or NextAuth for user accounts

---

## 📤 Sharing on LinkedIn

Once deployed, share the URL directly. The app is:
- Mobile responsive ✅
- Fast (streaming response) ✅  
- No signup required ✅
- Works in any browser ✅
