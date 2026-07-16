@echo off
title PulseDeck Screen Recording Test
cd /d "%~dp0"

if not exist "e2e\.env.e2e.local" (
  echo Missing private credential file.
  echo.
  echo 1. Copy e2e\.env.e2e.example
  echo 2. Rename the copy to .env.e2e.local
  echo 3. Add your deployed demo passwords
  echo 4. Run this file again
  echo.
  pause
  exit /b 1
)

echo ========================================
echo       PulseDeck Full App Demo Test
echo ========================================
echo.
echo Start your screen recorder now.
echo The browser will open and demonstrate all main role flows.
echo Do not use the mouse while the test is running.
echo.
pause
npm.cmd run test:e2e:video
echo.
echo Test finished. Stop and save your screen recording.
pause
