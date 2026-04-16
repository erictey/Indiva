@echo off
title Haven
echo Starting Haven...
cd /d "%~dp0"
npm run electron:dev
