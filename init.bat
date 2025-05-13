@echo off
setlocal

REM Nombre del instalador
set "INSTALLER=node-v20.11.1-x64.msi"

echo =============================
echo Verificando instalador...
echo =============================

if not exist "%~dp0%INSTALLER%" (
    echo ERROR: El instalador %INSTALLER% no existe en esta carpeta.
    pause
    exit /b
)

REM Verificar si Node.js ya está instalado
where node >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Node.js ya está instalado. Saltando instalación...
) else (
    echo =============================
    echo Ejecutando instalador de Node.js
    echo =============================

    REM Instala Node.js con interfaz gráfica visible
    start /wait msiexec /i "%~dp0%INSTALLER%"

    echo Presiona una tecla cuando la instalación haya terminado...
    pause
)

REM Refrescar PATH por si fue recién instalado
set "NODE_PATH=%ProgramFiles%\nodejs"
set "PATH=%NODE_PATH%;%PATH%"

echo =============================
echo Verificando node y npm
echo =============================
where node
where npm

node -v
npm -v

echo =============================
echo Ejecutando npx playwright install
echo =============================
npx playwright install

echo =============================
echo Ejecutando npm install
echo =============================
npm install

echo =============================
echo Proceso terminado con éxito.
echo =============================
pause
endlocal
