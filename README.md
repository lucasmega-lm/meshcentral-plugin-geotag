# MeshCentral Plugin: GeoTag

Este plugin aplica automaticamente tags aos dispositivos conectados ao MeshCentral com base na **geolocalização do IP público**.

## 🚀 Funcionalidade

- Os agentes executam um script PowerShell via ScriptTask
- O script obtém dados de localização através de uma API pública
- O plugin intercepta a saída do console e aplica as seguintes tags:
  - `Pais: ...`
  - `Estado: ...` (sigla, ex: SP)
  - `Cidade: ...`
  - `Provedor: ...`

## 📄 Script PowerShell sugerido

Copie este conteúdo como `GeoTagAgent.ps1`:

```powershell
try {
    $geo = Invoke-RestMethod -Uri "http://ip-api.com/json"

    if ($geo.status -eq "success") {
        Write-Host "IP: $($geo.query)"
        Write-Host "Pais: $($geo.country)"
        Write-Host "Estado: $($geo.region)"
        Write-Host "Cidade: $($geo.city)"
        Write-Host "Provedor: $($geo.isp)"
    }
    else {
        Write-Host "Falha ao obter dados do IP"
    }
}
catch {
    Write-Host "Erro ao consultar IP externo: $_"
}
```

> ✅ Importante: Execute via MeshCentral > Scripts ou Console > Run Script

## 🔧 Requisitos

- MeshCentral >= 0.9.29
- Agente com acesso à Internet
- API pública utilizada: http://ip-api.com/json

## 📦 Instalação

No painel do MeshCentral, vá em:
```
My Server > Plugins > Install Plugin From URL
```

E cole o link:
```
https://github.com/lucasmega-lm/meshcentral-plugin-geotag/archive/refs/heads/main.zip
```

## 🧩 Autor
Infra Team  
https://github.com/lucasmega-lm/meshcentral-plugin-geotag
