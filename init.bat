@echo off
setlocal enabledelayedexpansion

REM ===== Configura el nombre del instalador .msi =====
set "INSTALLER=node-v20.11.1-x64.msi"

REM ===== Verifica si el instalador existe =====
echo.
echo 🔍 Verificando existencia del instalador...
if not exist "%~dp0%INSTALLER%" (
    echo ❌ ERROR: El archivo %INSTALLER% no está en esta carpeta.
    pause
    exit /b
)

REM ===== Verifica si Node.js está instalado =====
where node >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ✅ Node.js ya está instalado.
) else (
    echo 🚀 Instalando Node.js...

    REM Ejecuta el instalador visiblemente y espera que termine
    start /wait msiexec /i "%~dp0%INSTALLER%"

    echo ✅ Instalación completada (o cerrada manualmente).
    echo ⏳ Esperando a que el sistema actualice el PATH...
    timeout /t 10 >nul
)

REM ===== Refrescar PATH (usualmente no inmediato tras instalación) =====
set "NODE_PATH=%ProgramFiles%\nodejs"
set "PATH=%NODE_PATH%;%PATH%"

echo.
echo 🧪 Verificando instalación de node y npm...
where node
node -v
where npm
npm -v

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js o npm no están disponibles. Reinicia la terminal o tu PC.
    pause
    exit /b
)

REM ===== Ejecutar npx playwright install =====
echo.
echo 📦 Instalando Playwright con 'npx playwright install'...
call npx playwright install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Falló la instalación de Playwright.
    pause
    exit /b
)

REM ===== Ejecutar npm install (dependencias del proyecto) =====
echo.
echo 📂 Ejecutando 'npm install' para instalar dependencias del proyecto...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Falló 'npm install'. Revisa tu package.json.
    pause
    exit /b
)

echo.
echo ✅ Todo completado correctamente.
pause
endlocal
