# Quick Start - Vercel Deployment

Fast reference for deploying to Vercel in 10 minutes.

## TL;DR - 5 Steps

### 1. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/figurinhas-album-2026.git
git branch -M main
git push -u origin main
```

### 2. Sign In to Vercel
Go to [vercel.com](https://vercel.com) → Sign in with GitHub

### 3. Import Project
Dashboard → **Add New** → **Project** → Find `figurinhas-album-2026` → **Import**

### 4. Add Environment Variables
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase Dashboard → Settings → API

### 5. Deploy
Click **Deploy** button and wait ~3-5 minutes

## Your Live Site
After deployment: `https://figurinhas-album-2026.vercel.app`

## Full Guide
See **DEPLOYMENT_VERCEL.md** for complete instructions, troubleshooting, and best practices.

## Common Errors

| Error | Fix |
|-------|-----|
| 404 on live site | Set environment variables in Vercel |
| Supabase not connecting | Verify API credentials match exactly |
| Blank page | Check browser console (F12) for JS errors |

## Got 5 more minutes?
1. Test on mobile device
2. Verify all interactive features work
3. Check that sticker data loads from Supabase
4. Test in different browsers

## Support
Full troubleshooting guide in DEPLOYMENT_VERCEL.md
