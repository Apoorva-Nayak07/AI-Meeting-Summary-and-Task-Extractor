# 🚀 Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- OpenAI API key
- Gmail account (for email features)

## Backend Deployment (Render/Railway)

### Option 1: Render

1. **Create New Web Service**
   - Connect your GitHub repository
   - Select `backend` as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   OPENAI_API_KEY=sk-your-openai-api-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   CLIENT_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the backend URL

### Option 2: Railway

1. **Create New Project**
   ```bash
   railway login
   railway init
   railway up
   ```

2. **Add Environment Variables**
   - Go to project settings
   - Add all environment variables from above

3. **Deploy**
   ```bash
   railway up
   ```

## Frontend Deployment (Vercel)

### Method 1: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Environment Variables**
   - Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### Method 2: Vercel Dashboard

1. **Import Project**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Configure Build**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   - Add `VITE_API_URL` with your backend URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to mongodb.com/cloud/atlas
   - Create free cluster
   - Choose cloud provider and region

2. **Database Access**
   - Create database user
   - Set username and password
   - Save credentials

3. **Network Access**
   - Add IP: `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs

4. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

## OpenAI API Setup

1. **Get API Key**
   - Go to platform.openai.com
   - Create account or login
   - Go to API keys section
   - Create new secret key
   - Copy and save securely

2. **Add Credits**
   - Add payment method
   - Add credits ($5-10 recommended for testing)

## Gmail App Password

1. **Enable 2FA**
   - Go to Google Account settings
   - Enable 2-factor authentication

2. **Generate App Password**
   - Go to Security > App passwords
   - Select "Mail" and "Other"
   - Generate password
   - Copy 16-character password

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and loads
- [ ] MongoDB connection is working
- [ ] OpenAI API calls are successful
- [ ] Email sending works
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] File uploads work
- [ ] Authentication works
- [ ] All API endpoints respond

## Testing Production

1. **Register New Account**
   ```
   Visit: https://your-app.vercel.app/register
   Create test account
   ```

2. **Upload Test Meeting**
   - Use a short audio file (30 seconds)
   - Test transcription
   - Verify AI processing

3. **Check All Features**
   - Dashboard stats
   - Meeting history
   - Analytics charts
   - Email sending
   - AI chat

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Check connection string format
- Verify IP whitelist
- Check username/password

**OpenAI API Errors**
- Verify API key is correct
- Check account has credits
- Review rate limits

**File Upload Fails**
- Check disk space
- Verify multer configuration
- Check file size limits

### Frontend Issues

**API Calls Fail**
- Verify VITE_API_URL is correct
- Check CORS configuration
- Inspect network tab

**Build Errors**
- Clear node_modules
- Run `npm install` again
- Check Node.js version

## Monitoring

### Backend Logs
```bash
# Render
View logs in dashboard

# Railway
railway logs
```

### Frontend Logs
```bash
# Vercel
View logs in dashboard
```

## Scaling Considerations

1. **Database**
   - Upgrade MongoDB cluster for more storage
   - Add indexes for faster queries

2. **Backend**
   - Increase server resources
   - Add Redis for caching
   - Implement queue for AI processing

3. **Frontend**
   - Use CDN for static assets
   - Implement lazy loading
   - Optimize images

## Security Best Practices

- [ ] Use strong JWT secret
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Sanitize file uploads
- [ ] Use HTTPS only
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities
- [ ] Implement logging
- [ ] Set up error tracking (Sentry)

## Cost Estimates

**Monthly Costs (Approximate)**

- MongoDB Atlas: $0 (Free tier)
- Render/Railway: $0-7 (Free tier or starter)
- Vercel: $0 (Free tier)
- OpenAI API: $5-50 (usage-based)
- **Total: $5-60/month**

## Support

For issues or questions:
- Check logs first
- Review environment variables
- Test API endpoints individually
- Check MongoDB connection
- Verify OpenAI API key

---

**Congratulations! Your AI Meeting Assistant is now live! 🎉**
