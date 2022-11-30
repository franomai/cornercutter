Add-Type -AssemblyName PresentationFramework
$GOING_UNDER_INSTALL_DIR_REGISTRY_PATH = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 1154810'
$partialDeleteString = "The cornercutter.dll and cornercutter.pdb can be safely removed from the BepInEx folder manually."
$fullDeleteString = "The BepInEx and cornercutter folders can be safely removed manually, as well as doorstop_config.ini and winhttp.dll."
$applicationName = "Cornercutter Uninstaller"

$manualCleanupString = $null
$fullDelete = [System.Windows.MessageBox]::Show("Sorry to see you go! We hope you had fun cutting corners. " `
+ "Would you like to do a full cleanup? This will remove ALL mod loaders and cornercutter saved mods, " `
+ "otherwise we will just remove the part that hooks cornercutter into the base game.", $applicationName, "YesNo")
switch  ($fullDelete) {
    'Yes' {
        $manualCleanupString = $fullDeleteString
    }
    'No' {
        $manualCleanupString = $partialDeleteString
    }
}

$manualCleanupString += " Don't forget to turn the game off first!" 

$goingUnderInstallDir = (Get-ItemProperty -Path $GOING_UNDER_INSTALL_DIR_REGISTRY_PATH -Name "InstallLocation")."InstallLocation"
if ($null -eq $goingUnderInstallDir)
{
    $sinkOutput = [System.Windows.MessageBox]::Show("We couldn't find the Steam version of Going Under on this machine, so we don't know where to remove our files from. " + $manualCleanupString, $applicationName)
    throw "Uninstall has failed. Exiting..."
}

try
{
    switch  ($fullDelete) {
        'Yes' {
            Remove-Item -Force -Recurse -Verbose -ErrorAction Stop (Join-Path $goingUnderInstallDir "BepInEx")
            Remove-Item -Verbose -ErrorAction Stop (Join-Path $goingUnderInstallDir "doorstop_config.ini")
            Remove-Item -Verbose -ErrorAction Stop (Join-Path $goingUnderInstallDir "winhttp.dll")

            $ccDir = Join-Path $goingUnderInstallDir "cornercutter"
            $appData = Join-Path $env:APPDATA "cornercutter"

            if (Test-Path -Path $ccDir) {
                Remove-Item -Force -Recurse -Verbose -ErrorAction Stop $ccDir
            }

            if (Test-Path -Path $appData) {
                Remove-Item -Force -Recurse -Verbose -ErrorAction Stop $appData
            }
        }
        'No' {
            Remove-Item -Force -Verbose -ErrorAction Stop (Join-Path $goingUnderInstallDir "BepInEx\plugins\cornercutter.dll")
            Remove-Item -Force -Verbose -ErrorAction Stop (Join-Path $goingUnderInstallDir "BepInEx\plugins\cornercutter.pdb")
        }
    }
}
catch
{
    $sinkOutput = [System.Windows.MessageBox]::Show("There was a problem deleting the cornercutter files from your Going Under directory. " + $manualCleanupString, $applicationName)
    throw "Uninstall has failed. Exiting..."
}

$thankyou = "Uninstall complete. Thanks for playing <3"
$sinkOutput = [System.Windows.MessageBox]::Show($thankyou, $applicationName)
Write-Output $thankyou