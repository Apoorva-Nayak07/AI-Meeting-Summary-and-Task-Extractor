# AI Meeting Assistant - Quick Fix Script
# Run this if you're having issues

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 AI MEETING ASSISTANT - QUICK FIX SCRIPT" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check 1: Node.js version
Write-Host "📋 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Node.js: $nodeVersion" -ForegroundColor White

if ($nodeVersion -match "v(\d+)\.") {
    $majorVersion = [int]$matches[1]
    if ($majorVersion -ge 18) {
        Write-Host "   ✅ Node.js version is compatible" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Node.js version too old. Please upgrade to v18+" -ForegroundColor Red
        Write-Host "   Download: https://nodejs.org/" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check 2: Environment files
Write-Host "📋 Checking environment files..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Write-Host "   ✅ backend/.env exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ backend/.env missing!" -ForegroundColor Red
    Write-Host "   Creating from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "   ✅ Created backend/.env - Please configure it!" -ForegroundColor Green
}

if (Test-Path "frontend\.env") {
    Write-Host "   ✅ frontend/.env exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ frontend/.env missing!" -ForegroundColor Red
    Write-Host "   Creating..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:5000/api" | Out-File -FilePath "frontend\.env" -Encoding UTF8
    Write-Host "   ✅ Created frontend/.env" -ForegroundColor Green
}

Write-Host ""

# Check 3: Node modules
Write-Host "📋 Checking dependencies..." -ForegroundColor Yellow

$needsInstall = $false

if (-not (Test-Path "node_modules")) {
    Write-Host "   ⚠️  Root node_modules missing" -ForegroundColor Yellow
    $needsInstall = $true
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "   ⚠️  Backend node_modules missing" -ForegroundColor Yellow
    $needsInstall = $true
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "   ⚠️  Frontend node_modules missing" -ForegroundColor Yellow
    $needsInstall = $true
}

if ($needsInstall) {
    Write-Host ""
    Write-Host "   Installing dependencies..." -ForegroundColor Yellow
    npm run install-all
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✅ All dependencies installed" -ForegroundColor Green
}

Write-Host ""

# Check 4: Uploads directory
Write-Host "📋 Checking uploads directory..." -ForegroundColor Yellow

if (-not (Test-Path "backend\uploads")) {
    Write-Host "   Creating uploads directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "backend\uploads" -Force | Out-Null
    Write-Host "   ✅ Created backend/uploads" -ForegroundColor Green
} else {
    Write-Host "   ✅ Uploads directory exists" -ForegroundColor Green
}

Write-Host ""

# Check 5: Kill processes on ports
Write-Host "📋 Checking for processes on ports..." -ForegroundColor Yellow

$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "   ⚠️  Port 5000 is in use" -ForegroundColor Yellow
    Write-Host "   Run this to kill it: taskkill /PID $($port5000.OwningProcess) /F" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Port 5000 is free" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "   ⚠️  Port 5173 is in use" -ForegroundColor Yellow
    Write-Host "   Run this to kill it: taskkill /PID $($port5173.OwningProcess) /F" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Port 5173 is free" -ForegroundColor Green
}

Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ QUICK FIX COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure backend/.env with your credentials:" -ForegroundColor White
Write-Host "   - MongoDB URI" -ForegroundColor Gray
Write-Host "   - OpenAI API Key" -ForegroundColor Gray
Write-Host "   - JWT Secret" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run diagnostic check:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm run diagnose" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. If all checks pass, start the app:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
