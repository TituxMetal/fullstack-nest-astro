# Infrastructure and Deployment

## Infrastructure as Code

- **Tool:** Docker Compose (via Portainer UI)
- **Location:** `docker/compose.yaml` (for copy/paste to Portainer)
- **Approach:** Container orchestration through Portainer web interface

## Deployment Strategy

- **Strategy:** Portainer-managed container deployment
- **Target Platform:** Self-hosted Debian 12 server with existing infrastructure
- **Pipeline Configuration:** Manual deployment via Portainer UI

**Actual Deployment Flow:**

1. **Build Images**: Local Docker builds
2. **Portainer**: Copy/paste `docker/compose.yaml` into Portainer interface
3. **Deploy**: Portainer manages container lifecycle
4. **Proxy**: NginxProxyManager handles SSL termination and routing

## Current Working Configuration (Maintain As-Is)

```yaml
# docker/compose.yaml - Production deployment configuration
version: '3.8'

services:
  fullstack-nest-backend:
    image: lgdweb/fullstack-nest-backend:prod
    container_name: fullstack-nest-backend
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      SESSION_TTL: ${SESSION_TTL}
      RUN_MIGRATIONS: 'true'
    volumes:
      - data:/data
      - /etc/localtime:/etc/localtime:ro
      - /etc/timezone:/etc/timezone:ro
    networks:
      - reverse-proxy-nw
      - default-nw
    restart: unless-stopped

  fullstack-astro-frontend:
    image: lgdweb/fullstack-astro-frontend:prod
    container_name: fullstack-astro-frontend
    environment:
      API_URL: ${API_URL}
      PUBLIC_API_URL: ${PUBLIC_API_URL}
    ports:
      - 4321:4321
    networks:
      - reverse-proxy-nw
      - default-nw
    restart: unless-stopped
    depends_on:
      - fullstack-nest-backend

volumes:
  data:

networks:
  default-nw:
    external: true
  reverse-proxy-nw:
    external: true
```

**Epic Impact: MINIMAL Changes Only**

- **Epic 1**: Update Dockerfiles to use `apps/` paths, compose.yaml unchanged
- **Epic 2-4**: No infrastructure changes, same container behavior

**Existing Server Infrastructure:**

- ✅ **Debian 12 Server**: Already configured
- ✅ **Portainer**: Already installed for container management
- ✅ **NginxProxyManager**: Already handling SSL/reverse proxy
- ✅ **Docker**: Already installed and configured
