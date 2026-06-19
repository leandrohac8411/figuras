# Vercel Deployment Guide - Álbum de Figurinhas Copa 2026

This guide provides step-by-step instructions for deploying the "Álbum de Figurinhas Copa 2026" project to Vercel.

## Overview

The Álbum de Figurinhas project is a static site with vanilla JavaScript and Supabase backend integration. It requires environment variables to connect to your Supabase database.

**Deployment Time**: ~5 minutes
**Estimated Monthly Cost**: Free tier (if under limits)

---

## Prerequisites

Before you begin, make sure you have:

1. **GitHub Account** - Required to connect your repository
2. **Vercel Account** - Free account at [vercel.com](https://vercel.com)
3. **Supabase Account** - Database credentials ready
4. **Project Code** - Repository pushed to GitHub

### Getting Supabase Credentials

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (API Key)
   - **service_role** key (keep this secret, for admin only)

---

## Step 1: Push to GitHub

### 1.1 Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a repository named `figurinhas-album-2026`
3. Choose **Public** (recommended for portfolios) or **Private**
4. Click **Create repository**

### 1.2 Add Remote and Push Code

Open your terminal in the project directory and run:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/figurinhas-album-2026.git

# Verify the remote was added
git remote -v

# Push the main branch to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

### 1.3 Verify on GitHub

Visit `https://github.com/YOUR_USERNAME/figurinhas-album-2026` and confirm all files are there.

---

## Step 2: Connect to Vercel

### 2.1 Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign In** or **Sign Up** (use your GitHub account)
3. Authorize Vercel to access your GitHub account

### 2.2 Import Your Repository

1. On the Vercel dashboard, click **Add New...** → **Project**
2. You should see your GitHub account connected
3. Search for `figurinhas-album-2026` in the repository list
4. Click **Import**

### 2.3 Configure Project Settings

The import page will show:

- **Project Name**: `figurinhas-album-2026` (you can customize this)
- **Framework Preset**: Select **Other** (it's a static site)
- **Root Directory**: Leave as `.` (default)
- **Build and Output Settings**:
  - Build Command: Leave empty
  - Output Directory: `.` (the root is the static content)
  - Install Command: Leave empty

---

## Step 3: Add Environment Variables

### 3.1 Set Environment Variables in Vercel

Before clicking Deploy, you **must** add your Supabase credentials:

1. Scroll down to **Environment Variables**
2. Click **Add Environment Variable** (or **Environment Variables**)
3. Add the following variables:

| Key | Value | Source |
|-----|-------|--------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase Settings → API |
| `SUPABASE_ANON_KEY` | `your-anon-key-here` | From Supabase Settings → API |

**Important**: These will be available on the client-side (this is safe as they are public API keys with limited scope).

### 3.2 Example

```
SUPABASE_URL=https://abjdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Deploy

### 4.1 Click Deploy

1. Review all settings
2. Click the **Deploy** button
3. Vercel will:
   - Clone your repository
   - Build the project (minimal for static sites)
   - Deploy to a live URL
   - Show deployment progress

### 4.2 Monitor Deployment

You'll see a progress screen showing:
- ✓ Cloning repository
- ✓ Installing dependencies
- ✓ Building project
- ✓ Creating functions
- ✓ Deploying

Wait for the message: **"Congratulations! Your site is live"**

---

## Step 5: Access Your Live Site

### 5.1 Get Your URL

After deployment completes, you'll see a screen with:
- **Visit**: `https://figurinhas-album-2026.vercel.app`
- **View Production Deployments**
- **Manage Project**

Click the **Visit** button to see your live site.

### 5.2 Custom Domain (Optional)

To add a custom domain:

1. In Vercel dashboard → **Project Settings**
2. Go to **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Step 6: Verification Checklist

After deployment, verify everything works:

### Frontend
- [ ] Home page loads at `https://figurinhas-album-2026.vercel.app`
- [ ] Navigation menu appears
- [ ] Progress bar displays correctly
- [ ] Sticker grid renders
- [ ] Team tabs are clickable

### Supabase Integration
- [ ] Check browser console (F12) for any errors
- [ ] Sticker data loads from Supabase
- [ ] Collection tracking works (clicking stickers updates count)
- [ ] Real-time sync works across browser tabs (open two windows)

### Mobile Responsiveness
- [ ] Open on mobile device or use browser DevTools (F12 → Toggle Device Toolbar)
- [ ] Layout is responsive and mobile-friendly
- [ ] Touch interactions work smoothly

---

## Troubleshooting

### Issue: "Cannot find module" or "404 errors"

**Solution**: Ensure `.env.local` is in your `.gitignore` but environment variables are set in Vercel:
1. Go to Vercel project → **Settings → Environment Variables**
2. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
3. Redeploy: Click **Deployments** → find latest → **Redeploy**

### Issue: Supabase API returns 401 or 403 errors

**Solution**: Check your credentials:
1. Go to your Supabase project
2. Verify the API keys match exactly (no extra spaces)
3. Confirm Row Level Security (RLS) policies allow public read access
4. If credentials changed, update them in Vercel environment variables

### Issue: Site shows blank page

**Solution**:
1. Open browser DevTools (F12)
2. Check the **Console** tab for JavaScript errors
3. Check the **Network** tab to see if files are loading
4. Verify Supabase CDN is accessible (check `<script>` tag in network)

### Issue: Slow initial page load

**Solution**: This is normal for the first load. Supabase SDK is loaded from CDN. Subsequent loads are faster due to browser caching.

---

## Environment Variables Reference

### Required Variables

```
# Supabase Project URL
# Format: https://[PROJECT-REF].supabase.co
SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon Key (public, safe for client)
# Get from: Settings → API → anon public
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional Variables

For future enhancements:

```
# For server-side functions (if you add them)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For analytics or monitoring
NEXT_PUBLIC_VERCEL_ENV=production
```

---

## Updating Your Site After Deployment

### Making Changes

1. **Make changes locally** in your project
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   git push origin main
   ```
3. **Vercel automatically deploys** - watch the deployment in the Vercel dashboard
4. **View live changes** at your Vercel URL

### Rollback to Previous Version

If something breaks:

1. Go to Vercel dashboard → **Deployments**
2. Find the previous stable deployment
3. Click **Promote to Production**
4. Your site will revert to that version

---

## Performance Optimization

### After Successful Deployment

1. **Enable Caching**: Vercel caches static assets automatically
2. **Optimize Images**: Consider optimizing any image files
3. **Monitor Usage**: Check Vercel analytics → **Usage** tab
4. **Set Up Alerts**: In Vercel → **Project Settings → Alerts**

### Monitoring Supabase

1. Go to [app.supabase.com](https://app.supabase.com)
2. Navigate to **Logs** to see API requests
3. Check **Database** → **Monitor** for performance metrics

---

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use anon key in frontend** - The `SUPABASE_ANON_KEY` is safe (limited permissions)
3. **Use service role key only in backend** - Never expose to frontend
4. **Enable RLS** - Row Level Security in Supabase protects your data
5. **Rotate keys periodically** - In Supabase Settings → API → Regenerate

---

## Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Pages Alternative**: If you prefer GitHub Pages, see DEPLOYMENT_GITHUB.md

---

## Support & Questions

If you encounter issues:

1. **Check Vercel Logs**: Dashboard → **Deployments** → Click deployment → **Logs**
2. **Check Supabase Logs**: Settings → **Logs**
3. **GitHub Issues**: Open an issue in your repository
4. **Vercel Support**: https://vercel.com/support

---

## Deployment Timeline

| Task | Time |
|------|------|
| Create GitHub repo | 2 min |
| Push code | 1 min |
| Connect Vercel | 2 min |
| Set environment vars | 2 min |
| Deploy | 3-5 min |
| **Total** | **~10 min** |

---

## Next Steps

After successful deployment:

1. ✅ Share your live URL with others
2. ✅ Test on different devices
3. ✅ Collect user feedback
4. ✅ Plan additional features
5. ✅ Monitor analytics and performance

---

**Last Updated**: June 2026
**Project**: Álbum de Figurinhas Copa 2026
**Author**: Leandro Henrique
