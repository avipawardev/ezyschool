# EzySchool LMS - MERN Stack Application

A comprehensive Learning Management System (LMS) built with the MERN stack (MongoDB, Express.js, React, Node.js). This application serves three distinct user roles: Students, Instructors, and Administrators, providing a complete ecosystem for online education.

## 🌟 Key Features

### 🎓 Student Portal
- **Course Discovery**: Browse and search for courses with advanced filtering.
- **Learning Experience**: Interactive video player, lecture notes, and progress tracking.
- **Payments**: Secure course purchase via Razorpay integration.
- **AI Assistant**: Built-in AI support for learning queries (powered by Gemini).
- **Dashboard**: Track enrolled courses, completion certificates, and purchase history.
- **Referral System**: "Refer and Earn" functionality to invite friends.
- **Support**: Integrated support ticket system for queries.

### 👨‍🏫 Instructor Portal
- **Course Management**: Create, edit, and publish courses.
- **Curriculum Builder**: Upload videos, lecture notes, and structure course modules.
- **Analytics**: View student enrollment and course performance (planned/foundational).

### 🛡️ Admin Dashboard
- **User Management**: Manage student and instructor accounts.
- **Course Oversight**: Review and approve/reject courses.
- **Support**: Manage and resolve support tickets.
- **System Settings**: Global application settings and notifications.
- **Theme Support**: Dark/Light mode toggle.

## 🏗️ Architecture Overview

The application follows a standard Client-Server architecture.

### Backend (`/server`)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Key Routes**:
  - `/auth`: Authentication (Register, Login, Credential reset).
  - `/student/*`: Student-specific routes (courses, progress, razorpay, ai, profile).
  - `/instructor/*`: Instructor course and media management.
  - `/admin/*`: Administration routes.
  - `/media`: Cloudinary integration for media assets.
- **Services**:
  - **Cloudinary**: For storing course thumbnails and video content.
  - **Razorpay**: For processing payments.
  - **Google Gemini**: For AI-powered student assistance.

### Frontend (`/client`)
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Radix UI components.
- **State Management**: React Context (`AuthContext`, `InstructorContext`, `StudentContext`).
- **Routing**: `react-router-dom` with role-based `RouteGuard`.
- **Key Pages**:
  - `admin-view`: Dashboard, Courses, Users, Support.
  - `student-view`: Home, Courses, Course Details, Profile, Player.
  - `instructor-view`: Dashboard, Create/Edit Course.

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React, Vite, TailwindCSS, Radix UI, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **Storage** | Cloudinary |
| **Payments** | Razorpay |
| **AI** | Google Gemini |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Razorpay Account

### Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Backend Setup**
    ```bash
    cd server
    npm install
    # Create .env file with:
    # PORT, MONGO_URI, CLIENT_URL, JWT_SECRET
    # CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
    # RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
    # GEMINI_API_KEY
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access App**
    Open `http://localhost:5173` (or your configured port) in the browser.

## 📁 Project Structure

```
ezyschool/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages (Admin, Student, Instructor)
│   │   ├── context/       # Global state (Auth, etc.)
│   │   └── services/      # API service calls
│   └── package.json
└── server/                # Express Backend
    ├── models/            # Mongoose Schemas (User, Course, Order, etc.)
    ├── routes/            # API Route definitions
    ├── controllers/       # Business logic
    └── server.js          # Entry point
```
