# ResidentHub — FastAPI Backend Service

Production-grade Python 3.11 FastAPI backend enforcing **3-Tier Clean Architecture** for apartment operations, civil census registry, automated billing, and VietQR IPN reconciliation.

---

## 🚀 Quickstart Guide

### 1. Requirements
- Python 3.11+
- PostgreSQL 16 (Optional, graceful fallback supported)

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Application
```bash
uvicorn app.main:app --port 8000 --reload
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- OpenAPI Specification JSON: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

### 4. Run Unit Tests (Pytest)
```bash
pytest tests -v
```

---

## 🏛️ 3-Tier Layering Architecture

```
backend/
├── app/
│   ├── main.py                  # FastAPI application factory, CORS, and RFC 7807 handlers
│   ├── core/                    # Cross-cutting: Config, RFC 7807 Errors, Response envelope
│   ├── db/                      # Database session & asyncpg connection pool
│   ├── schemas/                 # Pydantic v2 DTOs (Request / Response validation)
│   ├── repositories/            # Tier 3: Data Access Layer (Parameterized SQL & Locks)
│   ├── services/                # Tier 2: Pure Domain Services (Business Logic)
│   └── api/v1/                  # Tier 1: Presentation Layer (FastAPI Routers)
└── tests/                       # Unit testing suite (100% Isolated Domain Tests)
```
