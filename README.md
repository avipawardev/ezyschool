# 🎓 EzySchool LMS - Complete MERN Stack Project

A **mobile-first Learning Management System (LMS)** built with MERN stack using 100% free tools and services. Perfect for educational institutions, coaching centers, and online learning platforms.

## ✨ Features

### Core Modules

- ✅ **User Authentication** - JWT-based with single device login
- ✅ **Course & Lecture Management** - Upload video, notes, resources
- ✅ **Assignments System** - Submit work, get grades, track progress
- ✅ **AI Doubt Solver** - Free HuggingFace models for Q&A
- ✅ **Referral System** - 30% earning for student referrals
- ✅ **Monthly Progress Reports** - Automated report generation
- ✅ **Subscription Management** - Course access control
- ✅ **Parent Info Collection** - Student & family information form
- ✅ **Notifications** - New lectures, assignments, sessions
- ✅ **Admin Dashboard** - Manage everything from one place

### Free Technologies Used

- **Frontend**: React 18 + Tailwind CSS + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (free tier or local)
- **AI**: HuggingFace (free inference API)
- **Storage**: Cloudinary (free plan - 25GB)
- **Authentication**: JWT (built-in)
- **Notifications**: Firebase Cloud Messaging (free tier)
- **Video**: YouTube unlisted or local/Cloudinary free tier

## 📁 Project Structure

```
ezyschool/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, error handling
│   │   ├── utils/           # Helpers, AI integration
│   │   └── server.js        # Entry point
│   ├── package.json
│   ├── .env.example
│   └── uploads/             # Local file storage
│
├── frontend-student/
│   ├── src/
│   │   ├── pages/           # Login, Dashboard, Courses, etc.
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # Zustand stores
│   │   ├── hooks/           # Custom React hooks
│   │   ├── api/             # API client & endpoints
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── frontend-admin/
    ├── src/
    │   ├── pages/           # Admin pages
    │   ├── components/      # Admin components
    │   ├── api/             # Admin API calls
    │   └── App.jsx
    ├── package.json
    └── index.html
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ and npm
- MongoDB (local or MongoDB Atlas free tier)
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your credentials
# - MongoDB URI
# - JWT secret
# - Cloudinary credentials
# - HuggingFace API key
# - Firebase project details

npm run dev
```

**Backend runs on**: `http://localhost:5000`

### Frontend Student Setup

```bash
cd frontend-student
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

**Frontend runs on**: `http://localhost:3000`

### Frontend Admin Setup

```bash
cd frontend-admin
npm install

echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

**Admin runs on**: `http://localhost:3001`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register

```
POST /auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "secure123",
  "class": "10",
  "parentName": "Jane Doe",
  "parentPhone": "9876543211",
  "address": "123 Main St",
  "referralCode": "REFXYZ" (optional)
}
Response: { token, user }
```

#### Login

```
POST /auth/login
Body: {
  "email": "john@example.com",
  "password": "secure123",
  "deviceId": "device-unique-id"
}
Response: { token, user }
```

#### Get Profile

```
GET /auth/profile
Headers: { Authorization: "Bearer {token}" }
Response: { user }
```

#### Update Profile

```
PUT /auth/profile
Headers: { Authorization: "Bearer {token}" }
Body: { name, parentName, parentPhone, address, profilePicture }
```

#### Logout

```
POST /auth/logout
Headers: { Authorization: "Bearer {token}" }
```

### Course Endpoints

#### Get All Courses

```
GET /courses?class=10&subject=Math
```

#### Get Course Details

```
GET /courses/{courseId}
```

#### Enroll in Course

```
POST /courses/enroll
Body: { courseId }
```

#### Get My Courses

```
GET /courses/my-courses
```

#### Create Course (Admin Only)

```
POST /courses/create
Body: {
  "title": "Math Basics",
  "description": "Complete math course",
  "price": 499,
  "thumbnail": "https://...",
  "class": "10",
  "subject": "Math"
}
```

### Lecture Endpoints

#### Get Course Lectures

```
GET /lectures/course/{courseId}
```

#### Get Lecture Details

```
GET /lectures/{lectureId}
```

#### Create Lecture (Admin Only)

```
POST /lectures/create
Body: {
  "courseId": "...",
  "title": "Introduction",
  "description": "...",
  "week": 1,
  "videoUrl": "https://youtube.com/...",
  "notesUrl": "https://...",
  "lectureContent": "Full text of lecture for embeddings"
}
```

### Assignment Endpoints

#### Upload Assignment

```
POST /assignments/upload
Body: {
  "lectureId": "...",
  "courseId": "...",
  "title": "Assignment 1",
  "dueDate": "2024-12-31",
  "imageUrl": "https://...",
  "submissionText": "My answer"
}
```

#### Get My Assignments

```
GET /assignments/student/all
```

#### Grade Assignment (Admin Only)

```
PUT /assignments/grade/{assignmentId}
Body: {
  "score": 85,
  "feedback": "Good work!"
}
```

### AI Doubt Endpoints

#### Ask a Doubt

```
POST /doubts/ask
Body: {
  "courseId": "...",
  "lectureId": "...",
  "question": "What is photosynthesis?",
  "language": "english" | "hindi" | "marathi"
}
Response: {
  "question": "...",
  "answer": "AI generated answer",
  "confidence": 0.85
}
```

#### Get My Doubts

```
GET /doubts/my-doubts
```

#### Mark Doubt Helpful

```
PUT /doubts/helpful/{doubtId}
```

### Referral Endpoints

#### Get My Earnings

```
GET /referrals/my-earnings
Response: {
  "referralCode": "REF1234ABC",
  "totalEarnings": 5000,
  "referredCount": 10,
  "referredUsers": [...],
  "referralHistory": [...]
}
```

#### Get All Referrals (Admin)

```
GET /referrals/admin/all-referrals
```

#### Process Referral Payment (Admin)

```
POST /referrals/admin/process-payment
Body: {
  "paymentId": "...",
  "referrerId": "..."
}
```

### Test Endpoints

#### Get Course Tests

```
GET /tests/course/{courseId}
```

#### Create Test (Admin)

```
POST /tests/create
Body: {
  "courseId": "...",
  "title": "Unit Test 1",
  "week": 1,
  "duration": 60,
  "totalMarks": 100,
  "questions": [
    {
      "question": "What is X?",
      "questionType": "mcq",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "marks": 1
    }
  ]
}
```

### Report Endpoints

#### Generate Monthly Report (Admin)

```
POST /reports/generate
Body: {
  "studentId": "...",
  "courseId": "...",
  "month": 12,
  "year": 2024
}
```

#### Get Student Reports

```
GET /reports/student/{studentId}
```

#### Get Monthly Report

```
GET /reports/{studentId}/{month}/{year}
```

## 🔧 Configuration

### .env Example

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ezyschool
# OR use MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ezyschool

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=5000

# Cloudinary (Free Plan - 25GB)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# HuggingFace (Free)
HUGGINGFACE_API_KEY=hf_your_free_api_key

# Firebase (Free Tier)
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=your_project
FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# Frontend URLs
FRONTEND_STUDENT_URL=http://localhost:3000
FRONTEND_ADMIN_URL=http://localhost:3001
```

## 🤖 AI Integration

### How Doubt Solver Works

1. **Content Embedding** (During lecture upload):

   - Lecture content split into chunks (500 words each)
   - Each chunk embedded using `sentence-transformers/all-MiniLM-L6-v2`
   - Embeddings stored in MongoDB

2. **Question Processing** (When student asks):

   - Question embedded using same model
   - Most relevant lecture chunks found (cosine similarity)
   - Top context passed to QA model: `deepset/roberta-base-squad2`
   - Answer generated and optionally translated

3. **Multi-language Support**:
   - Questions in English, Hindi, Marathi supported
   - Answers translated using free LibreTranslate API
   - Fallback to English if translation fails

### Free Models Used

- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2`
- **QA Model**: `deepset/roberta-base-squad2`
- **Translation**: LibreTranslate (free API)

## 📱 Mobile Optimization

The student frontend is fully mobile-optimized:

- **Responsive Design**: Works perfectly on all device sizes
- **Touch-Friendly**: Large tap targets (min 44px)
- **Fast Loading**: Lazy loading, code splitting
- **Offline Support**: Can be enhanced with Service Workers
- **Minimal Data**: Images optimized, API caching enabled

## 🔐 Security Features

✅ Password hashing with bcryptjs  
✅ JWT token-based authentication  
✅ Single device login (prevent account sharing)  
✅ CORS protection  
✅ Input validation with express-validator  
✅ Helmet.js for security headers  
✅ Environment variables for sensitive data

## 🚀 Performance Optimizations

### Backend

- MongoDB indexes on frequently queried fields
- Controller-service architecture for clean code
- API response compression with gzip
- Connection pooling for database
- Lazy loading of embeddings

### Frontend

- React Query for smart caching
- Code splitting with dynamic imports
- Image optimization (Cloudinary)
- Minimal bundle size
- CSS-in-JS with Tailwind (no runtime overhead)

## 📈 Referral System Logic

```
1. User registers → Auto-generates unique referral code (REF1234ABC)

2. Referred user registers with referral code
   → System stores referrerID in referredBy field

3. When referred user pays for course
   → 30% commission calculated: amount × 0.30
   → Added to referrer's referralEarnings
   → Entry recorded in referralHistory

4. Admin can view:
   - All referrals with earnings
   - Top referrers
   - Referral payment history

5. Monthly payout:
   - Admin processes payments manually
   - Earnings can be reset monthly
```

## 📊 Reporting System

### Monthly Report Generation

Automated script generates reports containing:

- Student's performance metrics
- Lectures watched count
- Assignments completed
- Test scores
- Weekly progress breakdown
- Overall performance analysis
- Parent communication data

### Report Features

- Auto-sent to parent email/WhatsApp
- PDF generation (HTML template)
- Monthly trend analysis
- Comparison with class average
- Recommendations for improvement

## 🎯 Deployment

### Backend Deployment (Heroku Free)

```bash
cd backend
npm install -g heroku
heroku login
heroku create ezyschool-api
git push heroku main
```

### Frontend Deployment (Vercel Free)

```bash
npm install -g vercel

# Student frontend
cd frontend-student
vercel

# Admin frontend
cd frontend-admin
vercel
```

### Database Deployment (MongoDB Atlas Free)

1. Go to mongodb.com
2. Create free tier cluster
3. Add connection string to .env
4. Set IP whitelist to 0.0.0.0/0 (for development only)

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Check if mongod is running
mongod --version

# On Mac: brew services start mongodb-community
# On Windows: mongod (in terminal)
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### AI Model Issues

- Ensure HuggingFace API key is valid
- First API call might take 30-60s (model loading)
- Check rate limits: free tier = ~30 requests/day

## 📞 Support & Contributing

For issues, questions, or improvements:

1. Check existing documentation
2. Review API endpoints
3. Check console for error messages
4. Verify .env configuration

## 📄 License

MIT License - Use freely for educational purposes

## 🎉 Ready to Launch!

Your complete, scalable, mobile-first LMS is ready to go live!

**Next Steps:**

1. Fill in .env with real credentials
2. Test all endpoints with Postman
3. Deploy to free tier hosting
4. Start inviting students!

Happy learning! 🚀📚
