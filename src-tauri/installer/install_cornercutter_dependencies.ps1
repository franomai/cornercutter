Add-Type -AssemblyName PresentationFramework
function Show-ErrorAndExitInstaller {
    param (
        $errorMessage
    )
    $sinkOutput = [System.Windows.MessageBox]::Show("$errorMessage The cornercutter app might be able to sort it.", "Cornercutter Installer")
    throw "Installation has failed. Exiting..."
}

$GOING_UNDER_INSTALL_DIR_REGISTRY_PATH = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 1154810'
$goingUnderInstallDir = (Get-ItemProperty -Path $GOING_UNDER_INSTALL_DIR_REGISTRY_PATH -Name "InstallLocation")."InstallLocation"
if ($null -eq $goingUnderInstallDir)
{
    Show-ErrorAndExitInstaller "Looks like the Steam version of Going Under is not installed on this machine."
}

$cornerCutterInstallDir = split-path -parent $MyInvocation.MyCommand.Definition
$builtModFolder = Join-Path $cornerCutterInstallDir "..\built-mod\*"

try
{
    Copy-Item -Force -Recurse -Verbose $builtModFolder -Destination $goingUnderInstallDir -ErrorAction Stop
}
catch
{
    Show-ErrorAndExitInstaller "Looks like we had trouble copying our files to your Going Under install directory."
}

Write-Output "Installation complete. Get ready to cut some corners!"