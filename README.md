# 🏫 SRE EDU OS — Complete School ERP Platform

[![CI/CD](https://github.com/rchezhian81-prog/sre-edu-os/actions/workflows/deploy.yml/badge.svg)](https://github.com/rchezhian81-prog/sre-edu-os/actions)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo_51-blue?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-AWS_EKS-326CE5?logo=kubernetes)](https://aws.amazon.com/eks/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **A production-ready, full-stack School ERP** covering student admissions to AI-powered analytics — built with modern technologies and deployable to AWS EKS in minutes.

🌐 **Live Demo:** [rchezhian81-prog.github.io/sre-edu-os](https://rchezhian81-prog.github.io/sre-edu-os)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 👨‍🎓 **Student Management** | Admissions, profiles, promotions, ID cards |
| 💰 **Fee Management** | Structures, Razorpay payments, receipts, defaulter reports |
| 📅 **Attendance** | Daily tracking with auto WhatsApp parent alerts |
| 📊 **Exams & Results** | Scheduling, marks, report cards, performance analytics |
| 📱 **Mobile App** | Parent & student portals (iOS + Android via Expo) |
| 🤖 **AI Analytics** | GPT-4o insights, performance predictions, risk scoring |
| 📚 **Library** | Catalog, issue/return tracking, fines |
| 🚌 **Transport** | Routes, vehicles, GPS integration |
| 💬 **Communication** | WhatsApp Business API, push notifications, circulars |
| 🔐 **RBAC** | 9 roles with granular permissions |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                    CLIENT LAYER                       │
│   Next.js 14 Web App    │   React Native Mobile App  │
│   (app.sreedos.com)     │      (iOS + Android)       │
└──────────────┬──────────────────────┬────────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────────────────────────────────────┐
│             NGINX INGRESS (Kubernetes)                │
│          api.sreedos.com / app.sreedos.com           │
└─────────────────────────┬────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────┐
│          NestJS API (19 Modules, AWS EKS)             │
│  Auth │ Students │ Fees │ Attendance │ Exams │ ...    │
└──────┬───────────────────────────────┬───────────────┘
       │                               │
       ▼                               ▼
┌─────────────┐               ┌────────────────┐
│ PostgreSQL  │               │     Redis      │
│    (RDS)    │               │ (ElastiCache)  │
└─────────────┘               └────────────────┘
```

---

## 📁 Project Structure

```
sre-edu-os/
├── backend/              # NestJS 10 API
│   ├── src/modules/      # 19 feature modules
│   ├── src/common/       # Guards, decorators, utilities
│   ├── .env.example      # All required env vars
│   └── package.json
├── frontend/             # Next.js 14 App Router
│   ├── src/app/          # Pages & layouts
│   ├── src/components/   # UI components
│   └── .env.local.example
├── mobile/               # React Native / Expo SDK 51
│   ├── app/(parent)/     # Parent portal screens
│   ├── app/(student)/    # Student portal screens
│   └── src/store/        # Zustand state management
├── deploy/               # Infrastructure & CI/CD
│   ├── k8s/              # Kubernetes manifests
│   └── .github/workflows/deploy.yml
└── docs/                 # Documentation & assets
```

---

## 👥 User Roles (9 Roles)

| Role | Access |
|---|---|
| 👑 `owner` | Full system control across all schools |
| 🛡️ `admin` | School-wide administration |
| 🏫 `principal` | Academic reports, staff management |
| 👩‍🏫 `teacher` | Class, attendance, marks entry |
| 👨‍👩‍👧 `parent` | Mobile app — child's data only |
| 👦 `student` | Mobile app — own results & timetable |
| 💼 `accountant` | Fee collection and financial reports |
| 📚 `librarian` | Book catalog and issue management |
| 🚌 `transport_officer` | Routes, vehicles, assignments |

---

## 🚀 Quick Start

### Prerequisites: Node.js 18+, PostgreSQL 16, Redis 7

```bash
# Backend (NestJS API)
cd backend && cp .env.example .env
npm install && npm run migration:run && npm run start:dev
# → http://localhost:3001

# Frontend (Next.js)
cd frontend && cp .env.local.example .env.local
npm install && npm run dev
# → http://localhost:3000

# Mobile (Expo)
cd mobile && npm install && npx expo start
# → Scan QR with Expo Go
```

---

## 🌐 Deploy to AWS EKS

```bash
# 1. Fill secrets
cp deploy/k8s/secrets-template.yml deploy/k8s/secrets.yml

# 2. Apply all K8s manifests
kubectl apply -f deploy/k8s/

# 3. CI/CD auto-deploys on every push to main via GitHub Actions
```

See [deploy/README.md](deploy/README.md) for the full EKS setup guide.

---

## 🤝 Contributing

1. Fork → `git checkout -b feature/your-feature`
2. Commit → `git commit -m 'feat: your feature'`
3. Push → `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

MIT — © 2024 [rchezhian81-prog](https://github.com/rchezhian81-prog)

📧 rchezhian81@gmail.com | 🐛 [Issues](https://github.com/rchezhian81-prog/sre-edu-os/issues)
