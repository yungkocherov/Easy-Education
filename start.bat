@echo off
chcp 65001 > nul
title Easy Education
cd /d "%~dp0"

echo ============================================
echo   Easy Education - DS / ML / DL
echo ============================================
echo.
echo Запускаю локальный сервер на порту 8000...
echo.
echo Адрес: http://localhost:8000
echo.
echo Закройте это окно, чтобы остановить сервер.
echo ============================================
echo.

start "" http://localhost:8000
python -m http.server 8000
