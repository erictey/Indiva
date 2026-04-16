@echo off
title Indiva
echo Starting Indiva...
cd /d "%~dp0"
npm run electron:dev
