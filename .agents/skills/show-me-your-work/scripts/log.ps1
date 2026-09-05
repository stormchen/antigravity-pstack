<#
.SYNOPSIS
  向 show-me-your-work 決策日誌 (TSV) 追加記錄 (PowerShell 版)
.EXAMPLE
  pwsh scripts/log.ps1 decisions.tsv phase decision why evidence result
#>
param(
  [Parameter(Mandatory=$true, Position=0)][string]$LogFile,
  [Parameter(Mandatory=$true, Position=1)][string]$Phase,
  [Parameter(Mandatory=$true, Position=2)][string]$Decision,
  [Parameter(Mandatory=$true, Position=3)][string]$Why,
  [Parameter(Mandatory=$true, Position=4)][string]$Evidence,
  [Parameter(Mandatory=$true, Position=5)][string]$Result
)

$ErrorActionPreference = "Stop"

$logDir = Split-Path -Parent $LogFile
if ($logDir -and -not (Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

if (-not (Test-Path $LogFile)) {
  "ts`tphase`tdecision`twhy`tevidence`tresult" | Set-Content -Path $LogFile -Encoding utf8
}

$ts = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

function Clean-Cell([string]$val) {
  if (-not $val) { return "" }
  $cleaned = $val -replace "[\t\r\n]", "   "
  if ($cleaned -match "^[=+\-@]") {
    return "'$cleaned"
  }
  return $cleaned
}

$row = "$ts`t$((Clean-Cell $Phase))`t$((Clean-Cell $Decision))`t$((Clean-Cell $Why))`t$((Clean-Cell $Evidence))`t$((Clean-Cell $Result))"
Add-Content -Path $LogFile -Value $row -Encoding utf8
