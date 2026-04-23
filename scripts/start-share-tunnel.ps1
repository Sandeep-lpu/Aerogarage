param(
  [int]$BackendPort = 5000,
  [int]$PreviewPort = 4173
)

$ErrorActionPreference = "Stop"

function Stop-ByPort {
  param([int]$Port)
  $lines = netstat -ano | Select-String ":$Port\s+.*LISTENING"
  $pids = @()
  foreach ($line in $lines) {
    $parts = ($line -replace "\s+", " ").Trim().Split(" ")
    $pidText = $parts[-1]
    if ($pidText -match "^\d+$") {
      $pids += [int]$pidText
    }
  }
  $pids = $pids | Select-Object -Unique
  foreach ($procId in $pids) {
    try { Stop-Process -Id $procId -Force } catch {}
  }
}

function Wait-HttpOk {
  param(
    [string]$Url,
    [int]$Tries = 30,
    [int]$SleepMs = 700
  )
  for ($i = 0; $i -lt $Tries; $i++) {
    try {
      $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      if ($r.StatusCode -eq 200) { return $true }
    } catch {}
    Start-Sleep -Milliseconds $SleepMs
  }
  return $false
}

function Start-LocalTunnel {
  param(
    [int]$Port,
    [string]$OutLog,
    [string]$ErrLog
  )
  try { if (Test-Path $OutLog) { Remove-Item $OutLog -Force } } catch {}
  try { if (Test-Path $ErrLog) { Remove-Item $ErrLog -Force } } catch {}
  Start-Process cmd.exe -ArgumentList "/c", "npx --yes localtunnel --port $Port" -RedirectStandardOutput $OutLog -RedirectStandardError $ErrLog | Out-Null

  for ($i = 0; $i -lt 80; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-Path $OutLog) {
      $txt = Get-Content $OutLog -Raw -ErrorAction SilentlyContinue
      if ($txt -match "your url is:\s*(https://[^\s]+)") {
        return $matches[1]
      }
    }
  }
  throw "Failed to create tunnel for port $Port"
}

$root = Split-Path -Parent $PSScriptRoot
$serverDir = Join-Path $root "server"
$frontendDir = Join-Path $root "aerogarage"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backendOut = Join-Path $root "tmp-backend-tunnel-$stamp.out.log"
$backendErr = Join-Path $root "tmp-backend-tunnel-$stamp.err.log"
$frontendOut = Join-Path $root "tmp-frontend-tunnel-$stamp.out.log"
$frontendErr = Join-Path $root "tmp-frontend-tunnel-$stamp.err.log"

Write-Host "Cleaning existing listeners on ports $BackendPort and $PreviewPort..."
Stop-ByPort -Port $BackendPort
Stop-ByPort -Port $PreviewPort

Write-Host "Starting backend..."
Start-Process cmd.exe -ArgumentList "/c", "node server.js" -WorkingDirectory $serverDir | Out-Null
if (-not (Wait-HttpOk -Url "http://localhost:$BackendPort/api/health")) {
  throw "Backend did not become healthy on port $BackendPort"
}

Write-Host "Creating backend tunnel..."
$backendUrl = Start-LocalTunnel -Port $BackendPort -OutLog $backendOut -ErrLog $backendErr

Write-Host "Updating frontend API URL..."
$frontendEnv = Join-Path $frontendDir ".env"
Set-Content -Path $frontendEnv -Value "VITE_API_BASE_URL=$backendUrl/api"

Write-Host "Building frontend..."
Push-Location $frontendDir
cmd.exe /c "npm run build" | Out-Null
Pop-Location

Write-Host "Starting frontend preview..."
Start-Process cmd.exe -ArgumentList "/c", "npm run preview -- --host 0.0.0.0 --port $PreviewPort --strictPort" -WorkingDirectory $frontendDir | Out-Null
if (-not (Wait-HttpOk -Url "http://localhost:$PreviewPort")) {
  throw "Frontend preview did not start on port $PreviewPort"
}

Write-Host "Creating frontend tunnel..."
$frontendUrl = Start-LocalTunnel -Port $PreviewPort -OutLog $frontendOut -ErrLog $frontendErr

$tunnelPassword = ""
try {
  $tunnelPassword = (Invoke-WebRequest -Uri "https://loca.lt/mytunnelpassword" -UseBasicParsing -TimeoutSec 15).Content
} catch {}

Write-Host ""
Write-Host "Share URL: $frontendUrl"
Write-Host "API URL:   $backendUrl/api"
if ($tunnelPassword) {
  Write-Host "Tunnel password: $tunnelPassword"
}
