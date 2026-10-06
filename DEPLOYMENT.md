# Irish Whiskey Booking Platform - Deployment Guide

## Architecture
- **Frontend:** React (Create React App) → Vercel
- **Backend:** FastAPI + Python → Railway
- **Database:** MongoDB → Railway MongoDB Plugin

---

## 1. Railway Deployment (Backend + MongoDB)

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Choose **Deploy MongoDB** (adds MongoDB service)
4. Click **+ New** → **Empty Service** (for backend)

### Step 2: Configure MongoDB
1. Railway automatically creates `MONGO_URL` environment variable
2. Copy the MongoDB connection string

### Step 3: Deploy Backend
1. Connect your GitHub repository
2. Select `/app/backend` as root directory
3. Add environment variables in Railway dashboard:

```
MONGO_URL=<from MongoDB service>
DB_NAME=irish_whiskey_booking
JWT_SECRET=<generate random string>
FRONTEND_URL=<your-vercel-url>
PAYPAL_CLIENT_ID=<your paypal client id>
PAYPAL_SECRET=<your paypal secret>
RESEND_API_KEY=<your resend api key>
EMAIL_FROM=info@travel-events.de
SMTP_HOST=smtp.strato.de
SMTP_PORT=465
SMTP_USER=info@travel-events.de
SMTP_PASSWORD=<your smtp password>
```

4. Railway will auto-detect Python and deploy
5. Note your backend URL: `https://your-app.up.railway.app`

---

## 2. Vercel Deployment (Frontend)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`

### Step 2: Add Environment Variables
```
REACT_APP_BACKEND_URL=<your-railway-backend-url>
REACT_APP_PAYPAL_CLIENT_ID=<your paypal client id>
```

### Step 3: Deploy
- Click **Deploy**
- Note your frontend URL: `https://your-app.vercel.app`

---

## 3. Update Backend FRONTEND_URL

1. Go back to Railway
2. Update backend environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```
3. Redeploy backend

---

## 4. Initialize Database

### Seed Trip Data
```bash
curl -X POST https://your-backend.railway.app/api/admin/seed-trip \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>"
```

### Create Admin User
```bash
curl -X POST https://your-backend.railway.app/api/seed-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"info@travel-events.de","password":"<your-password>"}'
```

---

## 5. Test Deployment

1. Visit `https://your-app.vercel.app`
2. Check if page loads
3. Test booking flow
4. Verify admin dashboard at `/admin`

---

## Environment Variables Summary

### Backend (Railway)
- `MONGO_URL` - From Railway MongoDB plugin
- `DB_NAME` - irish_whiskey_booking
- `JWT_SECRET` - Random secure string
- `FRONTEND_URL` - Your Vercel URL
- `PAYPAL_CLIENT_ID` & `PAYPAL_SECRET`
- `RESEND_API_KEY` - For emails
- `SMTP_*` - SMTP credentials

### Frontend (Vercel)
- `REACT_APP_BACKEND_URL` - Your Railway backend URL
- `REACT_APP_PAYPAL_CLIENT_ID` - Same as backend

---

## Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` is set correctly in Railway
- Verify backend CORS allows your Vercel domain

### Database Connection Failed
- Verify `MONGO_URL` in Railway environment
- Check MongoDB service is running

### Payment Issues
- Verify PayPal credentials match in both frontend and backend
- Test with PayPal Sandbox first

### Email Not Sending
- Check Resend API key is valid
- Verify SMTP credentials if using fallback

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., irish-whiskey-tour.com)
3. Update DNS records as instructed

### Railway
1. Go to Service Settings → Domains
2. Add custom domain for backend API
3. Update `REACT_APP_BACKEND_URL` in Vercel

---

## Maintenance

- **Update Code:** Push to GitHub → Auto-deploys on both platforms
- **View Logs:** Railway dashboard for backend, Vercel dashboard for frontend
- **Scale:** Railway allows easy scaling of backend resources
