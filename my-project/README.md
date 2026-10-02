# 🌿 AyurVeda Health Platform

A comprehensive full-stack digital Ayurvedic healthcare ecosystem built with **React, TypeScript, Vite, Tailwind CSS, Node.js, Express, and MySQL**.

---

## 🚀 Quick Start Guide

### 1. Database Setup & Migration
The entire platform is backed by **23 real MySQL relational tables** with comprehensive seeded clinical data.

```bash
# Navigate to the backend directory
cd BACKEND

# Install dependencies
npm install

# Configure environment variables in BACKEND/.env:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=ayurveda

# Run the complete database migration (seeds all 23 tables automatically)
npm run migrate
```

> 📘 **Detailed Architecture Guide**: See [DATABASE_MIGRATION_AND_SYSTEM_GUIDE.md](./DATABASE_MIGRATION_AND_SYSTEM_GUIDE.md) for full database schemas, entity relationship breakdown, and API documentation.

### 2. Start Backend Server
```bash
cd BACKEND
npm run dev
# Server runs on http://localhost:5174
```

### 3. Start Frontend Client
```bash
cd FRONTEND
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🌟 Key Features

- **Physician Portal & Dashboard**: Doctor schedule management, consultation fee configuration, patient messaging, status updating, and real-time revenue analytics.
- **Patient Wellness Portal**: Daily Dosha adherence tracking, vitals, active health goals, and clinical recovery timeline.
- **Digital Health Locker**: Upload and manage prescriptions, lab results, and Ayurvedic diagnostic summaries directly in MySQL.
- **Dynamic AI Symptom Checker**: Multi-step assessment questionnaires, Dosha imbalance scoring (Vata, Pitta, Kapha), and classical herbal remedy recommendations.
- **Clinics & Panchakarma Sanctuaries**: Authentic clinic directory with Google Maps geo-coordinates, verified package details, and recovery chronicles.
- **Therapies & Encyclopedia**: Deep taxonomy of Ayurvedic treatments (Abhyanga, Shirodhara, Basti) and classical disease knowledge.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Framer Motion
- **Backend**: Node.js, Express, MySQL (`mysql2/promise`), Sequelize ORM, MongoDB (chat history)
- **Database**: MySQL 8.0+ (23 relational tables, automated migrations)
