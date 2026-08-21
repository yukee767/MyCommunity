@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
echo Iniciando MyCommunity (bot + API + dashboard)...
echo API: http://127.0.0.1:8000
echo Dashboard: http://127.0.0.1:3000
echo.

REM limpa cache do Next.js para evitar flash de versao antiga
if exist web\.next rmdir /s /q web\.next

REM builda frontend para garantir versao nova
echo Building web...
pushd web
call npm run build
popd
if errorlevel 1 echo Build falhou! & pause & exit /b

REM inicia bot + FastAPI em janela separada
start "MyCommunity Bot" venv\Scripts\python.exe main.py
timeout /t 3 >nul

REM inicia Next.js em modo producao (sem HMR flash)
start "MyCommunity Web" cmd /c "cd web && set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 && npm run start"
echo Aguardando web...

REM espera ate 3000 responder (evita abrir pagina antiga)
for /l %%i in (1,1,15) do (
  timeout /t 1 >nul
  powershell -Command "try{Invoke-WebRequest http://127.0.0.1:3000 -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0}catch{exit 1}"
  if not errorlevel 1 goto open
)
:open
start "" "http://127.0.0.1:3000?v=%RANDOM%"
echo Tudo iniciado! Dashboard em http://127.0.0.1:3000 (modo preto: botao Preto/Branco no topo)
echo Deixe as duas janelas abertas.
pause
