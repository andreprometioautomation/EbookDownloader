; Script de Inno Setup para instalar Node.js y ejecutar comandos npm
; Guardar como install_script.iss

[Setup]
AppName=Instalador Node.js + Playwright
AppVersion=1.0
DefaultDirName={pf}\NodeAutoSetup
DisableDirPage=yes
DisableProgramGroupPage=yes
OutputBaseFilename=InstaladorNodeSetup
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Files]
; Copia el instalador MSI incluido
Source: "node-v20.11.1-x64.msi"; DestDir: "{tmp}"; Flags: ignoreversion

[Run]
; Verifica si Node.js está instalado antes de instalar
Filename: "cmd.exe"; Parameters: "/C where node > nul || msiexec /i ""{tmp}\node-v20.11.1-x64.msi"" /passive /norestart"; Flags: runhidden

; Espera a que Node esté listo antes de seguir
Filename: "cmd.exe"; Parameters: "/C timeout /t 5"; Flags: runhidden

; Ejecuta `npx playwright install`
Filename: "cmd.exe"; Parameters: "/C npx playwright install"; WorkingDir: "{app}"; Flags: runhidden

; Ejecuta `npm install`
Filename: "cmd.exe"; Parameters: "/C npm install"; WorkingDir: "{app}"; Flags: runhidden

[Code]
// Mostrar mensaje final después de todo
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
    MsgBox('Instalación completada. Playwright y dependencias instaladas.', mbInformation, MB_OK);
end;
