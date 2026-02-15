@echo off
setlocal

rem change to script directory
cd /d "%~dp0"

echo [INFO] hexo clean...
call npx hexo clean || goto fail

echo [INFO] hexo generate...
call npx hexo generate || goto fail

echo [INFO] hexo deploy...
call npx hexo deploy || goto fail

echo [OK] done.
pause
exit /b 0

:fail
echo [ERROR] failed, see messages above.
pause
exit /b 1
