param(
  [Parameter(Mandatory = $true)][string]$AdbPath,
  [string]$PackageName = 'com.vietauto.onthigiaypheplaixe.onthigplx600cau.gplxoto',
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\raw\source-apk')
)
$ErrorActionPreference = 'Stop'
if ($PackageName -notmatch '^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)+$') { throw 'Invalid package name' }
$adbExe = (Resolve-Path -LiteralPath $AdbPath).Path
$devices = @(& $adbExe devices | Where-Object { $_ -match '\sdevice$' })
if ($devices.Count -ne 1) { throw 'Connect exactly one authorized Android device.' }
$paths = @(& $adbExe shell pm path $PackageName)
if ($LASTEXITCODE -ne 0 -or $paths.Count -eq 0) { throw 'Cannot read package APK paths.' }
$destination = Join-Path ([IO.Path]::GetFullPath($OutputDirectory)) (Get-Date -Format 'yyyyMMdd-HHmmss')
New-Item -ItemType Directory -Path $destination -Force | Out-Null
foreach ($line in $paths) {
  $remote = $line.Trim() -replace '^package:', ''
  if ($remote -notmatch '^/data/app/.+\.apk$') { throw 'Unexpected APK path.' }
  $target = Join-Path $destination ([IO.Path]::GetFileName($remote))
  & $adbExe pull $remote ($target + '.partial')
  if ($LASTEXITCODE -ne 0) { throw 'APK transfer failed; reconnect and retry.' }
  Move-Item -LiteralPath ($target + '.partial') -Destination $target
}
Get-ChildItem -LiteralPath $destination | Select-Object Name,Length
Write-Output "Saved to $destination. APK files are excluded from Git."
