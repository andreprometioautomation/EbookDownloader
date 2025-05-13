@echo off
title Ejecutando: npm run dev

REM Asegúrate de estar en el directorio del proyecto
cd /d %~dp0

REM Verifica que npm esté disponible
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm no está instalado o no está en el PATH.
    pause
    exit /b 1
)

REM Ejecuta el servidor en una nueva consola y mantenla abierta
start cmd /k "npm run dev"
