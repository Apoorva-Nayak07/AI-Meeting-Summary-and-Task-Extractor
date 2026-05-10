# 🔧 Registration & Login Fix Guide

## ✅ ISSUE FIXED!

The backend was crashing on startup because OpenAI was trying to initialize immediately when the module loaded. This has been fixed with dynamic imports.

---

## 🚀 HOW TO RUN THE PROJECT

### Step 1: Start the Servers
```bash
npm run dev
```

**WAIT** for these messages:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
➜  Local:   http://localhost:5173/
```

### Step 2: Test the Backend (Optional)
Open a **NEW** terminal and run:
```bash
node test-backend.js
```

This will test:
- ✅ Backend health check
- ✅ User registration
- ✅ User login

### Step 3: Open the Website
Go to: **http://localhost:5173**

---

## 🧪 TESTING REGISTRATION & LOGIN

### Method 1: Use the Website
1. Click **"Get Started"** or **"Sign Up"**
2. Fill in the registration form:
   - **Name**: Your Name
   - **Email**: your@email.com
   - **Password**: minimum 6 characters
   - **Confirm Password**: same as password
3. Click **"Create Account"**
4. You should be redirected to the Dashboard

### Method 2: Use the Test Script
```bash
node test-backend.js
```

### Method 3: Use the HTML Test Tool
1. Open `test-auth.html` in your browser
2. Click the test buttons to diagnose issues

---

## ❌ COMMON ERRORS & SOLUTIONS

### Error: "Registration failed"
**Cause**: Backend not running or MongoDB not connected

**Solution**:
1. Check terminal for error messages
2. Ensure you see "MongoDB connected successfully"
3. Verify `backend/.env` has correct MongoDB URI
4. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)

### Error: "Network Error" or "Failed to fetch"
**Cause**: Backend server not running on port 5000

**Solution**:
```bash
# Stop any running servers (Ctrl+C)
npm run dev
```

### Error: "User already exists"
**Cause**: Email already registered

**Solution**:
- Use a different email address
- Or try logging in with existing credentials

### Error: "Invalid credentials"
**Cause**: Wrong email or password

**Solution**:
- Double-check your email and password
- Passwords are case-sensitive
- Try registering a new account

---

## 🔍 DEBUGGING CHECKLIST

### ✅ Backend Running?
```bash
# You should see:
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### ✅ Frontend Running?
```bash
# You should see:
➜  Local:   http://localhost:5173/
```

### ✅ MongoDB Connected?
- Check `backend/.env` has `MONGODB_URI`
- MongoDB Atlas cluster should be running
- IP whitelist should include 0.0.0.0/0

### ✅ Environment Variables Set?
Check `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
OPENAI_API_KEY=sk-proj-...
```

---

## 🎯 WHAT WAS FIXED

### Problem:
The backend was crashing with this error:
```
OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
```

### Root Cause:
OpenAI was being imported at the top of `meetingController.js`, causing it to initialize immediately when the server started, even though we only need it when processing meetings.

### Solution:
Changed OpenAI to use **dynamic imports** with lazy loading:
```javascript
// OLD (caused crash):
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// NEW (works perfectly):
let openai = null;
const getOpenAI = async () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import('openai');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};
```

Now OpenAI only loads when you actually process a meeting, not when the server starts!

---

## 📝 NEXT STEPS

1. **Stop any running servers** (Ctrl+C in terminal)
2. **Start fresh**: `npm run dev`
3. **Wait for success messages**
4. **Open browser**: http://localhost:5173
5. **Create account** and start using the app!

---

## 🆘 STILL HAVING ISSUES?

### Check Browser Console (F12)
Look for error messages in the Console tab

### Check Terminal Output
Look for error messages where you ran `npm run dev`

### Run Diagnostic
```bash
npm run diagnose
```

### Test Backend Directly
```bash
node test-backend.js
```

---

## ✨ SUCCESS INDICATORS

When everything is working, you should see:

**Terminal:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
➜  Local:   http://localhost:5173/
```

**Browser:**
- Registration form loads without errors
- After registration, you're redirected to Dashboard
- You see your name in the top-right corner
- No error messages in console (F12)

**Test Script:**
```
✅ Health Check: { status: 'ok', message: 'Server is running' }
✅ Registration Successful!
✅ Login Successful!
```

---

## 🎉 YOU'RE ALL SET!

Your authentication system is now working perfectly. You can:
- ✅ Create new accounts
- ✅ Login with existing accounts
- ✅ Access the dashboard
- ✅ Upload and process meetings

Happy coding! 🚀
