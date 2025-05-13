@echo off
cls
title Instalador Node.js + Playwright - DEBUG
setlocal enabledelayedexpansion

set "INSTALLER=node-v20.11.1-x64.msi"

echo ================================
echo 🛠 INICIANDO INSTALADOR DEBUG
echo ================================
echo.

REM 1. Verificar que el instalador existe
if not exist "%~dp0%INSTALLER%" (
    echo ❌ ERROR: No se encontró "%INSTALLER%" en la carpeta actual.
    echo Asegúrate de tener el instalador en esta carpeta.
    goto end
)

REM 2. Verificar si node está instalado
where node >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ✅ Node.js ya está instalado.
) else (
    echo 🚀 Instalando Node.js desde %INSTALLER%...
    start /wait msiexec /i "%~dp0%INSTALLER%"
    echo ✅ Instalación completada (o cerrada manualmente).
    timeout /t 10 >nul
)

REM 3. Mostrar versiones para verificar instalación
echo.
echo 📦 Verificando node y npm...
where node
node -v
where npm
npm -v

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js o npm no están funcionando.
    goto end
)

REM 4. Ejecutar npx playwright install
echo.
echo ▶️ Ejecutando: npx playwright install
call npx playwright install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Falló npx playwright install
    goto end
)

REM 5. Ejecutar npm install
echo.
echo ▶️ Ejecutando: npm install
if not exist package.json (
    echo ❌ No se encontró package.json. Asegúrate de tener uno.
    goto end
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Falló npm install
    goto end
)

echo.
echo ✅ ¡Todo se ha instalado correctamente!

:end
echo.
echo 🧯 Proceso finalizado. Revisa arriba si hubo errores.
pause
endlocal
