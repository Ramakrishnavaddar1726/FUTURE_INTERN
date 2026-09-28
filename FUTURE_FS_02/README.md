# LeadPulse CRM - Lead Management Web Platform

> A production-style Customer Relationship Management (CRM) web application for capturing, organizing, tracking, and converting client leads generated from website contact forms. Built with React, Express, Node.js, JWT, Bcrypt, and MongoDB / Mongoose ODM.

---

## 1. Project Overview

LeadPulse CRM provides an end-to-end sales pipeline that connects public website lead generation forms directly to an authenticated administrator command center. 

When a prospective client submits an inquiry through the website contact form, the lead is immediately validated, assigned an ID, saved into the database, and reflected in real time on the sales dashboard. Authorized team members can track lead statuses (`New` → `Contacted` → `Converted`), log timestamped client interaction notes, schedule follow-up tasks with priority levels, and evaluate conversion metrics with interactive visual charts.

---

## 2. Key Features

- **Public Marketing & Lead Generation**:
  - High-conversion SaaS landing page with features, trust signals, and architectural diagrams.
  - Dedicated Contact / Inquiry submission form with real-time field validation.
  - Automatic lead ingestion directly into the database with source tracking (`Website Contact Form`).

- **Secure Administrator Authentication**:
  - Protected administrative routes.
  - JWT (JSON Web Tokens) session management.
  - Password encryption using **Bcrypt** (10 salt rounds).
  - Quick-fill demo credentials for portfolio evaluators and recruiters.

- **Interactive CRM Dashboard & Recharts**:
  - Summary metric cards: Total Leads, New Leads, Contacted Leads, Converted Leads, Pending Follow-ups.
  - Dynamic Conversion Rate calculation (`% Won`).
  - **Recharts Donut Chart**: Lead status distribution (`New`, `Contacted`, `Converted`).
  - **Recharts Area Timeline Chart**: Leads received over time (Toggle 7 days vs 30 days).
  - **Recharts Bar Chart**: Lead attribution channels (Website, Referral, Social, Ads, Other).

- **Lead Management & Operations**:
  - Search across Name, Email, Phone, Company, and Service.
  - Multi-criteria filtering: Status, Source Channel, Priority, and Date Range.
  - Multi-attribute sorting: Newest, Oldest, Name (A-Z / Z-A), Follow-up date, Status.
  - Server-side pagination (10, 25, 50 per page).
  - One-click inline status switcher directly from the lead table.
  - Comprehensive Lead Details Profile with full contact intelligence and original inquiry message.
  - Full CRUD operations: Create, View, Edit, and Delete leads with confirmation dialogs.
  - One-click CSV Export for sales reporting.

- **Client Notes System**:
  - Chronological communication timeline per lead.
  - Author and timestamp tracking for meeting notes and phone logs.
  - Add, edit, and delete notes.

- **Follow-up Reminders & Task Agenda**:
  - Scheduled follow-up dates, times, and priority levels (`High`, `Medium`, `Low`).
  - One-click completion status toggle (`Pending` ↔ `Completed`).
  - Notification badge in the top navigation bar highlighting upcoming reminders.

- **Admin Profile & Settings**:
  - Update admin profile details (name, email).
  - Password change with current password validation and Bcrypt re-hashing.
  - Database status indicators and deployment topology information.

---

## 3. Technology Stack

### Frontend
- **React.js 19**
- **Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **Recharts** (Interactive SVG Data Visualizations)
- **Plus Jakarta Sans** typography

### Backend
- **Node.js**
- **Express.js** REST API Architecture
- **JWT (jsonwebtoken)** for stateless authentication
- **Bcryptjs** for secure password hashing
- **CORS** & Input validation

### Database
- **MongoDB** with **Mongoose ODM**
- Built-in dual-mode storage engine:
  - If `MONGODB_URI` is provided, connects directly to **MongoDB Atlas**.
  - If no external URI is provided, runs a persistent JSON document store with automatic seeding.

---

## 4. Architecture & Workflow

```text
Website Visitor
      ↓
Contact Form
      ↓
POST /api/leads (Express REST API)
      ↓
Schema Validation & Sanitization
      ↓
MongoDB / Local Persistent Store
      ↓
Lead Created (Status: New, Source: Website Contact Form)
      ↓
Admin Authenticates (POST /api/auth/login → JWT)
      ↓
CRM Dashboard Live Feed
      ↓
Sales Rep Outreach → Status: Contacted
      ↓
Add Communication Notes & Follow-up Reminders
      ↓
Client Signs Contract → Status: Converted
```

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/leadpulse-crm.git
   cd leadpulse-crm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Configure the variables in `.env`:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 6. Demo Admin Login Credentials

For quick evaluation, pre-seeded accounts are provided:

| Role | Email | Password |
|---|---|---|
| **Primary Administrator** | `admin@leadpulse.com` | `Admin@123456` |
| **Sales Lead** | `sales@leadpulse.com` | `Admin@123456` |

*Tip: On the Login page, click the **"Autofill Demo Admin"** button to automatically populate credentials.*

---

## 7. REST API Documentation

### Authentication
- `POST /api/auth/login` - Authenticate admin & receive JWT
- `POST /api/auth/logout` - Clear user session
- `GET /api/auth/me` - Fetch authenticated admin profile (Bearer token)
- `PUT /api/auth/profile` - Update admin name and email
- `PUT /api/auth/change-password` - Update admin password

### Leads
- `GET /api/leads` - List leads (Supports `page`, `limit`, `search`, `status`, `source`, `priority`, `dateRange`, `sortBy`)
- `GET /api/leads/:id` - Get single lead with nested notes and follow-ups
- `POST /api/leads` - Create lead (Public endpoint for contact forms or admin)
- `PUT /api/leads/:id` - Update lead fields
- `PATCH /api/leads/:id/status` - Inline status update (`New`, `Contacted`, `Converted`)
- `DELETE /api/leads/:id` - Delete lead and associated records

### Notes
- `GET /api/leads/:id/notes` - List notes for a specific lead
- `POST /api/leads/:id/notes` - Add a note to a lead
- `PUT /api/notes/:id` - Edit a note
- `DELETE /api/notes/:id` - Delete a note

### Follow-ups
- `GET /api/followups` - List follow-ups with optional filters (`status`, `leadId`)
- `POST /api/leads/:id/followups` - Schedule follow-up for a lead
- `PUT /api/followups/:id` - Update follow-up details
- `PATCH /api/followups/:id/complete` - Toggle follow-up completion status
- `DELETE /api/followups/:id` - Delete follow-up

### Dashboard
- `GET /api/dashboard/stats` - Total leads, status counts, conversion rate, pending follow-ups
- `GET /api/dashboard/leads-over-time` - Timeline acquisition metrics (7d or 30d range)
- `GET /api/dashboard/lead-sources` - Breakdown by acquisition channel

---

## 8. Deployment Guide

### Deploying to Production (Render / Railway / Vercel)

- **Frontend & Fullstack**:
  - Run command: `npm run build`
  - Start command: `node server/server.js` or `npm start`
- **Database**:
  - Provision a free database cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
  - Add your connection string to the `MONGODB_URI` environment variable.

---

## 9. Future Improvements

- Automated email notifications to admins when a new contact inquiry arrives (SendGrid / Nodemailer).
- Webhook integrations for external lead sources (Zapier, Facebook Lead Ads, Google Ads).
- Multi-user role hierarchy (Admins vs Sales Reps assigned to specific leads).
- Calendar sync (Google Calendar / Outlook iCal export) for scheduled follow-ups.

---

## 10. License

This project is open-source and available under the MIT License.
