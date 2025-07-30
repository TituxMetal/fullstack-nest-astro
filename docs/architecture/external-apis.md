# External APIs

This project does **not require external API integrations** for the current scope and Epic
implementations. The system is designed as a complete, self-contained application with:

- Internal authentication system
- Local database storage
- Self-hosted deployment on Debian server
- No third-party service dependencies

The planned Clean Architecture + DDD structure will make adding external APIs straightforward in the
future through the Infrastructure Layer when needed.
