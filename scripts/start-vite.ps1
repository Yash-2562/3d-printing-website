$connections = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

foreach ($connection in $connections) {
  $processId = $connection.OwningProcess
  if ($processId -and $processId -ne $PID) {
    taskkill.exe /PID $processId /T /F 2>$null | Out-Null
  }
}

& "$PSScriptRoot\..\node_modules\.bin\vite.cmd" --host localhost
exit $LASTEXITCODE
