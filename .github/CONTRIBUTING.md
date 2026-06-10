# Contributing to SRE EDU OS

Thank you for your interest in contributing! 🎉

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/sre-edu-os.git`
3. Set up local development (see [Quick Start in README](../README.md))
4. Create a branch: `git checkout -b feature/your-feature-name`

## 📝 Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add fee reminder notification
fix: resolve attendance date filtering bug
docs: update deployment guide
chore: upgrade NestJS to 10.3
```

## 🔍 Code Style

- **Backend**: NestJS conventions, ESLint + Prettier configured
- **Frontend**: Next.js App Router patterns, Tailwind CSS
- **Mobile**: Expo Router, Zustand for state

Run `npm run lint` and `npm run format` before committing.

## 🧪 Testing

```bash
# Backend tests
cd backend && npm run test && npm run test:e2e

# Frontend tests
cd frontend && npm run test
```

## 📬 Submitting a PR

1. Ensure all tests pass
2. Update documentation if needed
3. Fill out the PR template completely
4. Request a review from a maintainer

## 🐛 Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

## 💡 Suggesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).
