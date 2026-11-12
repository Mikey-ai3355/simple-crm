# Simple CRM — Option 3 (Module 3)

Full-stack customer relationship manager:

| Piece | Stack | Deploys to |
|---|---|---|
| **API** (`api/`) | Spring Boot 4.1.1 · Java 21 · JWT auth · JPA/Hibernate | Render (Docker image `mikeyapyc/simple-crm-api`) |
| **Frontend** (`fe/`) | Next.js 15.5.26 (App Router, server-rendered) | Render (Docker image `mikeyapyc/simple-crm-fe`) |
| **Database** | PostgreSQL | Render PostgreSQL (free tier) |

This is the Option 3 build: a real Spring Boot CRM API (JWT login, customer
CRUD, interactions, stats) paired with the `crm-next` React frontend, adapted
to the API's actual fields and `/auth/login` flow, with all data fetches done
server-side.

> **Status:** the whole stack was verified end-to-end against a real
> PostgreSQL 16 instance (login, CRUD, interactions, stats, and the Next.js
> standalone server rendering live data) before packaging.  See
> [`DEPLOY.md`](DEPLOY.md) for the paste-ready Render + Docker-Hub steps.

## Layout

```
api/   Spring Boot service.  Dockerfile builds a multi-stage image.
fe/    Next.js app.  Server components + server actions fetch the API with
       the access_token cookie; no client-side auth.
DEPLOY.md   Render PostgreSQL + two Render web services + Docker build/push,
            all as copy-paste WSL commands.
```

## Run locally (dev)

```bash
# 1. Postgres (any local instance)
createdb simple_crm

# 2. API (port 8080)
cd api
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/simple_crm \
SPRING_DATASOURCE_USERNAME=postgres \
JWT_SECRET=dev-secret-long-string \
./mvnw spring-boot:run

# 3. Frontend (port 3000)
cd ../fe
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

Sign in with the seeded demo accounts: `admin / admin123`,
`manager / manager123`, or `user / user123`.

## API surface (summary)

- `POST /auth/login` → `{ token }` (401 on bad creds)
- `GET  /health` → `{"status":"ok"}` (public, used by Render health checks)
- `GET    /customers` · `?firstName=` exact-match search
- `GET    /customers/{id}`
- `POST   /customers`
- `PUT    /customers/{id}`
- `DELETE /customers/{id}`
- `GET    /customers/stats` → `{ totalCustomers, totalInteractions, customersWithInteractions }`
- `GET    /customers/{id}/interactions`
- `POST   /customers/{id}/interactions`

All `/customers/**` require `Authorization: Bearer ***

## Live deployment (Option 3)

Built and deployed on Render from Docker Hub images (`mikeyapyc/simple-crm-api`,
`mikeyapyc/simple-crm-fe`) with a Render Postgres database:

- **Frontend:** https://simple-crm-fe.onrender.com
- **API:** https://simple-crm-api-tquo.onrender.com/health
- **Postgres:** Render Postgres instance `dpg-dbq3t5h5efls739jmsj0-a` (database `simple_crm_db_86l3`)
- **API images:** https://hub.docker.com/r/mikeyapyc/simple-crm-api
- **FE images:** https://hub.docker.com/r/mikeyapyc/simple-crm-fe

Sign in with the seeded accounts: `admin / admin123`, `manager / manager123`, or `user / user123`.
