@echo off
title Indiva Build
echo Building Indiva for Windows...
cd /d "%~dp0"
call npm run electron:build
echo.
echo Build complete. Check the "release" folder for the installer.
pause
