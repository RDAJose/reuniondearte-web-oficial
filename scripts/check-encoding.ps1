$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$excludedDirectories = @(
  "node_modules",
  ".next",
  "out",
  ".git"
)

$excludedFiles = @(
  "package-lock.json",
  "next-env.d.ts"
)

$sourceExtensions = @(
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".ps1",
  ".ts",
  ".tsx"
)

$brokenEncodingCharacters = @([char] 0x00C3, [char] 0x00C2, [char] 0xFFFD)
$brokenEncodingPattern = "[" + [regex]::Escape((-join $brokenEncodingCharacters)) + "]"
$findings = New-Object System.Collections.ArrayList

function Get-ProjectRelativePath {
  param([string] $FullName)

  if ($FullName.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $FullName.Substring($projectRoot.Length).TrimStart("\", "/")
  }

  return $FullName
}

Get-ChildItem -LiteralPath $projectRoot -Recurse -File |
  Where-Object {
    $relativePath = Get-ProjectRelativePath $_.FullName
    $pathParts = $relativePath -split "[\\/]"

    -not ($pathParts | Where-Object { $excludedDirectories -contains $_ }) -and
    -not ($excludedFiles -contains $_.Name) -and
    ($sourceExtensions -contains $_.Extension)
  } |
  ForEach-Object {
    $relativePath = Get-ProjectRelativePath $_.FullName
    $lineNumber = 0

    foreach ($line in [System.IO.File]::ReadLines($_.FullName)) {
      $lineNumber++

      if ($line -match $brokenEncodingPattern) {
        [void] $findings.Add("${relativePath}:${lineNumber}: $line")
      }
    }
  }

if ($findings.Count -gt 0) {
  Write-Host "Encoding check failed. Broken characters found: U+00C3, U+00C2, U+FFFD." -ForegroundColor Red
  $findings | ForEach-Object { Write-Host $_ }
  exit 1
}

Write-Host "OK: no broken encoding characters found in source files." -ForegroundColor Green
