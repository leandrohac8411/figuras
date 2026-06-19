# Deployment Guide - Figurinhas Album 2026

This guide covers the complete setup and deployment process for the Figurinhas Album 2026 application, including Supabase database configuration and Vercel deployment.

## Table of Contents

1. [Local Setup](#local-setup)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Creation](#database-schema-creation)
4. [Seed Database](#seed-database)
5. [Deploy to Vercel](#deploy-to-vercel)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

---

## Local Setup

### Prerequisites

- Node.js 18+ or PHP 8.1+
- Git
- A Supabase account (free tier available at https://supabase.com)
- A Vercel account (optional, for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd figurinhas-album-2026
```

2. Install dependencies (if using Node.js backend):
```bash
npm install
```

3. Create local environment file:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials (see [Supabase Project Setup](#supabase-project-setup) below).

---

## Supabase Project Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **"New Project"** or sign in if not already logged in
3. Fill in the project details:
   - **Project Name:** `figurinhas-album-2026`
   - **Database Password:** Generate a strong password (save this safely!)
   - **Region:** Brazil (São Paulo) - `sa-east-1` or closest available region
   - **Pricing Plan:** Free tier is sufficient for development

4. Click **"Create new project"** and wait for initialization (~5 minutes)

### Step 2: Retrieve Supabase Credentials

Once your project is created and initialized:

1. Navigate to **Project Settings** (gear icon in bottom left)
2. Go to **API** tab
3. Copy the following credentials:
   - **Project URL** (format: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
   - **service_role key** (for backend operations, store securely)

4. Update your `.env.local` file:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** Never commit `.env.local` to version control!

---

## Database Schema Creation

### Step 1: Access Supabase SQL Editor

1. In your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Click **"New Query"**

### Step 2: Run Schema Creation SQL

Copy and paste the following SQL script into the SQL Editor and execute it:

```sql
-- Create table for groups
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo TEXT UNIQUE NOT NULL CHECK (grupo IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L')),
  created_at TIMESTAMP DEFAULT now()
);

-- Create table for countries
CREATE TABLE paises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sigla TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  grupo TEXT NOT NULL REFERENCES grupos(grupo),
  created_at TIMESTAMP DEFAULT now()
);

-- Create table for figurinhas (stickers)
CREATE TABLE figurinhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  pais_sigla TEXT NOT NULL REFERENCES paises(sigla),
  grupo TEXT NOT NULL REFERENCES grupos(grupo),
  categoria TEXT,
  tem BOOLEAN DEFAULT FALSE,
  duplicatas INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance optimization
CREATE INDEX idx_figurinhas_codigo ON figurinhas(codigo);
CREATE INDEX idx_figurinhas_grupo ON figurinhas(grupo);
CREATE INDEX idx_figurinhas_pais_sigla ON figurinhas(pais_sigla);
CREATE INDEX idx_figurinhas_duplicatas ON figurinhas(duplicatas) WHERE duplicatas > 0;

-- Disable Row Level Security for personal use
-- Note: Enable RLS in production with proper policies
ALTER TABLE grupos DISABLE ROW LEVEL SECURITY;
ALTER TABLE paises DISABLE ROW LEVEL SECURITY;
ALTER TABLE figurinhas DISABLE ROW LEVEL SECURITY;
```

### Step 3: Verify Schema Creation

After running the SQL script:

1. Go to **Table Editor** in the left sidebar
2. You should see three tables listed:
   - `grupos`
   - `paises`
   - `figurinhas`

3. Click on each table to verify the columns and data types are correct

---

## Seed Database

### Step 1: Prepare Seed Data

Seed data files should be located in `/data` directory. The structure should be:

```
/data
  ├── grupos.json
  ├── paises.json
  └── figurinhas.json
```

### Step 2: Insert Seed Data

#### Option A: Via SQL Editor

1. Go to **SQL Editor** → **New Query**
2. Insert sample data:

```sql
-- Insert groups
INSERT INTO grupos (grupo) VALUES
  ('A'), ('B'), ('C'), ('D'), ('E'), ('F'), ('G'), ('H'), ('I'), ('J'), ('K'), ('L');

-- Insert countries (example)
INSERT INTO paises (sigla, nome, grupo) VALUES
  ('BR', 'Brasil', 'A'),
  ('US', 'Estados Unidos', 'B'),
  ('FR', 'França', 'C'),
  ('DE', 'Alemanha', 'D'),
  ('ES', 'Espanha', 'E'),
  ('IT', 'Itália', 'F'),
  ('PT', 'Portugal', 'G'),
  ('AR', 'Argentina', 'H'),
  ('MX', 'México', 'I'),
  ('JP', 'Japão', 'J');

-- Insert figurinhas (example)
INSERT INTO figurinhas (codigo, nome, pais_sigla, grupo) VALUES
  ('001', 'Figurinha Brasil 001', 'BR', 'A'),
  ('002', 'Figurinha Brasil 002', 'BR', 'A'),
  ('003', 'Figurinha USA 001', 'US', 'B');
```

#### Option B: Via Application Script

If you have a Node.js/PHP script in `/scripts`, run:

```bash
npm run seed
# or
php scripts/seed.php
```

### Step 3: Verify Seed Data

In Supabase Dashboard:
1. Go to **Table Editor**
2. Click on each table to verify data was inserted correctly

---

## Deploy to Vercel

### Step 1: Prepare for Deployment

1. Ensure all changes are committed to git:
```bash
git add .
git commit -m "Setup Supabase schema and environment configuration"
git push origin main
```

2. The project must be pushed to GitHub (or GitLab/Bitbucket)

### Step 2: Create Vercel Project

1. Go to https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repository:
   - Select the `figurinhas-album-2026` repository
   - Click **"Import"**

4. Configure project settings:
   - **Framework Preset:** Select appropriate framework (Next.js, if applicable)
   - **Root Directory:** `.` (current directory)
   - **Build Command:** `npm run build` (or appropriate command)
   - **Output Directory:** `.next` (if using Next.js) or `dist` (if using other frameworks)

### Step 3: Add Environment Variables

In Vercel Project Settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:
   - **Name:** `SUPABASE_URL`
     **Value:** `https://xxxxx.supabase.co` (from Step 2 of Supabase setup)
   - **Name:** `SUPABASE_ANON_KEY`
     **Value:** Your anon public key
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
     **Value:** Your service role key (for backend operations)

3. Click **"Save"** for each variable

### Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build and deployment to complete
3. You'll receive a URL: `https://figurinhas-album-2026.vercel.app`

### Step 5: Verify Production Deployment

1. Visit your deployment URL
2. Test basic functionality:
   - Load the figurinhas album
   - Try filtering by group
   - Try marking figurinhas as owned

---

## Environment Variables

### Local Development (`.env.local`)

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Vercel Production

Set the same variables in Vercel project settings (Environment Variables).

### Variable Descriptions

| Variable | Description | Where to Get |
|----------|-------------|-------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Project Settings → API |
| `SUPABASE_ANON_KEY` | Public anonymous key for client-side queries | Supabase Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend-only key for admin operations | Supabase Project Settings → API |

---

## Troubleshooting

### Connection Errors

#### Error: "Cannot connect to Supabase"

**Possible causes:**
1. Incorrect `SUPABASE_URL` or `SUPABASE_ANON_KEY`
2. Environment variables not loaded
3. Supabase project not fully initialized

**Solutions:**
1. Verify credentials in `.env.local` are correct (copy from Supabase UI again)
2. Restart the development server after updating `.env.local`
3. Wait 5-10 minutes for Supabase project to fully initialize

```bash
# Verify variables are loaded
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Database Seed Failures

#### Error: "Foreign key constraint violation"

**Possible cause:** Attempting to insert `paises` before `grupos` table is populated

**Solution:** Ensure the seed script runs in the correct order:
1. `grupos` table first
2. `paises` table second
3. `figurinhas` table third

#### Error: "Duplicate key value violates unique constraint"

**Possible cause:** Running seed script twice

**Solution:** Either:
1. Delete existing data from tables: `DELETE FROM figurinhas; DELETE FROM paises; DELETE FROM grupos;`
2. Or modify seed script to use `INSERT ... ON CONFLICT DO UPDATE`

### 404 or "Not Found" Errors

#### Error: Tables not visible in Table Editor

**Possible cause:** Schema creation SQL didn't execute successfully

**Solution:**
1. Go to SQL Editor
2. Run: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
3. If tables not listed, re-run the schema creation SQL

### Environment Variable Issues on Vercel

#### Error: "SUPABASE_URL is undefined" in production

**Possible cause:** Environment variables not added to Vercel project

**Solution:**
1. Go to Vercel Project Settings → Environment Variables
2. Verify all three variables are listed
3. Redeploy the project: Click **"Redeploy"** button

#### Error: Variables work locally but not on Vercel

**Solution:** 
1. Vercel environment variables are cached. Force a redeployment:
```bash
git push origin main  # This triggers a new Vercel deployment
```

2. Or manually redeploy in Vercel dashboard by clicking the **"Redeploy"** button

### Performance Issues

#### Slow queries on figurinhas table

**Solution:** Verify indexes were created:

```sql
SELECT * FROM pg_indexes WHERE tablename = 'figurinhas';
```

If indexes are missing, recreate them:

```sql
CREATE INDEX idx_figurinhas_codigo ON figurinhas(codigo);
CREATE INDEX idx_figurinhas_grupo ON figurinhas(grupo);
CREATE INDEX idx_figurinhas_pais_sigla ON figurinhas(pais_sigla);
CREATE INDEX idx_figurinhas_duplicatas ON figurinhas(duplicatas) WHERE duplicatas > 0;
```

### Row Level Security (RLS) Issues

#### Error: "new row violates row-level security policy"

**Current Status:** RLS is disabled for this project (personal use)

**To Enable RLS (Production):**
1. Go to Supabase Authentication settings
2. Create RLS policies for each table
3. Enable RLS:

```sql
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE paises ENABLE ROW LEVEL SECURITY;
ALTER TABLE figurinhas ENABLE ROW LEVEL SECURITY;
```

---

## Additional Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/

## Support

For issues or questions:
1. Check this troubleshooting guide
2. Review Supabase documentation at https://supabase.com/docs
3. Check Vercel deployment logs for error messages
4. Contact the development team

---

**Last Updated:** 2026-06-18  
**Version:** 1.0.0
