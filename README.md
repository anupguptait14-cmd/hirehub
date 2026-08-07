# HireHub — Modern Recruitment & Job Portal Platform

HireHub is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) recruitment application built for modern hiring pipelines. It connects candidates with employers through role-based dashboards, multi-faceted job search/filtering, Cloudinary/local dual file upload storage, interactive application status pipelines, and system administration controls.

![HireHub Platform](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

### 🔐 Authentication & Security
- **Role-Based Authorization**: Distinct access controls for **Candidate**, **Recruiter**, and **Admin** users.
- **Secure Token Storage**: Authentication powered by JWT delivered via **HTTP-only secure cookies**.
- **Password Protection**: Salting and password hashing with `bcryptjs`.
- **API Security**: Request rate limiting via `express-rate-limit`, security headers via `helmet`, and CORS origin validation.

### 👤 Candidate Features
- **Profile Builder**: Headline, bio, skills manager, work experience timeline, education history, and portfolio links (GitHub, LinkedIn, Website).
- **Resume Management**: Dual upload engine supporting direct file upload or profile resume attachment for job applications.
- **Job Directory**: Real-time keyword search, location query, work mode filter (Remote/On-site/Hybrid), job type, experience level, min salary, and required skills filtering.
- **Job Bookmarking**: Save/unsave job listings for quick access.
- **Application Tracker**: Live application history with visual status badges (`Applied`, `Under Review`, `Shortlisted`, `Interview`, `Rejected`, `Hired`) and status timeline change notes.

### 🏢 Recruiter / Employer Features
- **Company Branding**: Create and customize company profile with logo image upload, industry, size, website, and location.
- **Job Listing Management**: Post, edit, publish, pause, or close job postings with detailed responsibilities and requirements.
- **Applicant Review Pipeline**: View candidates for each job listing, filter by status or skill keywords, view/download resumes, update candidate application status, and attach internal recruiter notes.
- **Recruiter Analytics Dashboard**: Active jobs count, total applicants count, and quick applicant preview.

### 🛡️ Admin Features
- **Platform Analytics**: Total users count, candidate vs. recruiter distribution, active job counts, registered companies, and application metrics.
- **User Governance**: Moderate user accounts, change user roles, and suspend/activate users.
- **Job & Company Moderation**: Approve, pause, close, or remove job listings and company profiles platform-wide.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v3, React Router v6, Axios, React Hook Form |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ORM |
| **Authentication**| JSON Web Tokens (JWT), HTTP-Only Cookies, Bcrypt |
| **File Storage** | Cloudinary API (with automatic local disk `/uploads` fallback) |
| **Icons & Design**| Lucide React, Glassmorphic Glass-panel CSS utilities |

---

## 📂 Monorepo Folder Structure

```
HireHub/
├── package.json                 # Monorepo scripts (concurrent dev runner)
├── README.md                    # System documentation & API guide
├── server/                      # Express API Engine
│   ├── .env.example             # Server environment variables template
│   ├── .env                     # Server environment configuration
│   ├── server.js                # Express entry point & middleware stack
│   ├── seed.js                  # Database seeder script
│   ├── config/
│   │   ├── db.js                # MongoDB Mongoose connection handler
│   │   └── cloudinary.js        # Cloudinary setup
│   ├── models/                  # Mongoose Schema Definitions
│   │   ├── User.js
│   │   ├── CandidateProfile.js
│   │   ├── RecruiterProfile.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── SavedJob.js
│   │   ├── Notification.js
│   │   └── PasswordResetToken.js
│   ├── controllers/             # REST Controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── candidateController.js
│   │   ├── recruiterController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── savedJobController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── routes/                  # API Route Definitions
│   └── middleware/              # Auth, Role, Error, Upload, Validation
└── client/                      # Vite + React Client
    ├── .env.example             # Client environment template
    ├── .env                     # Client environment configuration
    ├── vite.config.js           # Vite dev server & proxy settings
    ├── tailwind.config.js       # Tailwind CSS theme configuration
    └── src/
        ├── index.css            # Custom CSS tokens & dark mode utilities
        ├── App.jsx              # Application router & context wrappers
        ├── components/          # Reusable UI component library
        ├── context/            # AuthContext, ThemeContext, NotificationContext
        ├── pages/              # Public, Candidate, Recruiter, Admin pages
        └── services/           # Axios API services
```

---

## 🔑 Demo Credentials

Run `npm run seed` to populate the database with realistic demo accounts:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Candidate** | `aarav@candidate.com` | `password123` | Apply to jobs, upload resume, bookmark jobs, candidate profile |
| **Recruiter** | `recruiter@techcorp.com` | `password123` | Post jobs, manage applicants, company profile |
| **Admin** | `admin@hirehub.com` | `password123` | System metrics, user moderation, job & company controls |

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB server running at `mongodb://127.0.0.1:27017/hirehub` or a MongoDB Atlas URI string.

### 2. Installation
Install all dependencies for both `/server` and `/client` from the root folder:

```bash
npm run setup
```

### 3. Environment Configuration
Ensure `.env` files exist in both `server/` and `client/` directories (created automatically by setup):

**`server/.env`**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/hirehub
JWT_SECRET=hirehub_super_secret_jwt_key_2026
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
CLIENT_URL=http://localhost:5173
```

**`client/.env`**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Seeding
Populate MongoDB with default accounts, companies, jobs, and applications:

```bash
npm run seed
```

### 5. Start Development Server
Run backend and frontend concurrently in development mode:

```bash
npm run dev
```

The application will be accessible at:
- **Client**: `http://localhost:5173`
- **Server API**: `http://localhost:5000/api`

---

## 🛰️ REST API Route Documentation

### Auth Module (`/api/auth`)
- `POST /api/auth/register` - Register candidate or recruiter
- `POST /api/auth/login` - Authenticate & attach HTTP-only cookie
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/auth/me` - Get logged-in user profile details
- `POST /api/auth/forgot-password` - Generate reset token
- `POST /api/auth/reset-password/:token` - Reset account password

### Candidate Module (`/api/candidates`)
- `GET /api/candidates/profile` - Fetch candidate profile
- `PUT /api/candidates/profile` - Update candidate details
- `POST /api/candidates/resume` - Upload resume document

### Jobs Module (`/api/jobs`)
- `GET /api/jobs` - Search, filter, and paginate job listings
- `GET /api/jobs/:id` - Single job listing details
- `POST /api/jobs` - Create new job post (Recruiter/Admin)
- `PUT /api/jobs/:id` - Update job post
- `DELETE /api/jobs/:id` - Delete job post

### Applications Module (`/api/applications`)
- `POST /api/applications` - Submit job application with resume
- `GET /api/applications/my-applications` - Candidate's application history
- `GET /api/applications/job/:jobId` - Recruiter's view of job applicants
- `PUT /api/applications/:id/status` - Update application status & notes

### Saved Jobs Module (`/api/saved-jobs`)
- `GET /api/saved-jobs` - Get saved jobs list
- `POST /api/saved-jobs/:jobId` - Bookmark job
- `DELETE /api/saved-jobs/:jobId` - Unsave job

### Companies Module (`/api/companies`)
- `GET /api/companies` - List companies
- `GET /api/companies/:id` - Get company profile & open jobs
- `POST /api/companies` - Create company (Recruiter/Admin)
- `PUT /api/companies/:id` - Update company

### Notifications Module (`/api/notifications`)
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification read
- `PUT /api/notifications/read-all` - Mark all read

### Admin Module (`/api/admin`)
- `GET /api/admin/stats` - Platform analytics
- `GET /api/admin/users` - List & search users
- `PUT /api/admin/users/:id` - Update user status/role
- `GET /api/admin/jobs` - Moderate jobs list
- `PUT /api/admin/jobs/:id/status` - Update job status
- `GET /api/admin/companies` - Moderate companies list
- `PUT /api/admin/companies/:id/status` - Update company status

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
