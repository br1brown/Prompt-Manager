# Prompt-Manager - Docker Setup

## Quick Start

```bash
docker compose up --build
```

Apri il browser su **http://localhost:8006**

## Comandi Utili

```bash
# Avvia in background
docker compose up --build -d

# Ferma
docker compose down

# Logs in tempo reale
docker compose logs -f

# Accedi al container
docker compose exec prompt-manager bash

# Ricostruisci dopo cambio Dockerfile
docker compose up --build
```

## Development

Il `docker-compose.override.yml` viene applicato automaticamente e monta il codice in bind mount — le modifiche sono istantanee nel browser.
