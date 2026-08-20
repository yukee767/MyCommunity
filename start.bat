@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
echo Iniciando MyCommunity (bot + dashboard)...
echo Dashboard: http://127.0.0.1:5000
venv\Scripts\python.exe main.py
pause