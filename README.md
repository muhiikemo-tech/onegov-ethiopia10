# OneGov Ethiopia

Unified government services platform (MESOB-style) for Ethiopian citizens.

## Architecture
- **API**: Node.js + Express + PostgreSQL (JWT, OTP, Fayda, RBAC, Audit)
- **Web**: React + Vite + TypeScript (Multilingual: en, am, om)
- **Admin**: React + Vite + TypeScript
- **Mobile**: Expo (React Native)

## Quick Start

1. Install
   pnpm install --ignore-scripts

2. Setup database
   psql -U onegov -d onegov -f apps/api/onegov_schema.sql

3. Seed
   cd apps/api && pnpm exec tsx src/db/seed.ts

4. Run services
   cd apps/api && pnpm dev
   cd apps/web && pnpm dev
   cd apps/admin && pnpm dev

## Default Login
- Fayda code: TESTCODE12345
- OTP: printed in server logs
- Admin email: admin@onegov.et

## Services (28+ MESOB services)
Identity, Business, Tax, Transport, Health, Education, Land, Justice, Utility, Fayda

## Languages
English, አማርኛ, Afaan Oromoo
