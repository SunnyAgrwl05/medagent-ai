<div align="center">

<img src="https://api.iconify.design/twemoji:stethoscope.svg" width="72" alt="MedAgent AI logo"/>

# MedAgent AI

### Your Autonomous Multi-Agent Healthcare Assistant

Five AI helpers. One simple app to answer your health questions.

<p>
  <a href="#"><img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" /></a>
</p>

<p>
  <a href="https://medagent-ai-nine.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-medagent--ai--nine.vercel.app-22c55e?style=for-the-badge&logo=vercel&logoColor=white" /></a>
</p>

<p>
  <a href="#-preview">Preview</a> •
  <a href="#-what-can-you-actually-say-to-it">Example Conversations</a> •
  <a href="#-what-can-it-do">What it does</a> •
  <a href="#-how-it-stays-reliable">How it stays reliable</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-deploying-to-vercel">Deploy</a> •
  <a href="#-license">License</a>
</p>

</div>

<br/>

> ⚠️ **Please note:** MedAgent AI gives general health information using AI. It is **not** a real doctor and cannot diagnose you. For anything serious, please talk to a real doctor, pharmacist, or emergency service.

<br/>

## 🖼️ Preview

<div align="center">
<img src="docs/screenshot-landing.png" alt="MedAgent AI landing page — Symptom Agent live chat demo" width="100%"/>
<br/>
<sub>What the app looks like — chat with the Symptom Agent in real time</sub>
</div>

<br/>

## 🌟 What is MedAgent AI?

Think of it as a smart, always-available health assistant. You can talk to it about symptoms, upload a lab report, snap a photo of a medicine, or just have a voice conversation — and it responds like a caring, careful person would.

Behind the scenes it uses **Gemini 2.5 Flash** to think and respond, with a backup plan (**OpenRouter**) in case Gemini is ever busy, plus a real speaking voice (**ElevenLabs**) that falls back to your browser's own voice if needed. You never notice any of this switching — it just works.

<br/>

## 💬 What can you actually say to it?

No special commands needed — just talk to it like you would to a person. Here are some real examples for each agent:

**🗣️ Symptom Checker**
> "I've had a dull headache and mild fever since this morning."
> "My stomach's been hurting for two days, worse after eating."
> "I feel dizzy whenever I stand up too fast."

It'll ask a couple of simple follow-ups (how long, how bad, anything else going on), then tell you what it might be and how urgent it is.

**📄 Lab Report Explainer**
> Just upload the PDF or photo and ask: "Can you explain this blood test?"
> "What does a high TSH level mean?"
> "Is anything here something I should worry about?"

**💊 Medicine Identifier**
> Snap a photo and ask: "What is this medicine for?"
> "Can I take this with paracetamol?"
> "What are the side effects of Azithromycin?"

**🎙️ Voice Chat**
> Just press the mic and talk naturally: "Hey, I've been coughing a lot the past few days, should I be concerned?"
> It replies out loud, like a real conversation — you can keep talking back and forth.

**📊 Health Summary**
> "Summarize my health over the last month."
> "What have I been asking about the most?"
> "Am I improving or should I see a doctor?"

If a symptom ever sounds serious or urgent, the app will say so clearly and tell you to seek real medical help right away — it's built to be cautious, not to guess.

<br/>

## ✨ What can it do?

<table>
<tr>
<td width="50%" valign="top">

### 🗣️ Symptom Checker
Tell it how you're feeling. It asks a few simple follow-up questions, then tells you what it might be, how urgent it is (Low, Moderate, High, or Emergency), and what to do next.

</td>
<td width="50%" valign="top">

### 📄 Lab Report Explainer
Upload a photo or PDF of your blood test or lab report. It reads every number and explains, in plain words, what's normal and what's not.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💊 Medicine Identifier
Snap a photo of a medicine strip, or just type its name. It tells you what it's for, how it's usually taken, and what to watch out for — never telling you to self-medicate.

</td>
<td width="50%" valign="top">

### 🎙️ Voice Chat
Just talk out loud, hands-free. The assistant listens, thinks, and replies back in a real speaking voice — like a phone call with a calm nurse.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📊 Health Summary
It looks back at everything you've talked about and gives you one simple summary — what's improving, what needs attention, and what to bring up with your doctor.

</td>
<td width="50%" valign="top">

### 🎨 A Nice Place to Be
Smooth animations, a clean modern look, dark mode, and it works well on both phone and computer.

</td>
</tr>
</table>

<br/>

## 🧠 How it stays reliable

You'll never see this happening, but here's what's going on behind the scenes so the app almost never breaks:

- It has **5 different Gemini keys**. If one is busy or hits a limit, it quietly tries the next one.
- If all 5 Gemini keys are busy at the same time (very rare), it automatically switches to a **backup AI service (OpenRouter)** so you still get an answer.
- For voice replies, it has **4 different voice keys**. If all of them fail, it simply uses your browser's own built-in voice instead of showing an error.
- Every time it switches keys or services, it logs what happened — but only for the developer, never something you'd see.

In simple terms: **it's built to keep working, even when one piece behind the scenes has a bad day.**

<br/>

## 🧱 Built with

| Part of the app | What it uses |
|---|---|
| Website framework | Next.js 15 + TypeScript |
| Look & feel | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Login/accounts | Clerk |
| Database | Supabase |
| Main AI brain | Google Gemini 2.5 Flash (5 keys, auto-switching) |
| Backup AI brain | OpenRouter (only used if Gemini is fully busy) |
| Speaking voice | ElevenLabs (4 keys) → falls back to your browser's voice |
| Listening | Your browser's built-in speech recognition |
| Charts | Recharts |
| File uploads | react-dropzone, pdf-parse |
| Hosting | Vercel |

<br/>

## 📁 How the project is organized

<details>
<summary><b>Click to see the folder structure</b></summary>

```
medagent-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Handles chat messages for all agents
│   │   ├── tts/route.ts               # Turns text replies into spoken voice
│   │   ├── report-analyze/route.ts    # Reads and explains lab reports
│   │   ├── medicine-scan/route.ts     # Identifies medicines
│   │   └── summary/route.ts           # Builds the health summary
│   ├── dashboard/
│   │   ├── chat/                      # The main chat screen
│   │   ├── reports/                   # Upload & view lab reports
│   │   ├── medicine/                  # Medicine scanner screen
│   │   ├── voice/                     # Voice conversation screen
│   │   ├── summary/                   # Health summary screen
│   │   ├── profile/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── sign-in/[[...sign-in]]/
│   ├── sign-up/[[...sign-up]]/
│   ├── layout.tsx
│   ├── page.tsx                       # The homepage
│   └── globals.css
├── components/                        # All the reusable UI pieces
├── hooks/                             # Reusable logic (chat, voice, uploads)
├── lib/
│   ├── gemini.ts                      # The AI's instructions + key-switching logic
│   ├── openrouter.ts                  # Backup AI service
│   ├── elevenlabs.ts                  # Voice generation + key-switching logic
│   ├── ai-router.ts                   # Decides: try Gemini first, then backup
│   ├── supabase.ts
│   ├── utils.ts
│   └── agents.ts
├── utils/
│   ├── retry.ts                       # The "try again with a different key" logic
│   └── errors.ts                      # Helpers for understanding errors
├── types/                             # Shared data shapes used across the app
├── middleware.ts                      # Keeps pages private unless logged in
├── vercel.json
└── .env.example
```

</details>

<br/>

## 🚀 Getting started

Want to run this on your own computer? Here's how, step by step.

### 1 · What you'll need first

- Node.js version 18.18 or newer (20 is best)
- A free [Clerk](https://clerk.com/) account (for login)
- A free [Supabase](https://supabase.com/) account (for storing data)
- At least one [Google AI Studio](https://aistudio.google.com/) Gemini API key (free to get)
- *(Nice to have)* An [OpenRouter](https://openrouter.ai/) key, as a backup
- *(Optional)* An [ElevenLabs](https://elevenlabs.io/) key for a nicer voice — without it, your browser's own voice is used instead

### 2 · Download the project

```bash
git clone https://github.com/SunnyAgrwl05/medagent-ai.git
cd medagent-ai
npm install
```

### 3 · Add your keys

```bash
cp .env.example .env.local
```

Then open `.env.local` and paste in your own keys.

<details>
<summary><b>Click to see what goes in <code>.env.local</code></b></summary>

```env
# ── Clerk (login) ─────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ── Supabase (database) ───────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# ── Gemini keys (add as many as you have — up to 5) ──
GEMINI_API_KEY_1=xxxxx
GEMINI_API_KEY_2=xxxxx
GEMINI_API_KEY_3=xxxxx
GEMINI_API_KEY_4=xxxxx
GEMINI_API_KEY_5=xxxxx

# ── OpenRouter (backup AI, used only if all Gemini keys fail) ──
OPENROUTER_API_KEY=xxxxx
OPENROUTER_MODEL=openai/gpt-4o-mini

# ── ElevenLabs (voice, optional) ──
ELEVENLABS_API_KEY_1=xxxxx
ELEVENLABS_API_KEY_2=xxxxx
ELEVENLABS_API_KEY_3=xxxxx
ELEVENLABS_API_KEY_4=xxxxx
ELEVENLABS_VOICE_ID=xxxxx

# ── App ───────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

</details>

> 💡 **You only need one Gemini key to get started.** Adding more just means the app can handle more people at once without slowing down.

### 4 · Set up the database

Open your Supabase project's SQL editor and run the setup script found at the bottom of `lib/supabase.ts`. This creates the tables the app needs to remember your conversations and history.

### 5 · Start the app

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser 🎉

### 6 · Build it for real use

```bash
npm run build
npm run start
```

<br/>

## ☁️ Putting it online with Vercel

1. Push this project to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import it.
3. Vercel figures out it's a Next.js app automatically — nothing extra to configure.
4. Copy every line from `.env.example` into Vercel's **Project Settings → Environment Variables**.
5. Click deploy. From now on, every time you push to `main`, it updates automatically.

Prefer the command line? You can also do:

```bash
npm install -g vercel
vercel
vercel --prod
```

<br/>

## 🔐 A note on keeping things safe

- You have to be logged in to use the dashboard or the API — nobody else can access your data.
- The app's database keys are only ever used on the server, never sent to your browser.
- Same goes for all the AI keys (Gemini, OpenRouter, ElevenLabs) — they stay on the server, safely out of sight.
- Never share or upload your `.env.local` file — it's already set up to be ignored by Git.
- If any key ever gets accidentally shown somewhere (like in a screenshot), just go generate a new one — it takes a minute and keeps you safe.

<br/>

## 🩺 How the AI is guided

Each of the five agents follows its own careful set of instructions — asking the right questions, using cautious language, never claiming certainty, and always suggesting a real doctor for anything serious. Even the backup AI (OpenRouter) follows the exact same instructions, so the tone and safety never change no matter which one answers.

<br/>

## 📦 Quick command list

```bash
npm install       # set everything up
npm run dev       # run it while you're developing
npm run build     # prepare it for real use
npm run start     # run the finished version
npm run lint      # check the code for issues
vercel            # put up a test version online
vercel --prod     # put up the real, live version
```

<br/>

## 📝 License

This project is open source under the MIT license — see [LICENSE](./LICENSE) for details.

<br/>

<div align="center">

Made with care for people who just want a straight answer about their health.

</div>
