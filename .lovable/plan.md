

# Deploy to Vercel

Your app is a standard Vite + React SPA with client-side routing. Two small changes are needed to make it Vercel-ready:

## 1. Add Vercel rewrite config

Since the app uses React Router (client-side routing), all routes need to fall back to `index.html`. Without this, refreshing on any page like `/inventory` will return a 404.

A `vercel.json` file will be created at the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 2. Set environment variables on Vercel

When deploying, you'll need to add these environment variables in the Vercel dashboard (Settings > Environment Variables):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These values are already in your `.env` file -- just copy them over to Vercel.

## Deployment steps

1. Push your repo to GitHub (if not already connected)
2. Import the repo in Vercel
3. Vercel will auto-detect Vite -- framework preset, build command (`vite build`), and output directory (`dist`) are all correct by default
4. Add the two environment variables above
5. Deploy

No other changes are needed -- the project is already well-structured for deployment.

