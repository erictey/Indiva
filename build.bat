@echo off
title Haven Build
echo Building Haven for Windows...
cd /d "%~dp0"
call npm run electron:build
echo.
echo Build complete. Check the "release" folder for the installer.
pause
