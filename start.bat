@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
echo Iniciando MyCommunity (bot + API + dashboard novo)...
echo API: http://127.0.0.1:8000
echo Dashboard NOVO: http://127.0.0.1:3000
echo Dashboard legado: http://127.0.0.1:5000
echo.

REM inicia bot + FastAPI + Flask em janela separada
start "MyCommunity Bot" venv\Scripts\python.exe main.py

REM aguarda API subir
timeout /t 4 >nul

REM inicia Next.js em janela separada
start "MyCommunity Web" cmd /c "cd web && set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 && npm run dev"

REM aguarda web subir e abre navegador no site certo
timeout /t 6 >nul
start "" http://127.0.0.1:3000
echo Tudo iniciado! Deixe as duas janelas abertas.
pause
