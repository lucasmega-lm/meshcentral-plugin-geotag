# Changelog - GeoTag Plugin for MeshCentral

## [1.0.1] - 2025-05-12
### Adicionado
- Suporte ao interceptador de console (`AddConsoleInterceptor`)
- Permite que agentes executem scripts (ex: PowerShell) que imprimam:
  - Pais
  - Estado (sigla)
  - Cidade
  - Provedor
- O plugin interpreta essas saídas e aplica as tags automaticamente
- Substitui o modelo anterior baseado em geolocalização feita no servidor

## [1.0.0] - 2025-05-10
### Inicial
- Plugin para aplicar tags de geolocalização baseado no IP público do agente
- Consulta à API `ip-api.com` era feita no lado do servidor
- Aplica tags de País, Estado, Cidade e Provedor
