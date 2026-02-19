# Kodbank

A modern banking app with user registration, login (JWT), and balance check.

## Features

- **Register**: uid, uname, password, email, phone (role: Customer only). Initial balance: ₹1,00,000
- **Login**: Username/password validation, JWT token stored in HTTP-only cookie
- **Dashboard**: Check Balance button; displays balance with confetti celebration

## Database (Aiven MySQL)

Tables:
- **KodUser**: uid, username, email, password, balance, phone, role (Customer, manager, admin)
- **UserToken**: tid, token, uid, expiry

## Setup

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 2. Configure environment

Create `server/.env` (or copy from `server/.env.example`):

```
# Aiven MySQL – use full URL or individual vars
DB_URL=mysql://username:password@your-aiven-host:port/defaultdb?sslmode=require
# OR
DB_HOST=your-aiven-host
DB_PORT=12345
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=kodbank
DB_SSL=true

JWT_SECRET=mykodnestsecurekey123456789123456789
PORT=3001
```

### 3. Initialize database

```bash
npm run server:init
```

### 4. Run the app

```bash
# Terminal 1 – backend
npm run server

# Terminal 2 – frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend (Vite) |
| `npm run server` | Start backend (Express) |
| `npm run server:init` | Create DB tables |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
