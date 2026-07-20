# lmagjb — portfolio

A React + Vite portfolio site, styled as a build log / terminal. Sections:
hero, about, stack, projects (git-log style), contact.

## Before you deploy

Edit the placeholder contact info in `src/App.jsx` (search for `Contact`):

- `you@example.com`
- `github.com/yourusername`
- `linkedin.com/in/yourusername`

Also update the project list in `src/App.jsx` (`PROJECTS` array) if you want
to add, remove, or reword any entries.

## Run locally

```bash
npm install
npm run dev
```

## Push to your GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(Create the empty repo on GitHub first — github.com/new — then use its URL
above. If prompted for credentials, use a GitHub personal access token as
the password, or push via SSH if you have that set up.)

## Deploy to Vercel

Option A — Vercel dashboard (no CLI needed):
1. Go to vercel.com/new
2. Import the GitHub repo you just pushed
3. Framework preset "Vite" is auto-detected — click Deploy

Option B — Vercel CLI:

```bash
npm i -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # promote to production
```

Either way, Vercel picks up `vercel.json` automatically for build settings.
