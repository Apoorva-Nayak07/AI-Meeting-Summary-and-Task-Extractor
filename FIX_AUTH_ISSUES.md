# 🔧 Fix Registration & Login Issues

## 🎯 Quick Test Tool

I created a test page for you!

### **Open this file in your browser:**
```
test-auth.html
```

This will:
- ✅ Test backend connection
- ✅ Test registration
- ✅ Test login
- ✅ Show exact error messages
- ✅ Help diagnose the problem

---

## 🔍 Step-by-Step Diagnosis

### **Step 1: Check if Backend is Running**

Open PowerShell:
```powershell
netstat -ano | findstr :5000
```

**If you see output:** Backend is running ✅  
**If no output:** Backend is NOT running ❌

**Fix:**
```bash
npm run dev
```

Wait for:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

---

### **Step 2: Test Backend Health**

Open browser:
```
http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

**If you get an error:** Backend is not accessible

---

### **Step 3: Check Browser Console**

1. Open your app: http://localhost:5173
2. Press **F12** (Developer Tools)
3. Click **Console** tab
4. Try to register
5. Look for errors

**Common errors:**

#### ❌ "Network Error" or "ERR_CONNECTION_REFUSED"
**Problem:** Backend not running  
**Fix:** Run `npm run dev`

#### ❌ "CORS policy" error
**Problem:** CORS misconfigured  
**Fix:** Check `backend/.env` has `CLIENT_URL=http://localhost:5173`

#### ❌ "User already exists"
**Problem:** Email already registered  
**Fix:** Use a different email

#### ❌ "MongoDB connection error"
**Problem:** Database not connected  
**Fix:** Check MongoDB Atlas connection

---

## 🛠️ Common Fixes

### **Fix 1: Backend Not Running**

```bash
# Stop any existing process
# Press Ctrl+C in terminal

# Start fresh
npm run dev
```

**Wait for these messages:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
➜  Local:   http://localhost:5173/
```

---

### **Fix 2: Port Already in Use**

```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (replace <PID> with actual number)
taskkill /PID <PID> /F

# Start again
npm run dev
```

---

### **Fix 3: MongoDB Not Connected**

Check `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

**Verify:**
1. Connection string is correct
2. Username and password are correct
3. IP is whitelisted in MongoDB Atlas
4. Internet connection is working

**Test MongoDB:**
```bash
cd backend
npm run diagnose
```

---

### **Fix 4: CORS Issues**

Check `backend/.env`:
```env
CLIENT_URL=http://localhost:5173
```

**Restart backend after changing:**
```bash
npm run dev
```

---

### **Fix 5: Frontend API URL Wrong**

Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Restart frontend after changing:**
```bash
npm run dev
```

---

## 🧪 Manual Testing

### **Test Registration with PowerShell:**

```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"

$response
```

**Expected:** User data with token

---

### **Test Login with PowerShell:**

```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

$response
```

**Expected:** User data with token

---

## 📋 Complete Checklist

### **Before Testing:**

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected (check terminal)
- [ ] No errors in backend terminal
- [ ] `backend/.env` configured correctly
- [ ] `frontend/.env` configured correctly

### **Test Steps:**

1. [ ] Open `test-auth.html` in browser
2. [ ] Click "Test Health Endpoint" - should be ✅
3. [ ] Click "Register" - should be ✅
4. [ ] Click "Login" - should be ✅

### **If Tests Pass:**

- [ ] Go to http://localhost:5173
- [ ] Try registration in actual app
- [ ] Should work now!

---

## 🔧 Advanced Debugging

### **Check Backend Logs:**

Look at terminal where you ran `npm run dev`

**Good output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

**Bad output:**
```
❌ MongoDB connection error
❌ Port already in use
❌ Cannot find module
```

### **Check Network Tab:**

1. Open browser (F12)
2. Click "Network" tab
3. Try to register
4. Look for `/auth/register` request
5. Check status code:
   - **200/201:** Success ✅
   - **400:** Bad request (check data)
   - **500:** Server error (check backend logs)
   - **Failed:** Backend not running

---

## 🎯 Most Likely Issues

### **90% of problems are:**

1. **Backend not running** → Run `npm run dev`
2. **MongoDB not connected** → Check connection string
3. **Wrong API URL** → Check `frontend/.env`
4. **Port conflict** → Kill process and restart

---

## 🚀 Quick Fix Script

Run this in PowerShell:

```powershell
# Stop everything
# Press Ctrl+C

# Check ports
Write-Host "Checking ports..."
$backend = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$frontend = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($backend) {
    Write-Host "❌ Port 5000 in use - killing process..."
    taskkill /PID $backend.OwningProcess /F
}

if ($frontend) {
    Write-Host "❌ Port 5173 in use - killing process..."
    taskkill /PID $frontend.OwningProcess /F
}

Write-Host "✅ Ports cleared"
Write-Host "Starting servers..."

# Start fresh
npm run dev
```

---

## 📞 Still Not Working?

### **Try This:**

1. **Open test-auth.html** in browser
2. **Click all test buttons**
3. **Copy the error messages**
4. **Check which test fails:**
   - Health test fails → Backend not running
   - Register fails → Check error message
   - Login fails → Check credentials

### **Get Detailed Logs:**

```bash
# Backend logs
cd backend
npm run dev
# Watch for errors

# Frontend logs
# Open browser console (F12)
# Watch for errors
```

---

## ✅ Success Indicators

**You'll know it's working when:**

1. **test-auth.html shows:**
   - ✅ Backend is working!
   - ✅ Registration successful!
   - ✅ Login successful!

2. **Terminal shows:**
   - ✅ MongoDB connected successfully
   - 🚀 Server running on port 5000

3. **Browser shows:**
   - No errors in console (F12)
   - Can register successfully
   - Can login successfully
   - Redirects to dashboard

---

## 🎉 Final Steps

Once tests pass:

1. **Go to:** http://localhost:5173
2. **Click:** "Get Started" or "Sign Up"
3. **Register** with any email/password
4. **Should work!** ✅

---

**Most issues are fixed by ensuring backend is running properly!** 🚀

**Use test-auth.html to diagnose exactly what's wrong!** 🔧
