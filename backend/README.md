# SRE EDU OS — Backend API

> Production-grade School ERP built with NestJS + PostgreSQL + Redis

## Tech Stack
- **Framework**: NestJS 10 (TypeScript)
- **Database**: PostgreSQL 16 + TypeORM 0.3
- **Cache**: Redis 7
- **Auth**: JWT (Access + Refresh tokens) + Passport
- **Docs**: Swagger/OpenAPI (auto-generated)
- **Storage**: AWS S3
- **Email**: AWS SES / SMTP
- **WhatsApp**: Meta WhatsApp Business API
- **Container**: Docker + Docker Compose

## Quick Start

```bash
# 1. Copy env
cp .env.example .env
# Edit .env with your DB/Redis/JWT credentials

# 2. Start with Docker
docker-compose up -d

# 3. Or run locally
npm install
npm run start:dev

# API: http://localhost:3000/api/v1
# Swagger: http://localhost:3000/api/docs
```

## Module Overview (26 modules)

| Module | Status | Description |
|--------|--------|-------------|
| auth | ✅ Full | JWT login, refresh, change password |
| users | ✅ Full | User CRUD, roles, branch assignment |
| branches | ✅ Full | Multi-branch management |
| students | ✅ Full | Student CRUD, class assignment, stats |
| staff | ✅ Full | Employee records, subjects assigned |
| attendance | ✅ Full | Bulk marking, monthly reports, at-risk |
| fees | ✅ Full | Structures, collection, receipts, defaulters |
| academics | ✅ Full | Classes, sections, subjects |
| exam | ✅ Full | Schedules, marks entry, report cards, grades |
| timetable | 🔶 Stub | Period scheduling (entity ready) |
| library | 🔶 Stub | Book management (entity ready) |
| transport | 🔶 Stub | Routes, buses (entity ready) |
| notifications | ✅ Full | Email + WhatsApp Business API |
| reports | 🔶 Stub | Analytics (entity ready) |
| hostel | 🔶 Stub | Room management (entity ready) |
| hr | 🔶 Stub | Leave management (entity ready) |
| events | 🔶 Stub | School calendar (entity ready) |
| inventory | 🔶 Stub | Asset tracking (entity ready) |

## Roles & RBAC
`owner` > `admin` > `principal` > `teacher` > `accountant` > `librarian` > `transport_officer` > `parent` > `student`

## Project Structure
```
src/
├── common/          # Guards, interceptors, filters, decorators, enums
├── config/          # TypeORM DataSource config
├── database/        # Migrations
└── modules/         # 18 feature modules (26 total in Phase 4b)
```
