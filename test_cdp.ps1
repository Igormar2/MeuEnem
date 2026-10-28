$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$port = 9255
$userDir = "$env:TEMP\edge_test_$port"

# Launch headless Edge
$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=$port",
    "--user-data-dir=$userDir",
    "http://127.0.0.1"
) -PassThru

Start-Sleep -Seconds 2

try {
    # Check CDP
    $tabs = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json" -TimeoutSec 5
    Write-Output "CDP Tabs available: $($tabs.Count)"
} catch {
    Write-Output "CDP Connect error: $_"
} finally {
    if ($proc -and -not $proc.HasExited) {
        Stop-Process -Id $proc.Id -Force
    }
    Start-Sleep -Milliseconds 500
    if (Test-Path $userDir) { Remove-Item -Path $userDir -Recurse -Force -ErrorAction SilentlyContinue }
}
