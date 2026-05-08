# 🔧 Complete Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ Issue 1: Backend Crashes on Startup

### Error Message:
```
OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
```

### ✅ Solution:
**Already Fixed!** The OpenAI client now initializes lazily (only when needed).

**Verify Fix:**
1. Check `backend/controllers/meetingController.js` has `getOpenAI()` function
2. Backend should start even without OpenAI key
3. You'll only need the key when processing meetings

---

## ❌ Issue 2: MongoDB Connection Failed

### Error Message:
```
MongooseError: Could not connect to MongoDB
```

### ✅ Solutions:

**A. Check Connection String**
```env
# backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

**B. Whitelist IP Address**
1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Add `0.0.0.0/0` (allow all) for development

**C. Check Username/Password**
- No special characters that need encoding
- Or URL-encode special characters

**D. Test Connection:**
```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err.message))"
```

---

## ❌ Issue 3: Registration/Login Fails

### Error Message:
```
Registration failed
Network Error
```

### ✅ Solutions:

**A. Check Backend is Running**
```bash
# Should see:
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**B. Check CORS Configuration**
Backend `.env` should have:
```env
CLIENT_URL=http://localhost:5173
```

**C. Check Frontend API URL**
Frontend `.env` should have:
```env
VITE_API_URL=http://localhost:5000/api
```

**D. Test API Manually:**
Open browser console (F12) and run:
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(console.log)
```

---

## ❌ Issue 4: File Upload Fails

### Error Message:
```
Please upload a file
Invalid file type
```

### ✅ Solutions:

**A. Check File Format**
Supported: MP3, WAV, M4A, MP4, WebM
Max size: 100MB

**B. Check Backend Uploads Directory**
```bash
# Should be created automatically
# If not, create manually:
mkdir backend/uploads
```

**C. Check Multer Configuration**
File: `backend/middleware/upload.js` should exist

---

## ❌ Issue 5: AI Processing Fails

### Error Message:
```
AI processing failed
OpenAI API error
```

### ✅ Solutions:

**A. Check OpenAI API Key**
```env
# backend/.env
OPENAI_API_KEY=sk-proj-...your-key-here
```

**B. Verify API Key is Valid**
Test in terminal:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**C. Check OpenAI Credits**
1. Go to https://platform.openai.com/account/billing
2. Make sure you have credits
3. Add $5-10 for testing

**D. Check Rate Limits**
- Free tier has limits
- Wait a few minutes and try again

---

## ❌ Issue 6: Email Sending Fails

### Error Message:
```
Failed to send email
Invalid credentials
```

### ✅ Solutions:

**A. Use Gmail App Password (Not Regular Password)**
```env
# backend/.env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # 16-character app password
```

**B. Generate App Password:**
1. Enable 2FA on Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other"
4. Copy 16-character password
5. Remove spaces when pasting

**C. Alternative: Skip Email Feature**
Email is optional. You can use the app without it.

---

## ❌ Issue 7: Port Already in Use

### Error Message:
```
Error: listen EADDRINUSE: address already in use :::5000
```

### ✅ Solutions:

**A. Kill Process on Port 5000 (Backend)**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

**B. Kill Process on Port 5173 (Frontend)**
```bash
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

**C. Change Port (Alternative)**
```env
# backend/.env
PORT=5001

# frontend/vite.config.js
server: { port: 5174 }
```

---

## ❌ Issue 8: Module Not Found

### Error Message:
```
Cannot find module 'express'
Cannot find module 'react'
```

### ✅ Solutions:

**A. Reinstall Dependencies**
```bash
# Clean install
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
npm run install-all
```

**B. Clear npm Cache**
```bash
npm cache clean --force
npm run install-all
```

**C. Check Node Version**
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

---

## ❌ Issue 9: Frontend Shows Blank Page

### Error Message:
```
(Blank white page)
```

### ✅ Solutions:

**A. Check Browser Console (F12)**
Look for errors in Console tab

**B. Check Network Tab**
- Are API calls failing?
- Check status codes (200 = OK, 500 = Server Error)

**C. Clear Browser Cache**
```
Ctrl + Shift + Delete
Clear cache and reload
```

**D. Try Incognito Mode**
```
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
```

---

## ❌ Issue 10: CORS Errors

### Error Message:
```
Access to fetch blocked by CORS policy
```

### ✅ Solutions:

**A. Check Backend CORS Config**
File: `backend/server.js`
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

**B. Check Environment Variables**
```env
# backend/.env
CLIENT_URL=http://localhost:5173
```

**C. Restart Backend**
```bash
# Stop and restart
npm run dev
```

---

## ❌ Issue 11: Slow Performance

### Symptoms:
- Pages load slowly
- AI processing takes too long
- App feels sluggish

### ✅ Solutions:

**A. Use Shorter Audio Files**
- Test with 30-60 second files
- Longer files take more time

**B. Check Internet Connection**
- OpenAI API requires internet
- MongoDB Atlas requires internet

**C. Check System Resources**
- Close other applications
- Check CPU/RAM usage

**D. Optimize Database Queries**
Already optimized with indexes

---

## ❌ Issue 12: Build Errors

### Error Message:
```
Build failed
Vite build error
```

### ✅ Solutions:

**A. Check for Syntax Errors**
```bash
# Frontend
cd frontend
npm run build
```

**B. Fix Import Errors**
Make sure all imports are correct

**C. Check Dependencies**
```bash
npm run install-all
```

---

## 🔍 Diagnostic Commands

### Check Everything is Working:

```bash
# 1. Check Node/npm versions
node --version
npm --version

# 2. Check if ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# 3. Test MongoDB connection
cd backend
node -e "require('dotenv').config(); console.log('MongoDB URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing')"

# 4. Test OpenAI key
node -e "require('dotenv').config(); console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing')"

# 5. Check backend starts
cd backend
npm run dev

# 6. Check frontend starts
cd frontend
npm run dev
```

---

## 🆘 Emergency Reset

If nothing works, try this complete reset:

```bash
# 1. Stop all processes
# Press Ctrl+C in all terminals

# 2. Delete everything
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf backend/uploads

# 3. Clean npm cache
npm cache clean --force

# 4. Reinstall everything
npm run install-all

# 5. Verify environment files exist
# Check backend/.env
# Check frontend/.env

# 6. Restart
npm run dev
```

---

## 📞 Still Having Issues?

### Check These Files:

1. **backend/.env** - All environment variables set?
2. **frontend/.env** - API URL correct?
3. **backend/server.js** - Server starting?
4. **Browser Console (F12)** - Any errors?
5. **Terminal Output** - Any error messages?

### Common Mistakes:

- ❌ Forgot to create `.env` files
- ❌ Wrong MongoDB connection string
- ❌ OpenAI API key invalid
- ❌ Backend not running
- ❌ Wrong port numbers
- ❌ CORS misconfigured
- ❌ File format not supported

---

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm run install-all`)
- [ ] `backend/.env` created and configured
- [ ] `frontend/.env` created
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB IP whitelisted
- [ ] OpenAI API key obtained
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can register an account
- [ ] Can login successfully

---

## 🎯 Quick Test Script

Save this as `test.js` in backend folder:

```javascript
require('dotenv').config();

console.log('🔍 Environment Check:');
console.log('PORT:', process.env.PORT ? '✅' : '❌');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅' : '❌');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅' : '❌');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅' : '❌');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅' : '❌');
console.log('CLIENT_URL:', process.env.CLIENT_URL ? '✅' : '❌');

// Test MongoDB connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\n✅ MongoDB connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.log('\n❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
```

Run: `node test.js`

---

## 📚 Additional Resources

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **OpenAI API Docs:** https://platform.openai.com/docs
- **Vite Docs:** https://vitejs.dev/
- **Express Docs:** https://expressjs.com/

---

**Most issues are solved by:**
1. ✅ Proper environment configuration
2. ✅ Valid API keys
3. ✅ Correct port numbers
4. ✅ Backend running before frontend

**If you're still stuck, check the error message carefully and match it to the solutions above!** 🔧
