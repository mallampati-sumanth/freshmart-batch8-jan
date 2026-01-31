# Start FreshMart Application Servers

Write-Host "Starting FreshMart Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\projects\freshmart-main\backend; D:/projects/freshmart-main/.venv/Scripts/python.exe manage.py runserver"

Start-Sleep -Seconds 3

Write-Host "Starting FreshMart Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\projects\freshmart-main\frontend; npm run dev"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "FreshMart Application Started!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:5173/" -ForegroundColor Yellow
Write-Host "Backend:  http://127.0.0.1:8000/" -ForegroundColor Yellow
Write-Host "Admin:    http://127.0.0.1:8000/admin/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Demo Login:" -ForegroundColor Cyan
Write-Host "  Username: john_doe" -ForegroundColor White
Write-Host "  Password: password123" -ForegroundColor White
Write-Host ""
