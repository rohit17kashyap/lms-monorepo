# ============================================================
# RUN THIS EVERY TIME — starts all 3 services in new windows
# ============================================================

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`nStarting LMS Monorepo..." -ForegroundColor Cyan

# ── Django LMS on port 8000 ───────────────────────────────────
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$root\lms-base'; Write-Host '[Django LMS]' -ForegroundColor Cyan; .\venv\Scripts\activate; python manage.py runserver"
)

# ── Chatbot Server on port 5002 ───────────────────────────────
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$root\add-ons\chatbot\server'; Write-Host '[Chatbot Server]' -ForegroundColor Magenta; npm run dev"
)

# ── Chatbot Client on port 5173 ───────────────────────────────
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$root\add-ons\chatbot\client'; Write-Host '[Chatbot Client]' -ForegroundColor Green; npm run dev"
)

Write-Host "`n3 terminal windows opened." -ForegroundColor Green
Write-Host ""
Write-Host "  Django LMS   →  http://localhost:8000" -ForegroundColor White
Write-Host "  Django Admin →  http://localhost:8000/admin" -ForegroundColor White
Write-Host "  Chatbot API  →  http://localhost:5002" -ForegroundColor White
Write-Host "  Chatbot UI   →  http://localhost:5173`n" -ForegroundColor White
Write-Host "Make sure MongoDB is running on port 27017!" -ForegroundColor Yellow
