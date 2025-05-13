@echo off
setlocal enabledelayedexpansion

REM Nombre exacto del instalador (cámbialo si es diferente)
set "INSTALLER=node-v20.11.1-x64.msi"

echo ======================================
echo Verificando existencia del instalador...
echo ======================================
if not exist "%~dp0%INSTALLER%" (
    echo ERROR: Instalador %INSTALLER% no encontrado en la carpeta actual.
    pause
    exit /b
)

REM Verificar si node ya está instalado
echo ======================================
echo Verificando si Node.js ya está instalado...
echo ======================================
where node >nul 2>&1
if !errorlevel! == 0 (
    echo Node.js ya está instalado. Saltando instalación.
) else (
    echo Instalando Node.js...
    msiexec /i "%~dp0%INSTALLER%" /quiet /norestart
    echo Esperando 15 segundos para completar instalación...
    timeout /t 15 /nobreak >nul
)

REM Refrescar PATH en caso de instalación nueva
set "NODE_PATH=%ProgramFiles%\nodejs"
set "PATH=%NODE_PATH%;%PATH%"

echo ======================================
echo Verificando Node.js y npm
echo ======================================
node -v
if !errorlevel! neq 0 (
    echo ERROR: Node.js no se instaló correctamente o no está en PATH.
    pause
    exit /b
)
npm -v

REM Comando 1: Instalar Playwright
echo ======================================
echo Ejecutando: npx playwright install
echo ======================================
npx playwright install
if !errorlevel! neq 0 (
    echo ERROR al ejecutar 'npx playwright install'
    pause
    exit /b
)

REM Comando 2: Instalar dependencias npm
echo ======================================
echo Ejecutando: npm install
echo ======================================
npm install
if !errorlevel! neq 0 (
    echo ERROR al ejecutar 'npm install'
    pause
    exit /b
)

echo ======================================
echo Instalación completada correctamente.
echo ======================================
pause
endlocal
