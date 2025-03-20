@echo off
REM Batch wrapper for PowerShell script

if "%~1"=="" (
  echo Usage: dev-env.bat [start^|stop^|status^|restart^|logs]
  echo.
  echo Commands:
  echo   start   - Start the development environment
  echo   stop    - Stop the development environment
  echo   status  - Show the status of all services
  echo   restart - Restart the development environment
  echo   logs    - Show logs from all services (Ctrl+C to exit)
  echo.
  exit /b 1
)

powershell -ExecutionPolicy Bypass -File "%~dp0\dev-env.ps1" %*
set POWERSHELL_EXIT_CODE=%ERRORLEVEL%

if %POWERSHELL_EXIT_CODE% neq 0 (
  echo Process completed with errors. Exit code: %POWERSHELL_EXIT_CODE%
  exit /b %POWERSHELL_EXIT_CODE%
)

exit /b 0 