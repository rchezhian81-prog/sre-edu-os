# SRE EDU OS — School ERP Management Platform

A production-grade, multi-branch School ERP system built with NestJS, Next.js, React Native (Expo), PostgreSQL, Redis, and AWS.

---

## 📁 Repository Structure

```
sre-edu-os/
├── backend/          # NestJS 10 API — 19 modules, 94 TypeScript files
├── frontend/         # Next.js 14 App Router web portal
├── mobile/           # React Native (Expo SDK 51) — Parent & Student apps
├── deploy/           # Kubernetes, CI/CD, Nginx, SSL configs
└── docs/             # Pilot Onboarding Guide & Sales Deck
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | NestJS 10, TypeORM, PostgreSQL 16, Redis |
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Mobile | React Native (Expo SDK 51), expo-router |
| Auth | JWT (access 15m + refresh 7d), RBAC (9 roles) |
| AI | OpenAI GPT-4o (attendance, fee risk, performance analytics) |
| Payments | Razorpay |
| Storage | AWS S3 |
| Email/SMS | AWS SES + WhatsApp Business API |
| Infrastructure | AWS EKS, ECR, RDS, ElastiCache |
| CI/CD | GitHub Actions → ECR → kubectl rollout |
| SSL | Let's Encrypt via cert-manager |

---

## 👥 Roles

`owner` · `admin` · `principal` · `teacher` · `parent` · `student` · `accountant` · `librarian` · `transport_officer`

---

## 🗄️ Backend Modules (19)

auth · users · branches · classes · sections · subjects · timetable · attendance · exams · results · fees · library · transport · notifications · messages · events · documents · ai-analytics · health

---

## 🏗️ Quick Start (Local Dev)

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- Redis 7
- Docker (optional)

### Backend
```bash
cd backend
cp .env.example .env        # fill in DB, JWT, SMTP, AWS, OpenAI keys
npm install
npm run migration:run
npm run start:dev
# API: http://localhost:3000/api/v1
# Swagger: http://localhost:3000/api/v1/docs
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
# App: http://localhost:3001
```

### Mobile
```bash
cd mobile
npm install
npx expo start
# Scan QR with Expo Go app
```

---

## ☁️ Production Deployment (AWS EKS)

See `deploy/README.md` for full instructions.

```bash
# 1. Create EKS cluster
eksctl create cluster -f deploy/k8s/cluster.yml

# 2. Install Nginx Ingress + cert-manager
helm install ingress-nginx ingress-nginx/ingress-nginx
helm install cert-manager jetstack/cert-manager --set installCRDs=true

# 3. Create secrets
cp deploy/k8s/secrets-template.yml deploy/k8s/secrets.yml
# ⚠️ Fill all values — DO NOT COMMIT secrets.yml
kubectl apply -f deploy/k8s/secrets.yml

# 4. Deploy
kubectl apply -f deploy/k8s/
```

---

## 🤖 AI Analytics Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /ai-analytics/attendance/:branchId` | GPT-4o attendance narrative + at-risk list |
| `GET /ai-analytics/fee-risk/:branchId` | Risk scoring (0–100) for fee defaulters |
| `GET /ai-analytics/performance/:branchId` | Weak subjects + failure rate analysis |
| `POST /ai-analytics/query/:branchId` | Natural language data queries |
| `GET /ai-analytics/anomalies/:branchId` | Attendance drops, zero-collection alerts |

---

## 📱 Mobile App Features

**Parent Portal** — Dashboard · Child attendance · Results · Fee payment (UPI/Card) · Messaging

**Student Portal** — Dashboard · Attendance · Results · Timetable

---

## 🔒 Security

- JWT RBAC with role guards on all endpoints
- Throttling: 100 req/min global, 20 req/min on AI query
- Helmet headers, CORS, input validation (class-validator)
- PostgreSQL Row Level Security
- Secrets via Kubernetes Secrets (never in git)
- TLS 1.2/1.3 only via Nginx

---

## 📄 Docs

- `docs/SRE_EDU_OS_Pilot_Onboarding_Guide.docx` — Setup guide for schools
- `docs/SRE_EDU_OS_Sales_Pitch_Deck.pptx` — 15-slide sales presentation

---

## ⚠️ Environment Variables

Never commit real credentials. Use `deploy/k8s/secrets-template.yml` as reference — all 26 required variables are listed there.

---

## 📧 Contact

**SRE EDU OS** · rchezhian81@gmail.com
