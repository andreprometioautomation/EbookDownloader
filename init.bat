@echo off
setlocal

REM Nombre del instalador de Node.js (.msi)
set INSTALLER=node-v20.11.1-x64.msi

REM Verifica si Node ya está instalado
where node >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Node.js ya está instalado. Saltando instalación...
) else (
    echo Instalando Node.js...
    msiexec /i "%~dp0%INSTALLER%" /quiet /norestart

    echo Esperando a que la instalación termine...
    timeout /t 10 /nobreak >nul
)

REM Agrega temporalmente Node.js a PATH (por si no está disponible aún)
set "NODE_PATH=%ProgramFiles%\nodejs"
set "PATH=%NODE_PATH%;%PATH%"

REM Verifica instalación
echo Verificando versión de Node y NPM...
node -v
npm -v

REM Ejecuta los comandos requeridos
echo Ejecutando 'npx playwright install'...
npx playwright install

echo Ejecutando 'npm install'...
npm install

echo Todo listo.
pause
endlocal
