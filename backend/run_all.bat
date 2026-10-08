@echo off
echo ==============================================
echo   Starting Cognify Clothing App
echo ==============================================

echo [1] Installing backend dependencies (if any)...
cd /d "%~dp0"
call npm install
echo Starting Backend server...
start cmd /k "npm run dev"

echo [2] Installing frontend dependencies (if any)...
cd /d "%~dp0..\frontend"
call npm install
echo Starting Frontend server...
start cmd /k "npm run dev"
cd /d "%~dp0"

echo ==============================================
echo Both servers have been launched in separate 
echo windows. If they crash, the windows will stay 
echo open so you can read the error message.
echo ==============================================
pause
