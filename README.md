# NariSakti Project

NariSakti is a full-stack e-commerce platform for rural women entrepreneurs. It includes customer shopping, seller product management, admin controls, orders, reviews, invoices, newsletter subscription, and profile flows.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Integrations: Cloudinary, Razorpay, Nodemailer

## Project Structure

```text
backend/   Express API, models, routes, controllers, services
frontend/  React client app
```

## Setup

1. Install dependencies:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

2. Create environment files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update MongoDB, JWT, Cloudinary, Razorpay, and SMTP values in the `.env` files.

## Run Locally

Backend:

```bash
npm --prefix backend run dev
```

Frontend:

```bash
npm --prefix frontend run dev
```

Open the app at `http://localhost:5173`. The API health check is `http://localhost:5000/api/health`.

## Verification

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix backend test -- --runInBand
```

## Notes

- Keep real secrets out of Git. Use `.env` files locally and environment variables in production.
- Production deployment needs a MongoDB database, valid JWT secrets, and configured service keys for image upload, payment, and email features.
