@echo off
where bun >nul 2>nul
if %errorlevel% equ 0 (
  bun "%~dp0watch-pr" %*
) else (
  node --loader tsx/esm "%~dp0cli.ts" %* 2>nul || npx tsx "%~dp0cli.ts" %*
)
