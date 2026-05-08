# ⚡ Quick Fix Guide

## 🚨 Having Issues? Run These Commands

### Step 1: Run Quick Fix Script (Windows)

```powershell
.\fix-common-issues.ps1
```

This will automatically:
- ✅ Check Node.js version
- ✅ Create missing .env files
- ✅ Install dependencies
- ✅ Create uploads directory
- ✅ Check for port conflicts

### Step 2: Run Diagnostic Check

```bash
cd backend
npm run diagnose
```

This will test:
- ✅ Environment variables
- ✅ MongoDB connection
- ✅ OpenAI API key
- ✅ Required packages
- ✅ File permissions

### Step 3: Fix Any Issues Found

Based on diagnostic results, fix issues in `backend/.env`

---

## 🔧 Manual Fixes

### Fix 1: Backend Won't Start

```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Restart
npm run dev
```

### Fix 2: MongoDB Connection Failed

Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

Check:
1. Username/password correct
2. IP whitelisted in MongoDB Atlas
3. Connection string format correct

### Fix 3: OpenAI API Error

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-proj-your-key-here
```

Verify:
1. Key starts with `sk-`
2. Key is valid
3. Account has credits

### Fix 4: Registration Fails

Check both servers are running:
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should see: "Server running on port 5000"

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Should see: "Local: http://localhost:5173"
```

### Fix 5: CORS Error

Edit `backend/.env`:
```env
CLIENT_URL=http://localhost:5173
```

Restart backend after changing.

---

## 🆘 Nuclear Option (Complete Reset)

If nothing works:

```bash
# 1. Stop all processes (Ctrl+C)

# 2. Delete everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force backend\node_modules
Remove-Item -Recurse -Force frontend\node_modules

# 3. Clean cache
npm cache clean --force

# 4. Reinstall
npm run install-all

# 5. Run diagnostic
cd backend
npm run diagnose

# 6. Start fresh
cd ..
npm run dev
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Backend Terminal Shows:**
   ```
   ✅ MongoDB connected successfully
   🚀 Server running on port 5000
   ```

2. **Frontend Terminal Shows:**
   ```
   VITE v5.4.21  ready in 1324 ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Browser Shows:**
   - Beautiful landing page loads
   - No errors in console (F12)
   - Can click "Get Started"

---

## 📞 Still Stuck?

1. Read `TROUBLESHOOTING.md` for detailed solutions
2. Check error messages carefully
3. Run diagnostic: `cd backend && npm run diagnose`
4. Verify all environment variables in `backend/.env`

---

## 🎯 Most Common Issues (90% of problems)

1. ❌ **Forgot to create `.env` files**
   → Run `.\fix-common-issues.ps1`

2. ❌ **Wrong MongoDB connection string**
   → Check MongoDB Atlas dashboard

3. ❌ **Invalid OpenAI API key**
   → Get new key from platform.openai.com

4. ❌ **Backend not running**
   → Check terminal for errors

5. ❌ **Port already in use**
   → Kill process: `taskkill /PID <PID> /F`

---

**Fix these 5 things and 90% of issues are solved!** 🎉
