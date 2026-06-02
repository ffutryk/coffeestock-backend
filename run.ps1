$ErrorActionPreference = "Stop"

Write-Host "Setting up..."

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ".env created from .env.example"
}
else {
    Write-Host ".env already exists"
}

foreach ($line in Get-Content ".env") {
    if ($line -match '^([^#=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable(
            $matches[1].Trim(),
            $matches[2].Trim(),
            "Process"
        )
    }
}

$BackendUrl = "http://localhost:$env:BACKEND_PORT"
$FrontendUrl = "http://localhost:$env:FRONTEND_PORT"

Write-Host ""
Write-Host "Installing dependencies..."

npm --prefix .\server install
npm --prefix .\client install

Write-Host ""
Write-Host "Starting services..."

$BackendJob = Start-Job {
    Set-Location "$using:PWD\server"
    npm run dev 2>&1 | ForEach-Object { "[backend] $_" }
}

$FrontendJob = Start-Job {
    Set-Location "$using:PWD\client"
    npm run dev 2>&1 | ForEach-Object { "[frontend] $_" }
}

Write-Host ""
Write-Host "Environment is running" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  $BackendUrl"
Write-Host "Frontend: $FrontendUrl"
Write-Host ""
Write-Host "Watching logs..."
Write-Host "Press Ctrl+C to stop everything"

try {
    while ($true) {
        Receive-Job $BackendJob
        Receive-Job $FrontendJob

        if ($BackendJob.State -eq "Failed") { throw "Backend crashed." }
        if ($FrontendJob.State -eq "Failed") { throw "Frontend crashed." }

        Start-Sleep -Milliseconds 200
    }
} finally {
    Write-Host "`nStopping services..."

    Stop-Job $BackendJob,$FrontendJob -EA SilentlyContinue
    Remove-Job $BackendJob,$FrontendJob -Force -EA SilentlyContinue

    Write-Host "Services stopped. " -ForegroundColor DarkGray
}
