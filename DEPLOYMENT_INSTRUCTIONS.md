# LearnVow Deployment Instructions

## Deploying to Vercel

### Prerequisites
1. Create a GitHub account (if you don't have one)
2. Create a Vercel account (free at vercel.com)
3. Create a Supabase account (free at supabase.com)

### Step-by-Step Deployment

#### 1. Push Code to GitHub
```bash
git add .
git commit -m "Initial commit - LearnVow platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/learnvow.git
git push -u origin main
```

#### 2. Deploy Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework: Next.js
   - Root Directory: Leave empty
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_supabase_project_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_supabase_anon_key
6. Click "Deploy"

#### 3. Set Up Supabase Backend
1. Go to [Supabase](https://supabase.com) and create a new project
2. In Settings > API, copy:
   - Project URL (for `NEXT_PUBLIC_SUPABASE_URL`)
   - anon public key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. In Authentication > Settings, enable Email provider
4. In SQL Editor, run the schema from `DATABASE_SCHEMA.md`

#### 4. Configure Environment Variables in Vercel
After deployment:
1. Go to your Vercel project
2. Settings > Environment Variables
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_supabase_url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_supabase_anon_key

#### 5. Redeploy
After adding environment variables:
1. Go to Deployments
2. Click the three dots next to the latest deployment
3. Select "Redeploy"

## Custom Domain (Optional)
1. In Vercel Dashboard > Project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Monitoring Your Deployment
Vercel provides:
- Performance monitoring
- Error tracking
- Uptime monitoring
- Log viewing
- Analytics

## Updating Your Deployment
To update after making changes:
1. `git add .`
2. `git commit -m "Description of changes"`
3. `git push origin main`
4. Vercel will automatically redeploy

## Troubleshooting
Common issues:
1. **Environment variables not set** - Check Vercel project settings
2. **Supabase connection failed** - Verify Supabase credentials
3. **Build errors** - Check deployment logs in Vercel dashboard
4. **CORS errors** - Verify Supabase URL settings

This platform is now ready for production deployment!