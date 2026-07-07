@echo off
rem MyshMat: commit + push (Vercel rebuilds automatically)
cd /d "%~dp0"
git add -A
set MSG=%*
if "%MSG%"=="" set MSG=update
git commit -m "%MSG%"
git push
echo.
echo Done. Vercel will pick up the push automatically.
pause
