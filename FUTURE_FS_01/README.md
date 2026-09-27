<<<<<<< HEAD
# FUTURE_INTERN
=======
# Ramakrishna Vaddar | Full-Stack Developer Portfolio

A modern, responsive, and performance-optimized personal developer portfolio built for **Ramakrishna Vaddar** ([@Ramakrishnavaddar1726](https://github.com/Ramakrishnavaddar1726)), a Computer Science Engineering student and aspiring Full-Stack Software Developer.

Designed specifically for internship applications, campus placements, tech recruiters, and engineering teams. Features a clean, premium developer aesthetic with zero-pill typographic discipline, dark/light mode, real project showcases (including Thiranex internship deliverables, TanStack Start full-stack app, and LeetCode DSA in Java), ATS-friendly resume viewer, GitHub activity heatmap, and a backend-ready architecture.

---

## 1. Project Overview

- **Developer**: Ramakrishna Vaddar
- **GitHub**: [https://github.com/Ramakrishnavaddar1726](https://github.com/Ramakrishnavaddar1726)
- **Current Standing**: Computer Science & Engineering Undergraduate (5th Semester)
- **Role Focus**: Full-Stack Web Development, Frontend Engineering (React, TypeScript), RESTful APIs (Node.js/Express)
- **Availability**: Open for 2025/2026 Developer Internships, SDE-1 roles, and collaborative projects

---

## 2. Key Features

- **Sticky Glassmorphic Navigation**: Smooth scrolling, active section tracking, theme toggle, and accessible mobile drawer.
- **Developer Hero Console**: Interactive code terminal with profile tabs (`bio.ts`, `stack.json`, `git.log`), status badges, and 1-click email copy.
- **Centralized Data Configuration**: All portfolio data (projects, skills, stats, experience, education, resume links) is cleanly isolated in `src/data/portfolioData.ts` for rapid editing.
- **Categorized Skills Matrix**: Clear proficiency labeling (`Proficient`, `Intermediate`, `Familiar`) without fabricated percentage meters.
- **Dynamic Project Showcase**:
  - Filterable by `All`, `Frontend`, `JavaScript`, and `Java / DSA`.
  - Realistic visual mockups for authentic projects (*Real-Time Weather Dashboard with Open-Meteo REST API*, *Netflix India Clone*, *Client-Side Task Ledger*, and *LeetCode DSA in Java*).
  - Deep-dive modal for architectural breakdowns, problem statements, and key achievements.
- **Industry Experience & Education Timelines**: Detailed vertical timeline showcasing Web Development Internship at Thiranex and undergraduate CSE coursework (DSA, DBMS, OS, Computer Networks).
- **Interactive Resume Modal**: Built-in ATS-formatted resume viewer with direct Print/PDF generation and instant download trigger.
- **GitHub Activity & Repositories**: Visual commit activity matrix and pinned repositories with live stars, forks, and topic tags.
- **Validated Contact Form**: Client-side field validation, regex email checking, anti-duplicate protection, loading states, and backend-ready `/api/contact` dispatch.
- **SEO & Accessibility**: Complete OpenGraph cards, Twitter preview metadata, Schema.org JSON-LD structured data, `robots.txt`, and `sitemap.xml`.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Transitions**: CSS transitions and Motion

### Backend (Architecture Ready)
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database (Optional / Pluggable)**: MongoDB with Mongoose ODM
- **CORS & Environment**: `cors`, `dotenv`

---

## 4. Folder Structure

```
├── backend/                        # Backend-ready architecture
│   ├── config/
│   │   └── db.js                   # MongoDB connection logic
│   ├── controllers/
│   │   └── contactController.js    # Contact form submission handler
│   ├── middleware/
│   │   └── validator.js            # Payload schema validator
│   ├── models/
│   │   └── Contact.js              # Mongoose Contact schema
│   ├── routes/
│   │   └── contactRoutes.js        # /api/contact router
│   ├── .env.example                # Backend environment template
│   └── server.js                   # Express server entry point
│
├── public/
│   ├── robots.txt                  # Search engine crawl rules
│   └── sitemap.xml                 # XML sitemap for SEO
│
├── src/
│   ├── components/
│   │   ├── About.tsx               # About section & statistics
│   │   ├── Contact.tsx             # Validated contact form
│   │   ├── Education.tsx           # CSE academic timeline & coursework
│   │   ├── Experience.tsx          # Internship history
│   │   ├── Footer.tsx              # Footer, links & back-to-top
│   │   ├── GitHub.tsx              # GitHub stats & activity heatmap
│   │   ├── Hero.tsx                # Hero section with interactive terminal
│   │   ├── Navbar.tsx              # Sticky glassmorphic navbar
│   │   ├── ProjectMockupPreview.tsx# Vector UI mockup previews
│   │   ├── ProjectModal.tsx        # Project deep-dive modal
│   │   ├── Projects.tsx            # Filterable project showcase
│   │   ├── Resume.tsx              # Resume download callout
│   │   ├── ResumeModal.tsx         # ATS resume printable modal
│   │   └── Services.tsx            # Technical capabilities & deliverables
│   │
│   ├── data/
│   │   └── portfolioData.ts        # Single source of truth for all content
│   │
│   ├── App.tsx                     # Main App component & theme provider
│   ├── index.css                   # Tailwind v4 import & custom styles
│   └── main.tsx                    # React DOM entry point
│
├── index.html                      # HTML entry with OpenGraph & JSON-LD
├── metadata.json                   # Applet metadata
├── package.json                    # Project dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 5. Installation & Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Ramakrishnavaddar1726/Projects.git
cd Projects
```

### 2. Install dependencies
```bash
npm install
```

---

## 6. Running Locally

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 7. Optional Backend Setup (Node.js & MongoDB)

To run the backend server for persistent contact inquiries:

```bash
cd backend
npm install express mongoose cors dotenv
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
node server.js
```
The backend server runs on `http://localhost:5000` with the following endpoint:
- `POST /api/contact` — accepts `{ name, email, subject, message }`

---

## 8. Deployment Guide

### Deploying Frontend to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.

### Deploying Frontend to Netlify
1. Log in to [Netlify](https://netlify.com) and click **Add new site > Import an existing project**.
2. Select your repository.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Click **Deploy Site**.

### Deploying Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Root Directory: `backend`.
4. Build Command: `npm install`.
5. Start Command: `node server.js`.
6. Add environment variable `MONGODB_URI`.

---

## 9. How to Customize Personal Information

All personal details, projects, academic records, and links can be updated in one place:

Open `src/data/portfolioData.ts`:
- Change your name, email, GitHub handle, and LinkedIn URL under `personal`.
- Update your projects under `projects`.
- Add or edit your skills under `skills`.
- Update your college name, CGPA, and semester under `education`.
- Point `resumeUrl` to your personal PDF resume inside the `public/` directory (e.g. `/Ramakrishna_Resume.pdf`).

---

## 10. Future Improvements
- [ ] Connect real-time GitHub GraphQL API to fetch dynamic commit counts.
- [ ] Add dark-mode system preference listener (`prefers-color-scheme`).
- [ ] Integrate Nodemailer / Resend for automated contact confirmation emails.
- [ ] Add unit and end-to-end tests with Vitest and Playwright.

---

## License
MIT License © 2026 Ramakrishna. Built with passion for software engineering.
>>>>>>> e2fa015 (Added internship project)
