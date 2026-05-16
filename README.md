<div align="center">
  <h1>🎯 AtomQuest Goal Setting & Tracking Portal</h1>
  <p><em>A seamless, full-stack enterprise platform empowering organizations to align, track, and crush their quarterly goals.</em></p>
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://atom-quest-hackathon.vercel.app)
  [![Video Demo](https://img.shields.io/badge/Video_Demo-Google_Drive-blue?style=for-the-badge&logo=googledrive)](https://drive.google.com/file/d/1PoWrjv5HCQqKnms_M34dvDGH0gS5txNc/view?usp=sharing)
</div>

---

## 🚀 Experience It Live!

Skip the setup and test the live application right now:

👉 **[Launch the Goal Tracking Portal](https://atom-quest-hackathon.vercel.app)**

### Test Accounts (Try out all 3 roles!)
- **👑 Admin Role:** `admin@company.com` | `password123`
- **👔 Manager Role:** `manager@company.com` | `password123`
- **👩‍💻 Employee Role:** `alice@company.com` | `password123`

---

## 🎥 Watch The Demo Video
Don't have time to click around? Watch a full walkthrough of the Employee, Manager, and Admin workflows!

[**▶️ Click here to watch the Demo Video**](https://drive.google.com/file/d/1PoWrjv5HCQqKnms_M34dvDGH0gS5txNc/view?usp=sharing)

*(Note: The `demo_recording_live.webp` file is also included in this repository's root folder!)*

---

## 💡 Why We Built This

Organizations that rely on fragmented goal-tracking methods often struggle with alignment and accountability. Spreadsheets create blind spots, and managers cannot monitor team progress in real time. 

We built **AtomQuest** to eliminate these pain points. It is a structured, digital portal that supports the full lifecycle of employee goals—from creation and alignment to quarterly check-ins and performance visibility—all while being intuitive, reliable, and secure.

---

## ✨ Core Features

🛡️ **Role-Based Access Control (RBAC)**
Strict and secure access tailored perfectly for Employees, Managers, and Admins using JWT authentication.

📈 **Dynamic Goal Workflows**
Employees can easily draft and submit goals. Managers can effortlessly review, approve, reject, and leave inline comments for revisions.

⚖️ **Smart Weightage Validation**
The system intelligently enforces strict validation rules, guaranteeing that total goal weightages always sum up to exactly 100%.

⏱️ **Quarterly Check-ins & Analytics**
Employees log their actual progress against targets, while the system auto-computes progress scores. Admins get a beautiful, real-time Recharts dashboard showing organizational goal distribution!

---

## 🛠️ The Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose) + MongoDB Atlas
- **Authentication**: Secure JWT (JSON Web Tokens)

---

## 📂 Project Structure
- `/frontend` - The blazing fast React SPA
- `/backend` - The robust Express REST API
- `/docs` - Contains our detailed Architecture Diagram & API Documentation

---

## 💻 Running It Locally (For Developers)

If you'd like to spin up the codebase on your own machine:

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure you add your MONGO_URI and JWT_SECRET to a .env file!
node seeder.js  # Seeds the database with the dummy users
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.
