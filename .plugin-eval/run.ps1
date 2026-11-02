param([switch]$Pilot)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
  node .plugin-eval/prepare.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Benchmark preparation failed' }
  $runtimeCli = $env:CODEX_APP_RUNTIME_CLI_PATH
  if (-not $runtimeCli -or -not (Test-Path -LiteralPath $runtimeCli)) {
    throw 'Desktop runtime CLI is unavailable. Set CODEX_APP_RUNTIME_CLI_PATH to a verified working CLI executable.'
  }
  $runName = if ($Pilot) { 'pilot' } else { 'suite' }
  if ($Pilot) { node .plugin-eval/run.mjs --pilot } else { node .plugin-eval/run.mjs }
  if ($LASTEXITCODE -ne 0) { throw 'Benchmark harness failed' }
  node .plugin-eval/inspect-run.mjs ".plugin-eval/$runName-result.json"
} finally {
  Pop-Location
}
