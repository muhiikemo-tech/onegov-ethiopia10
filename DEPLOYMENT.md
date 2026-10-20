# Deployment Guide

## Recommended Stack
| Service | Provider | URL |
|---------|----------|-----|
| API | Render | https://render.com |
| Database | Neon.tech | https://neon.tech |
| Web | Vercel | https://vercel.com |
| Admin | Vercel | https://vercel.com |
| Mobile | Expo EAS | https://expo.dev |

## Step 1: Database (Neon.tech)
1. Sign up at https://neon.tech
2. Create project "onegov"
3. Copy connection string
4. Apply schema:
   `psql "postgresql://..." -f apps/api/onegov_schema.sql`

## Step 2: API (Render)
1. New Web Service → connect GitHub repo
2. Root Directory: `apps/api`
3. Build Command: `pnpm install --ignore-scripts && pnpm build`
4. Start Command: `node dist/server.js`
5. Env Vars:
   - `DATABASE_URL` (from Neon)
   - `JWT_ACCESS_SECRET` (32+ chars)
   - `JWT_REFRESH_SECRET` (32+ chars)
   - `EKYC_ENCRYPTION_KEY` (32+ chars)
   - `CSRF_SECRET` (16+ chars)
   - `CORS_ORIGINS` (Vercel URLs)
   - `NODE_ENV=production`

## Step 3: Web (Vercel)
1. Import repo
2. Root Directory: `apps/web`
3. Build: `pnpm build` (Vite)
4. Add `vercel.json` for API rewrites

## Step 4: Admin (Vercel)
Same as Web, root `apps/admin`.

## Step 5: Production Checklist
- [ ] Change all secrets
- [ ] Set NODE_ENV=production
- [ ] Enable CSRF
- [ ] Configure CORS
- [ ] Set up SSL
- [ ] Configure DB backups
