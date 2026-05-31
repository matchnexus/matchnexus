# MatchNexus — Internship Matching Platform

> **ITPM(IT3010) Module Project** — 3rd Year, Semester 1 @ SLIIT  
> A modern TypeScript-powered platform connecting students with internship opportunities through intelligent matching

![TypeScript](https://img.shields.io/badge/TypeScript-98.9%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blueviolet)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Local%20DB-336791)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Available Commands](#available-commands)
- [Team Workflow & Git Guidelines](#team-workflow--git-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

**MatchNexus** is an intelligent internship matching platform designed to streamline the connection between students seeking internship opportunities and companies offering positions. The platform leverages a sophisticated matching algorithm to pair students with suitable internships based on skills, preferences, and requirements.

### Key Objectives

✅ **Automate Matching** — Connect students with relevant internship positions  
✅ **Centralize Applications** — Single platform for managing internship applications  
✅ **Enhance Discovery** — Help students find opportunities aligned with their goals  
✅ **Streamline HR** — Enable companies to manage postings and applications efficiently  
✅ **Admin Control** — Provide administrative oversight and platform management  

---

## ✨ Features

### For Students
- 👤 **Student Profile** — Create and manage internship profiles with skills and preferences
- 🔍 **Browse Internships** — Discover matching internship opportunities
- 📄 **Application Tracking** — Track submitted applications and their status
- 💌 **Notifications** — Receive real-time updates on applications and matches
- 📱 **Responsive Interface** — Full mobile and desktop support

### For Companies
- 🏢 **Company Profile** — Manage company information and internship postings
- 📋 **Post Internships** — Create and publish internship opportunities
- 👥 **Manage Applications** — Review and process student applications
- 📊 **Analytics** — Track posting performance and application metrics
- 🔐 **Secure Dashboard** — Protected company workspace

### For Administrators
- 🛡️ **Platform Management** — Oversee all platform activities
- 👨‍💼 **User Management** — Manage students, companies, and internship postings
- 📈 **Reporting & Analytics** — Generate comprehensive platform reports
- ⚙️ **System Configuration** — Configure platform settings and policies
- 🚨 **Moderation** — Monitor and moderate user-generated content

---

## 🛠 Tech Stack

### Frontend & Framework
- **Next.js 14** — React framework with SSR and API routes
- **TypeScript 5.5** — Type-safe JavaScript (98.9% of codebase)
- **Tailwind CSS 3.4** — Utility-first CSS framework
- **Flowbite** — Pre-built Tailwind component library
- **Framer Motion 12** — Smooth animations and transitions
- **React Hot Toast** — Non-intrusive notifications

### Backend & Runtime
- **Node.js** — JavaScript runtime environment
- **Next.js API Routes** — Serverless backend functions
- **Prisma ORM 6.19** — Type-safe database access
- **NextAuth.js 4** — Authentication & authorization
- **Bcryptjs** — Password hashing & security

### Database & Infrastructure
- **PostgreSQL 18** — Relational database (local)
- **Prisma Migrations** — Database versioning & schema management
- **pgAdmin 4** — Database administration UI

### Development Tools
- **ESLint** — Code quality and linting
- **TypeScript** — Static type checking
- **VS Code** — Recommended IDE with extensions
- **PostCSS & Autoprefixer** — CSS processing

### Supporting Libraries
- **React Icons** — Icon library
- **Lucide React** — Modern icon set
- **PDF-Parse & PDFJS** — PDF processing (resume handling)
- **Nodemailer** — Email notifications
- **Clsx** — Conditional CSS classes

---

## 👥 User Roles

| Role | Access Level | Key Features |
|------|--------------|--------------|
| **Student** | `/student` | Browse internships, apply, track applications, manage profile |
| **Company** | `/company` | Post internships, manage applications, view analytics |
| **Admin** | `/admin` | Platform oversight, user management, reporting, moderation |
| **Guest** | `/` | View public information, login/signup |

---

## 📁 Project Structure

```
matchnexus/
├── app/                        # Next.js App Router (TypeScript)
│   ├── (Main)/                # Public-facing pages
│   ├── auth/                  # Authentication pages
│   ├── student/               # Student dashboard & features
│   ├── company/               # Company dashboard & features
│   ├── admin/                 # Admin panel & controls
│   ├── layout.tsx             # Root layout
│   ├── providers.tsx          # Context providers
│   └── globals.css            # Global styles
│
├── components/                # React components (TypeScript)
│   ├── Navbar.tsx             # Navigation components
│   ├── auth/                  # Authentication components
│   ├── admin/                 # Admin panel components
│   └── [feature]/             # Feature-specific components
│
├── server/                    # Backend logic (API routes, utilities)
│   ├── actions/               # Server actions
│   ├── api/                   # API endpoints
│   └── utils/                 # Helper functions
│
├── lib/                       # Shared utilities & helpers
│   ├── auth.ts               # Authentication logic
│   ├── email.ts              # Email utilities
│   └── utils.ts              # Common utilities
│
├── types/                     # TypeScript type definitions
│   ├── index.ts              # Exported types
│   └── next-auth.d.ts        # NextAuth type extensions
│
├── prisma/                    # Database configuration
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations (auto-generated)
│
├── public/                    # Static assets
│   ├── images/               # Image files
│   └── [assets]/             # Other static files
│
├── .env                       # Environment variables (LOCAL ONLY - DO NOT COMMIT)
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies & scripts
└── README.md                 # This file
```

---

## 📦 Prerequisites

Before starting development, ensure you have the following installed:

| Tool | Version | Purpose | Check |
|------|---------|---------|-------|
| **Node.js** | v18+ | JavaScript runtime | `node -v` |
| **npm** | v9+ | Package manager | `npm -v` |
| **Git** | Any | Version control | `git --version` |
| **PostgreSQL** | 18 | Database server | `psql --version` |
| **pgAdmin** | 4+ | Database UI | Open browser to `localhost:5050` |

**Windows Users:** Ensure `postgresql-x64-18` is **Running** in Windows Services.

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/matchnexus/matchnexus.git
cd matchnexus
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create PostgreSQL Database

**Using pgAdmin UI:**

1. Open **pgAdmin 4** in your browser
2. Navigate to **Servers → PostgreSQL 18**
3. Right-click **Databases** → **Create → Database**
4. Database name: `matchnexus`
5. Owner: `postgres` (default)
6. Click **Save**

### 4️⃣ Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/matchnexus?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email Configuration (Optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
```

**⚠️ Important:** Never commit `.env` to GitHub. It's listed in `.gitignore`.

### 5️⃣ Set Up Prisma & Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev
```

### 6️⃣ Start Development Server

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 🗄️ Database Setup

### Understanding Prisma

Prisma is an ORM (Object-Relational Mapping) tool that manages database operations through a schema file.

### Key Files

- **`prisma/schema.prisma`** — Database schema definitions
- **`prisma/migrations/`** — Record of all schema changes (auto-generated)
- **`.env`** — Database connection string

### Common Database Commands

```bash
# View database UI (Prisma Studio)
npx prisma studio

# Validate schema
npx prisma validate

# Create a new migration (after schema changes)
npx prisma migrate dev --name describe_your_change

# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset
```

---

## ▶️ Running the Project

### Development Mode

```bash
npm run dev
```

- Application runs at `http://localhost:3000`
- Hot reload enabled for instant updates
- TypeScript errors shown in terminal

### Production Build

```bash
npm run build
npm start
```

### Code Quality

```bash
# Lint code with ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

---

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |
| `npx prisma studio` | Open Prisma Studio (visual database UI) |
| `npx prisma validate` | Validate the Prisma schema |
| `npx prisma migrate dev` | Create and run database migrations |
| `npx prisma generate` | Generate Prisma Client |

---

## 🔧 Team Workflow & Git Guidelines

### When Modifying the Database Schema

**Always follow this workflow:**

```bash
# 1. Pull latest changes from remote
git pull origin main

# 2. Make your schema changes in prisma/schema.prisma

# 3. Create a migration with a descriptive name
npx prisma migrate dev --name add_field_to_user_table

# 4. Commit only schema and migration files
git add prisma/schema.prisma prisma/migrations/
git commit -m "Add new fields to user table"

# 5. Push to remote
git push origin main
```

### Files to Commit ✅

```
prisma/schema.prisma
prisma/migrations/**
```

### Files to NEVER Commit ❌

```
.env
.env.local
node_modules/
.next/
dist/
```

### Branch Naming Convention

```
feature/student-profile-page
bugfix/login-authentication-error
chore/update-dependencies
```

---

## 🆘 Troubleshooting

### ❌ Error: `P1001 — Can't reach database server`

**Solution:**
- Verify PostgreSQL is running in Windows Services
- Check `.env` DATABASE_URL has correct port (5432 or 5433)
- Confirm database name is `matchnexus`

```bash
# Windows: Check if PostgreSQL is running
# Services → postgresql-x64-18 → Running
```

---

### ❌ Error: `password authentication failed for user "postgres"`

**Solution:**
- Verify password in `.env` DATABASE_URL matches PostgreSQL installation
- Test login in pgAdmin with the same credentials

```env
# Ensure password is correct
DATABASE_URL="postgresql://postgres:YOUR_CORRECT_PASSWORD@localhost:5432/matchnexus?schema=public"
```

---

### ❌ Error: `database "matchnexus" does not exist`

**Solution:**
- Create the database using pgAdmin (see Database Setup section)
- Then run migrations:

```bash
npx prisma migrate dev
```

---

### ❌ TypeScript or Module Errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npx prisma generate
```

---

## 🤝 Contributing

### Contributing Guidelines

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure TypeScript compilation succeeds
   ```bash
   npm run lint
   ```

3. **Commit with meaningful messages**
   ```bash
   git commit -m "Add: feature description"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** with a clear description

### Code Standards

- Write TypeScript instead of JavaScript
- Follow ESLint rules configured in the project
- Keep components focused and reusable
- Add comments for complex logic
- Test functionality before committing

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)

---

## 📞 Support & Questions

For questions or issues:

1. **Check Troubleshooting section** above
2. **Open a GitHub Issue** with detailed description
3. **Contact team lead** or instructor

---

## 📝 License

Educational project for SLIIT IT3010 (ITPM) module.

---

## ✍️ Authors

**MatchNexus Development Team**  
SLIIT — 3rd Year, Semester 1 (2026)

---

**Last Updated:** May 31, 2026  
**Current Version:** 0.1.0
