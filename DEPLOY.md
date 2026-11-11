# Option 3 — Simple CRM: deployment guide

Two Render services + one Render PostgreSQL instance.
Both apps deploy as **Docker Hub images** (your proven, working path — the
same one that made TaskFlow live).

---

## 1. Local E2E proof (already done on the rig, 2026-11-11)

Ran the full stack against a real PostgreSQL 16:

| Check | Result |
|---|---|
| `GET /health` (no auth) | 200 `{"status":"ok"}` |
| `POST /auth/login` (admin/admin123) | 200 `{token}` |
| `POST /auth/login` (bad pw) | 401 |
| `GET /customers` (Bearer) | 4 seed customers, correct fields |
| `GET /customers/1` | Tony Stark |
| `GET /customers/stats` | `{totalCustomers:4,totalInteractions:1,customersWithInteractions:1}` |
| `GET /customers/1/interactions` | 1 interaction (remarks + interactionDate) |
| `GET /customers?firstName=Tony` | `[Tony Stark]` (exact-match search) |
| `POST /customers` | created → id 5 |
| `PUT /customers/5` | jobTitle→"Director" persisted |
| `DELETE /customers/5` | 204 → re-GET 404 |
| **Next.js standalone server** | `/crm` dashboard (4/1/1) + `/crm/customers` (all 4) + detail + new-form — all rendered real API data server-side with the `access_token` cookie |

So the code is production-ready. Everything below is just pointing it at cloud
resources.

---

## 2. Repo

Single GitHub repo `Mikey-ai3355/simple-crm-option3` (created from this
bundle), default branch `main`, two top-level dirs:

```
simple-crm-option3/
├── api/        # Spring Boot 4.1.1 (Java 21) — Dockerfile at api/Dockerfile
├── fe/         # Next.js 15.5.26           — Dockerfile at fe/Dockerfile
└── README.md
```

Both Dockerfiles are multi-stage and push to `mikeyapyc`:

| Image | Tag | Service |
|---|---|---|
| `mikeyapyc/simple-crm-api` | `latest` | Render Web Service (API) |
| `mikeyapyc/simple-crm-fe` | `latest` | Render Web Service (frontend) |

---

## 3. Render — create the 3 resources (paste-ready WSL commands)

> All `wsl` commands assume the repo is already cloned into
> `/home/mikeynb/projects/simple-crm-option3` on the laptop WSL.

### 3a. PostgreSQL (free tier)
Render dashboard → **New → PostgreSQL**:
- Name: `simple-crm-pg`
- Plan: **Free** (2 GB, 100 GB I/O — plenty)
- Region: same as your Render web services (e.g. `Oregon`)
- Database: `simple_crm`, User: `crm` (Render generates a password)

Copy from **Settings → Database Credentials**:
- Host, Port (usually `5432`)
- Database name (`simple_crm`)
- Username (`crm`)
- Password (Render-generated)

Then in the **Network** tab, enable **Public** access (or add your two
web-service IPs) so Render can reach it.  Render gives you a single
`DATABASE_URL` you can paste straight in — prefer that:

```
postgresql://USER:PASSWORD@HOST:PORT/simple_crm?sslmode=require
```

### 3b. API — Web Service from existing image
Render dashboard → **New → Web Service → Existing Image**:
- Image: `mikeyapyc/simple-crm-api`
- Name: `simple-crm-api`
- Plan: **Free**
- Region: match your Postgres region
- **Health check path:** `/health`
- **Port:** leave blank (Render auto-assigns; app reads `$PORT`)

Environment variables (Settings → Environment):
| Key | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | Render's `DATABASE_URL` with a `jdbc:` prefix. Render gives `postgresql://USER:PW@HOST:PORT/simple_crm?sslmode=require` → set `SPRING_DATASOURCE_URL=jdbc:postgresql://USER:PW@HOST:PORT/simple_crm?sslmode=require` (keep the `?sslmode=require` — the Postgres JDBC driver reads it). |
| `SPRING_DATASOURCE_USERNAME` | (leave blank — it's already in the URL) |
| `SPRING_DATASOURCE_PASSWORD` | (leave blank — it's already in the URL) |
| `JWT_SECRET` | any long random string (64+ chars) |
| `JWT_EXPIRATION_MS` | `86400000` (24 h) |
| `PORT` | `8080` |

> If you'd rather split host/user/password out, set `SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:PORT/simple_crm` (no user/pw in URL) plus `SPRING_DATASOURCE_USERNAME=crm` and `SPRING_DATASOURCE_PASSWORD=<pw>` — either form works; the code reads all three.

Wait for the first deploy to go **Live** (~3–5 min on free tier — it pulls
the image, cold-boots).  Then `https://<your-api>.onrender.com/health`
should return `{"status":"ok"}`.

### 3c. Frontend — Web Service from existing image
Render dashboard → **New → Web Service → Existing Image**:
- Image: `mikeyapyc/simple-crm-fe`
- Name: `simple-crm-fe`
- Plan: **Free**
- **Health check path:** `/` (returns the landing page 200)
- **Port:** leave blank

Environment variables:
| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<your-api>.onrender.com` (the public API URL from 3b) |
| `PORT` | `3000` (or leave blank; Dockerfile defaults to 3000 and reads `$PORT`) |

> Because `lib/api.js` reads `process.env.NEXT_PUBLIC_API_URL` at **runtime**
> (server-side), a single env var on the FE service is enough — no rebuild
> needed when the API URL changes.

---

## 4. Build + push images (paste-ready WSL, one step at a time)

Run each block in WSL on the laptop, in `/home/mikeynb/projects/simple-crm-option3`.

> Prereqs: Docker Desktop **running** (click the whale icon, wait for
> "Docker Desktop is running"), `docker login` done once.

### 4a. Login to Docker Hub (once)
```bash
wsl -d Ubuntu -- bash -lc 'docker login'
# then type your Docker Hub username: mikeyapyc
# password: (your Docker Hub password)
```

### 4b. Build + tag + push the API
```bash
wsl -d Ubuntu -- bash -lc '
set -e
cd /home/mikeynb/projects/simple-crm-option3/api
docker build -t mikeyapyc/simple-crm-api:latest .
docker push mikeyapyc/simple-crm-api:latest
'
```
(Wait for "pushed: digest: sha256:…".)

### 4c. Build + tag + push the frontend
```bash
wsl -d Ubuntu -- bash -lc '
set -e
cd /home/mikeynb/projects/simple-crm-option3/fe
docker build -t mikeyapyc/simple-crm-fe:latest .
docker push mikeyapyc/simple-crm-fe:latest
'
```

### 4d. Verify both images are public
```bash
wsl -d Ubuntu -- bash -lc '
for i in mikeyapyc/simple-crm-api mikeyapyc/simple-crm-fe; do
  echo "== $i =="
  docker manifest inspect "$i:latest" >/dev/null 2>&1 \
    && echo "  reachable ✓" || echo "  NOT reachable ✗"
done
'
```

---

## 5. Smoke-test the live deploy

```bash
B=https://<your-api>.onrender.com   # paste your API host
FE=https://<your-fe>.onrender.com   # paste your FE host

echo "== API health =="; curl -sS -m 30 "$B/health"; echo

echo "== API login =="; curl -sS -m 30 -X POST "$B/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'; echo

echo "== FE landing =="; curl -sS -m 60 -o /dev/null -w "HTTP %{http_code}\n" "$FE/"
```

Open `https://<your-fe>.onrender.com/login`, sign in with
`admin / admin123`, and you should see the dashboard with 4 customers (or
0 if you deleted the seed data) — real data from the Render Postgres.

> **Cold start:** free tier sleeps after ~15 min idle; first request after a
> sleep takes ~30–60 s.  Subsequent requests are fast.

---

## 6. Seed data

`DataLoader.java` seeds 4 customers + 1 interaction **only when the customer
table is empty** (`count() == 0`).  On a fresh Render Postgres the first API
boot seeds it; subsequent cold starts keep the rows (`ddl-auto=update`).
So after the first deploy you already have demo data to show.

---

## 7. If you'd rather use Netlify for the frontend

`netlify.toml` (serverless-function wrapper) and `fe/Dockerfile` are both in
the repo.  But your account's Netlify deploy-worker has been stuck on
"uploading" for every deploy since Module 4, so the Render+Docker path is
the reliable one.  Use Netlify only if Render frontend quota is a concern.
