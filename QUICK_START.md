# ⚡ Quick Start Guide

Get the AI Meeting Assistant running in **5 minutes**!

## Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account (free tier)
- [ ] OpenAI API key
- [ ] Gmail account

## 1. Install Dependencies (2 minutes)

```bash
# Install all dependencies at once
npm run install-all
```

This installs dependencies for root, backend, and frontend.

## 2. Setup Environment Variables (2 minutes)

### Backend Configuration

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=create_a_long_random_string_here_min_32_chars
OPENAI_API_KEY=sk-your_openai_api_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Quick Tips:**
- MongoDB URI: Get from MongoDB Atlas → Connect → Connect your application
- JWT Secret: Use any long random string (e.g., keyboard mash for 32+ characters)
- OpenAI Key: Get from platform.openai.com → API keys
- Gmail App Password: Google Account → Security → App passwords

### Frontend Configuration

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 3. Run the Application (1 minute)

```bash
# Start both backend and frontend
npm run dev
```

**That's it!** 🎉

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 4. Test the Application

### Create Account
1. Go to http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Enter your details
4. Click "Create Account"

### Upload Test Meeting
1. Go to "Upload" page
2. Use a short audio file (30 seconds recommended)
3. Supported formats: MP3, WAV, M4A, MP4
4. Click "Upload & Process"
5. Wait ~1 minute for processing

### Explore Features
- ✅ View dashboard stats
- ✅ Check meeting summary
- ✅ Review extracted tasks
- ✅ Try AI chat feature
- ✅ Send test email
- ✅ View analytics

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check your MONGODB_URI in backend/.env
# Make sure IP is whitelisted in MongoDB Atlas
# Verify username and password are correct
```

### "OpenAI API error"
```bash
# Verify API key is correct
# Check you have credits in your OpenAI account
# Make sure key starts with 'sk-'
```

### "Port already in use"
```bash
# Kill process on port 5000 (backend)
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall dependencies
npm run install-all
```

## Next Steps

1. **Customize the UI**
   - Edit colors in `frontend/tailwind.config.js`
   - Modify components in `frontend/src/components`

2. **Add Your Branding**
   - Update app name in `frontend/index.html`
   - Change logo and colors

3. **Deploy to Production**
   - Follow `DEPLOYMENT.md` guide
   - Deploy frontend to Vercel
   - Deploy backend to Render

## Useful Commands

```bash
# Install all dependencies
npm run install-all

# Run both servers
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Backend development (with auto-reload)
cd backend && npm run dev

# Frontend development
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

## Project Structure Quick Reference

```
ai-meeting-assistant/
├── backend/          # Express API
│   ├── controllers/  # Business logic
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   └── server.js     # Entry point
│
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/    # Page components
│   │   └── components/ # Reusable components
│   └── index.html
│
└── package.json      # Root scripts
```

## Getting Help

1. Check error messages in terminal
2. Review browser console (F12)
3. Verify all environment variables
4. Check MongoDB connection
5. Verify OpenAI API key

## Important Notes

- **First upload takes longer** - OpenAI API cold start
- **Use short files for testing** - 30-60 seconds recommended
- **Check OpenAI credits** - Make sure you have balance
- **Gmail app password** - Not your regular Gmail password

## Test Audio Files

For testing, you can:
1. Record a short voice memo on your phone
2. Use any MP3 file you have
3. Record a quick test with your computer mic
4. Use a sample from freesound.org

**Recommended:** 30-60 second audio for quick testing

---

## Success Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] MongoDB connected
- [ ] OpenAI API key working
- [ ] Both servers running
- [ ] Account created
- [ ] Test meeting uploaded
- [ ] AI processing completed
- [ ] Dashboard showing stats

**All checked? You're ready to go! 🚀**

---

## What's Next?

- Read `README.md` for full documentation
- Check `FEATURES.md` for complete feature list
- Review `DEPLOYMENT.md` for production deployment
- Explore `PROJECT_OVERVIEW.md` for architecture details

**Happy coding!** 💻✨
