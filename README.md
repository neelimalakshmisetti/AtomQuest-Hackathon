# In-House Goal Setting & Tracking Portal

A comprehensive, enterprise-level web application designed to facilitate the Goal Setting and Tracking process within an organization. This solution provides separate interfaces and capabilities for Employees, Managers, and HR/Admin teams.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control

## Features
1. **Role-Based Access Control (RBAC)**: Secure access tailored for Employees, Managers, and Admins.
2. **Goal Workflow**: Employees draft and submit goals; Managers approve, reject, or request revisions.
3. **Weightage Validation**: strict validation to ensure goal weightages sum up to 100%.
4. **Quarterly Check-ins**: Periodic tracking of progress against targets.
5. **Admin Configuration**: Control active cycles (Goal Setting, Q1, Q2, etc.) and audit logs.
6. **Analytics Dashboard**: Visual representations of organizational goal distribution and statuses.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on default port 27017, or update `.env` with Atlas URI)

### Setup Instructions

1. **Clone the repository** (or use the provided folder structure).
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Seed the database with demo users (Admin, Manager, Employee)
   node seeder.js
   # Start the server
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Test User Credentials (from seeder script)
- **Admin**: `admin@company.com` / `password123`
- **Manager**: `manager@company.com` / `password123`
- **Employee**: `alice@company.com` / `password123`

## Directory Structure
- `/frontend` - React application
- `/backend` - Express API server
- `/docs` - Architecture and API documentation

## Deployment Recommendations
- **Frontend**: Deploy using Vercel or Netlify by pointing the build command to `npm run build` and output directory to `dist`.
- **Backend**: Deploy on Render, Railway, or AWS. Set the necessary environment variables (`MONGO_URI`, `JWT_SECRET`).
- **Database**: Use MongoDB Atlas for a managed production database.
