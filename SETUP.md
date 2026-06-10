# 🛠️ Local Development Setup Guide

Complete step-by-step guide to run SRE EDU OS on your local machine.

---

## 📋 Prerequisites

Install these before starting:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 16 | [postgresql.org](https://www.postgresql.org/download/) |
| Redis | 7+ | [redis.io](https://redis.io/download/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

**Windows users:** Install Redis via [Memurai](https://www.memurai.com/) (Redis for Windows).

---

## 📥 Step 1: Clone the Repo

```bash
git clone https://github.com/rchezhian81-prog/sre-edu-os.git
cd sre-edu-os
```

---

## 🗄️ Step 2: Database Setup

```sql
-- Open PostgreSQL and run:
CREATE DATABASE sreedos;
CREATE USER sreedos_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE sreedos TO sreedos_user;
```

---

## ⚙️ Step 3: Backend (NestJS API)

```bash
cd backend

# Copy and fill environment variables
cp .env.example .env
```

Edit `.env` with your values — minimum required for local dev:

```env
DATABASE_URL=postgresql://sreedos_user:yourpassword@localhost:5432/sreedos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development

# Optional for full features:
OPENAI_API_KEY=sk-...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=sreedos-dev
WHATSAPP_API_TOKEN=...
```

```bash
# Install dependencies
npm install

# Run database migrations
npm run migration:run

# Seed initial data (admin user)
npm run seed

# Start development server
npm run start:dev
```

✅ Backend runs at: **http://localhost:3001**
📖 Swagger API docs: **http://localhost:3001/api/docs**

---

## 🖥️ Step 4: Frontend (Next.js)

Open a new terminal:

```bash
cd frontend

# Copy and fill environment variables
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=SRE EDU OS
```

```bash
npm install
npm run dev
```

✅ Frontend runs at: **http://localhost:3000**

---

## 📱 Step 5: Mobile App (Expo)

Open another terminal:

```bash
cd mobile
npm install

# Start Expo dev server
npx expo start
```

- **Android:** Press `a` or scan QR with Expo Go app
- **iOS:** Press `i` or scan QR with Camera app
- **Web:** Press `w`

Edit `mobile/src/lib/api.ts` and set:
```typescript
const API_BASE_URL = 'http://YOUR_LOCAL_IP:3001'; // e.g. 192.168.1.5:3001
```

---

## 🔑 Default Login Credentials

After seeding, use these to log in:

| Role | Email | Password |
|---|---|---|
| Owner | owner@sreedos.com | Admin@123 |
| Admin | admin@sreedos.com | Admin@123 |
| Teacher | teacher@sreedos.com | Admin@123 |

---

## 🧪 Running Tests

```bash
# Backend unit tests
cd backend && npm run test

# Backend e2e tests
cd backend && npm run test:e2e

# Frontend tests
cd frontend && npm run test
```

---

## 🐞 Common Issues

**Port already in use:**
```bash
# Kill process on port 3001
npx kill-port 3001
```

**Database connection failed:**
- Ensure PostgreSQL is running: `pg_ctl status`
- Check DATABASE_URL in .env

**Redis connection failed:**
- Ensure Redis is running: `redis-cli ping` (should return PONG)

**Expo QR not working:**
- Use your machine's local IP instead of localhost in API_BASE_URL

---

## 📞 Need Help?

Open an issue at [github.com/rchezhian81-prog/sre-edu-os/issues](https://github.com/rchezhian81-prog/sre-edu-os/issues)
