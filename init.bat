@echo off
setlocal

REM URL oficial del instalador de Node.js
set "NODE_URL=https://nodejs.org/dist/v22.15.0/node-v22.15.0-x64.msi"
set "INSTALLER=node-v22.15.0-x64.msi"

echo =============================
echo Verificando instalador...
echo =============================

REM Descargar el instalador si no existe
if not exist "%~dp0%INSTALLER%" (
    echo Descargando instalador de Node.js desde %NODE_URL% ...
    powershell -Command "Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%~dp0%INSTALLER%'"
)

REM Verificar que el archivo fue descargado
if not exist "%~dp0%INSTALLER%" (
    echo ERROR: Fallo la descarga del instalador.
    pause
    exit /b 1
)

REM Verificar si Node.js ya está instalado
where node >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Node.js ya está instalado. Saltando instalación...
) else (
    echo =============================
    echo Ejecutando instalador de Node.js...
    echo =============================
    start /wait msiexec /i "%~dp0%INSTALLER%"
    echo Presiona una tecla cuando la instalación haya terminado...
    pause
)

REM Agregar temporalmente Node.js al PATH
set "NODE_PATH=%ProgramFiles%\nodejs"
set "PATH=%NODE_PATH%;%PATH%"

echo =============================
echo Verificando node y npm...
echo =============================
where node
where npm
node -v
npm -v

echo =============================
echo Ejecutando: npx playwright install
echo =============================
npx playwright install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo la instalación de Playwright.
    pause
    exit /b 1
)

echo =============================
echo Ejecutando: npm install
echo =============================
npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Fallo la instalación de dependencias npm.
    pause
    exit /b 1
)

echo =============================
echo Proceso completado con éxito.
echo =============================
pause
endlocal
