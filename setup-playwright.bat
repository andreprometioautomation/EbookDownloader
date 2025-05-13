@echo off
setlocal

echo =============================
echo Verificando si Node.js está instalado...
echo =============================

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js no está instalado. Por favor instala Node.js antes de continuar.
    pause
    exit /b 1
)

echo =============================
echo Node.js encontrado. Verificando versiones...
echo =============================

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
