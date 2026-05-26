param(
  [Parameter(Mandatory=$true)]
  [string]$Slug,

  [Parameter(Mandatory=$true)]
  [string]$Title,

  [string]$Category = "cultura"
)

$articleDir = "content\articles\$Slug"
$mediaDir = "public\media\articles\$Slug"
$articleFile = "$articleDir\index.md"

if (Test-Path $articleFile) {
  Write-Error "Ya existe un artículo con este slug: $Slug"
  exit 1
}

New-Item -ItemType Directory -Force $articleDir | Out-Null
New-Item -ItemType Directory -Force $mediaDir | Out-Null

$today = Get-Date -Format "yyyy-MM-dd"

$content = @"
---
title: "$Title"
excerpt: "Resumen breve del artículo para portada, listado y SEO."
category: "$Category"
publishedAt: "$today"
coverImage: "/media/articles/$Slug/cover.webp"
coverAlt: "Imagen principal de $Title"
status: "draft"
---

Escribe aquí el primer párrafo del artículo.

## Subtítulo

Continúa aquí el texto.

Puedes añadir enlaces así:

[Texto del enlace](https://ejemplo.com)

Puedes añadir imágenes internas así:

![Descripción de la imagen](/media/articles/$Slug/imagen-1.webp)
"@

Set-Content $articleFile $content -Encoding UTF8

Write-Host "Artículo creado:"
Write-Host $articleFile
Write-Host ""
Write-Host "Carpeta de imágenes:"
Write-Host $mediaDir
Write-Host ""
Write-Host "Para publicarlo, cambia status: draft por status: published"
