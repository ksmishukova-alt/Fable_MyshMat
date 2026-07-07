@echo off
rem MyshMat 2.0 - first push to GitHub (run ONCE)
rem Usage: setup-git.bat https://github.com/USER/REPO.git
cd /d "%~dp0"

if "%~1"=="" (
  echo Usage: setup-git.bat ^<repo-url.git^>
  echo Example: setup-git.bat https://github.com/ksmishukova-alt/Fable_MyshMat.git
  pause
  exit /b 1
)

rem cleanup: broken .git skeleton left by sandbox
if exist ".git\config.lock" del /f /q ".git\config.lock"
if exist ".git" if not exist ".git\objects" rmdir /s /q ".git"

git init -b main
git add -A
git commit -m "MyshMat 2.0: full platform (Daily + olympiad core L1-L3 + rewards + cabinets + duels)"
git remote add origin %~1
git push -u origin main

echo.
echo Done! Next: vercel.com - Add New Project - Import this repo
echo Root Directory: apps/web  +  env vars (see DEPLOY notes)
pause
