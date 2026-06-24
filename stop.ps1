# Stops Django, chatbot server, and chatbot client

Write-Host "`nStopping all LMS services..." -ForegroundColor Yellow

# Kill Django (python manage.py runserver)
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  Django stopped" -ForegroundColor Green

# Kill Node (chatbot server + client)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  Chatbot server stopped" -ForegroundColor Green

# Kill Vite (chatbot client dev server)
Get-Process -Name "vite" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  Chatbot client stopped" -ForegroundColor Green

Write-Host "`nAll services stopped.`n" -ForegroundColor Green
