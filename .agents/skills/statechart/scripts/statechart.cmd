@echo off
where node >nul 2>nul
if %errorlevel% equ 0 (
  node --disable-warning=ExperimentalWarning "%~dp0statechart.ts" %*
  exit /b %errorlevel%
)
where bun >nul 2>nul
if %errorlevel% equ 0 (
  bun "%~dp0statechart.ts" %*
  exit /b %errorlevel%
)
where deno >nul 2>nul
if %errorlevel% equ 0 (
  deno run --quiet --no-prompt --allow-read --allow-write --allow-run --allow-env "%~dp0statechart.ts" %*
  exit /b %errorlevel%
)
echo statechart needs Node 22.18+, Bun 1.1.5+, or Deno 2.0+. >&2
exit /b 127
