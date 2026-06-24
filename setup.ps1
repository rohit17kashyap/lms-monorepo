# ============================================================
# RUN THIS ONCE — first-time setup for the entire monorepo
# ============================================================

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── 1. Django LMS ────────────────────────────────────────────
Write-Host "`n[1/5] Setting up Django LMS..." -ForegroundColor Cyan

$lmsPath = Join-Path $root "lms-base"
Set-Location $lmsPath

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    # Inject a random secret key
    $secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object { [char]$_ })
    (Get-Content ".env") -replace '<your_secret_key>', $secret | Set-Content ".env"
    Write-Host "  .env created with a random SECRET_KEY" -ForegroundColor Green
} else {
    Write-Host "  .env already exists, skipping" -ForegroundColor Yellow
}

# Create venv if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "  Creating Python virtual environment..."
    py -3.11 -m venv venv
} else {
    Write-Host "  venv already exists, skipping" -ForegroundColor Yellow
}

Write-Host "  Installing Python dependencies..."
& ".\venv\Scripts\pip.exe" install -r requirements.txt --quiet

Write-Host "  Running migrations..."
& ".\venv\Scripts\python.exe" manage.py makemigrations --no-input
& ".\venv\Scripts\python.exe" manage.py migrate --no-input

Write-Host "  Django setup complete!" -ForegroundColor Green

# ── 2. Chatbot Server ─────────────────────────────────────────
Write-Host "`n[2/5] Setting up Chatbot Server..." -ForegroundColor Cyan

$serverPath = Join-Path $root "add-ons\chatbot\server"
Set-Location $serverPath

# server.js reads dotenv from '../.env' so the file must live at add-ons/chatbot/.env
$chatbotEnv = Join-Path $root "add-ons\chatbot\.env"
if (-not (Test-Path $chatbotEnv)) {
    @"
PORT=5002
MONGODB_URI=mongodb://localhost:27017/chatbot_db
CLIENT_URL=http://localhost:5173
"@ | Set-Content $chatbotEnv
    Write-Host "  .env created at add-ons/chatbot/.env" -ForegroundColor Green
} else {
    Write-Host "  .env already exists, skipping" -ForegroundColor Yellow
}

Write-Host "  Installing Node dependencies..."
npm install --silent

Write-Host "  Seeding FAQ data..."
node seedFaqs.js

Write-Host "  Chatbot server setup complete!" -ForegroundColor Green

# ── 3. Chatbot Client ─────────────────────────────────────────
Write-Host "`n[3/5] Setting up Chatbot Client..." -ForegroundColor Cyan

$clientPath = Join-Path $root "add-ons\chatbot\client"
Set-Location $clientPath

Write-Host "  Installing Node dependencies..."
npm install --silent

Write-Host "  Chatbot client setup complete!" -ForegroundColor Green

# ── Done ──────────────────────────────────────────────────────
Write-Host "`n============================================" -ForegroundColor Green
Write-Host " Setup complete! Now run: .\start.ps1" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

Write-Host "NOTE: You still need to create a Django superuser (admin account)." -ForegroundColor Yellow
Write-Host "Run this after setup:" -ForegroundColor Yellow
Write-Host "  cd lms-base" -ForegroundColor White
Write-Host "  .\venv\Scripts\python.exe manage.py createsuperuser`n" -ForegroundColor White

Set-Location $root
