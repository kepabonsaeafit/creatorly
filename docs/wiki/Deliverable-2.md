# Class Diagram
![Class Diagram](assets/class-diagram-v2.png)

The four domain classes the backend persists, one TypeORM entity each. An Order always belongs to one Brand and one User (who coordinates it), and has at most one Creator until it is assigned.

# General Architecture Diagram
<img alt="General Architecture Diagram" src="assets/general-architecture-diagram.png" />

The browser loads the Vue SPA, which talks to the NestJS REST API (`/api`) with JSON and a JWT. Only the API touches the SQLite database.

# Frontend Architecture Diagram
<img alt="Frontend Architecture Diagram" src="assets/frontend-architecture-diagram.png" />

The router guards every page; views use the components and call the services, the only layer that makes HTTP requests. The session lives in the Pinia store, persisted through `StorageService`.

# Backend Architecture Diagram
<img alt="Backend Architecture Diagram" src="assets/backend-architecture-diagram.png" />

One NestJS module per domain class, plus `auth` and `home`. Every non-public route passes the global `AuthGuard` and `RolesGuard`, and each service reads and writes SQLite through TypeORM.
