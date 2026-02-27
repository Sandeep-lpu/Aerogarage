param(
  [int]$BackendPort = 5000,
  [int]$PreviewPort = 4173
)

$ErrorActionPreference = "Stop"

$cloudflaredExe = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
if (-not (Test-Path $cloudflaredExe)) {
  throw "cloudflared.exe not found at: $cloudflaredExe"
}

function Stop-ByPort {
  param([int]$Port)
  $lines = netstat -ano | Select-String ":$Port\s+.*LISTENING"
  foreach ($line in $lines) {
    $parts = ($line -replace "\s+", " ").Trim().Split(" ")
    $pidText = $parts[-1]
    if ($pidText -match "^\d+$") {
      try { Stop-Process -Id ([int]$pidText) -Force } catch {}
    }
  }
}

function Wait-HttpOk {
  param([string]$Url)
  for ($i = 0; $i -lt 35; $i++) {
    try {
      $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      if ($r.StatusCode -eq 200) { return $true }
    } catch {}
    Start-Sleep -Milliseconds 700
  }
  return $false
}

function Start-CfTunnel {
  param(
    [int]$Port,
    [string]$OutLog,
    [string]$ErrLog
  )
  try { if (Test-Path $OutLog) { Remove-Item $OutLog -Force } } catch {}
  try { if (Test-Path $ErrLog) { Remove-Item $ErrLog -Force } } catch {}

  Start-Process $cloudflaredExe -ArgumentList "tunnel --url http://localhost:$Port --no-autoupdate" -RedirectStandardOutput $OutLog -RedirectStandardError $ErrLog | Out-Null

  for ($i = 0; $i -lt 80; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-Path $OutLog) {
      $txt = Get-Content $OutLog -Raw -ErrorAction SilentlyContinue
      if ($txt -match "https://[-a-z0-9]+\.trycloudflare\.com") {
        return $matches[0]
      }
    }
    if (Test-Path $ErrLog) {
      $txtErr = Get-Content $ErrLog -Raw -ErrorAction SilentlyContinue
      if ($txtErr -match "https://[-a-z0-9]+\.trycloudflare\.com") {
        return $matches[0]
      }
    }
  }

  throw "Failed to start Cloudflare tunnel for port $Port"
}

$root = Split-Path -Parent $PSScriptRoot
$serverDir = Join-Path $root "server"
$frontendDir = Join-Path $root "aerogarage"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"

$backendOut = Join-Path $root "tmp-cf-backend-$stamp.out.log"
$backendErr = Join-Path $root "tmp-cf-backend-$stamp.err.log"
$frontendOut = Join-Path $root "tmp-cf-frontend-$stamp.out.log"
$frontendErr = Join-Path $root "tmp-cf-frontend-$stamp.err.log"

Write-Host "Cleaning listeners on ports $BackendPort and $PreviewPort..."
Stop-ByPort -Port $BackendPort
Stop-ByPort -Port $PreviewPort

Write-Host "Starting backend..."
Start-Process cmd.exe -ArgumentList "/c", "node server.js" -WorkingDirectory $serverDir | Out-Null
if (-not (Wait-HttpOk -Url "http://localhost:$BackendPort/api/health")) {
  throw "Backend did not become healthy"
}

Write-Host "Starting backend Cloudflare tunnel..."
$backendUrl = Start-CfTunnel -Port $BackendPort -OutLog $backendOut -ErrLog $backendErr

Write-Host "Updating frontend env for production preview..."
Set-Content -Path (Join-Path $frontendDir ".env.production") -Value "VITE_API_BASE_URL=$backendUrl/api"

Write-Host "Building frontend..."
Push-Location $frontendDir
cmd.exe /c "npm run build" | Out-Null
Pop-Location

Write-Host "Starting frontend preview..."
Start-Process cmd.exe -ArgumentList "/c", "npm run preview -- --host 0.0.0.0 --port $PreviewPort --strictPort" -WorkingDirectory $frontendDir | Out-Null
if (-not (Wait-HttpOk -Url "http://localhost:$PreviewPort")) {
  throw "Frontend preview did not become healthy"
}

Write-Host "Starting frontend Cloudflare tunnel..."
$frontendUrl = Start-CfTunnel -Port $PreviewPort -OutLog $frontendOut -ErrLog $frontendErr

Write-Host ""
Write-Host "Website URL: $frontendUrl"
Write-Host "API URL: $backendUrl/api"
Write-Host "No tunnel password required."
