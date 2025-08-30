# 🆓 Vercel Free Deployment Instructions

## 🚀 Quick Deploy

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend
cd frontend

# 3. Login to Vercel
vercel login

# 4. Deploy
vercel

# 5. For production
vercel --prod
```

## 🌐 Your Live URLs

After deployment, you'll get:
- **Frontend**: https://your-app.vercel.app
- **API**: https://your-app.vercel.app/api/search
- **Health**: https://your-app.vercel.app/api/health

## 🔧 Environment Variables

In Vercel dashboard, add:
- `NEXT_PUBLIC_API_URL` = (leave empty for same domain)

## 📋 Free Database Options

Choose one:
- **Supabase**: Free PostgreSQL (500MB)
- **PlanetScale**: Free MySQL (10GB)  
- **Neon**: Free PostgreSQL (10GB)
- **MongoDB Atlas**: Free MongoDB (512MB)

## ✅ Testing

```bash
# Test locally
npm run dev

# Test API
curl http://localhost:3000/api/search?term=coffee

# Test health
curl http://localhost:3000/api/health
```

## 🎯 What's Included

✅ Frontend on Vercel CDN
✅ API routes as serverless functions
✅ Automatic HTTPS
✅ Global deployment
✅ Git integration
✅ Custom domain support (1 free)

## ⚠️ Free Tier Limits

- Function timeout: 10 seconds
- Bandwidth: 100GB/month  
- Build time: 6000 minutes/month
- File size: 50MB max
