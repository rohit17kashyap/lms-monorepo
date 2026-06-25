# Stops all LMS services: Django, chatbot, and live-streaming

Write-Host "`nStopping all LMS services..." -ForegroundColor Yellow

# Kill Django
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  Django stopped" -ForegroundColor Green

# Kill Node (chatbot server + live-streaming server)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  Node servers stopped (chatbot + live-streaming)" -ForegroundColor Green

# Kill Vite (chatbot client + live-streaming client)
Get-Process -Name "vite" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  Vite clients stopped (chatbot + live-streaming)" -ForegroundColor Green

Write-Host "`nAll services stopped.`n" -ForegroundColor Green
