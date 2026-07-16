@echo off
title PulseDeck Launcher
cd /d "%~dp0"

echo ========================================
echo         PulseDeck Project Launcher
echo ========================================
echo.
echo Clearing old frontend cache...
if exist "client\.next" rmdir /s /q "client\.next"

echo Starting backend in a separate window...
start "PulseDeck Backend - KEEP OPEN" cmd /k "cd /d ""%~dp0server"" && npm.cmd run dev"

echo Starting frontend in a separate window...
start "PulseDeck Frontend - KEEP OPEN" cmd /k "cd /d ""%~dp0client"" && npm.cmd run dev"

echo.
echo Two windows were opened. Keep BOTH windows open.
echo Wait until the frontend says Ready.
echo Then open: http://localhost:3000/login
echo.
pause
