# Build helper that executes the build for the Repairs client app
$scriptPath = Split-Path $MyInvocation.InvocationName
$psakePath = Join-Path -Resolve $scriptPath ..\..\..\Automation\psake\psake.ps1
$buildScript = Join-Path -Resolve $scriptPath ..\build.ps1

# Invoke the default task for the "ManualTests" application
&$psakePath $buildScript -properties @{ApplicationDirectory="Repairs"; Replease=$false}
if ($psake.build_success -eq $false) { exit 1 }