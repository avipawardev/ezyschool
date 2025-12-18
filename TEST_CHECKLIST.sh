#!/bin/bash

# EzySchool LMS - Comprehensive Testing Guide
# This script provides step-by-step testing instructions

echo "=========================================="
echo "  EzySchool LMS - Testing Checklist"
echo "=========================================="
echo ""

# Test 1: Backend server startup
echo "✓ TEST 1: Backend Server Startup"
echo "  Command: cd backend && npm run dev"
echo "  Expected: Server running on port 5000"
echo "  Look for: '🚀 EzySchool LMS Backend Started' message"
echo ""

# Test 2: Health endpoint
echo "✓ TEST 2: Health Endpoint"
echo "  Command: curl http://localhost:5000/health"
echo "  Expected: {\"status\":\"Server is running\",\"timestamp\":\"...\"}"
echo ""

# Test 3: User registration
echo "✓ TEST 3: User Registration"
echo "  Command:"
echo '  curl -X POST http://localhost:5000/api/auth/register \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '{
echo '      "name": "John Doe",'
echo '      "email": "john@test.com",'
echo '      "phone": "9876543210",'
echo '      "password": "test123",'
echo '      "class": "10",'
echo '      "parentName": "Parent Name",'
echo '      "parentPhone": "9876543211",'
echo '      "address": "123 Main St"'
echo '    }'"
echo "  Expected: 201 status with token and user data"
echo ""

# Test 4: User login
echo "✓ TEST 4: User Login"
echo "  Command:"
echo '  curl -X POST http://localhost:5000/api/auth/login \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '{
echo '      "email": "john@test.com",'
echo '      "password": "test123",'
echo '      "deviceId": "test-device-123"'
echo '    }'"
echo "  Expected: 200 status with token and user data"
echo ""

# Test 5: Get profile
echo "✓ TEST 5: Get Profile (Protected Route)"
echo "  Command:"
echo '  curl -X GET http://localhost:5000/api/auth/profile \'
echo '    -H "Authorization: Bearer YOUR_TOKEN_HERE"'
echo "  Expected: 200 status with user profile data"
echo ""

# Test 6: Create course
echo "✓ TEST 6: Create Course (Admin Only)"
echo "  Command:"
echo '  curl -X POST http://localhost:5000/api/courses/create \'
echo '    -H "Content-Type: application/json" \'
echo '    -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE" \'
echo '    -d '{
echo '      "title": "Math 101",'
echo '      "description": "Basic Mathematics",'
echo '      "price": 499,'
echo '      "class": "10",'
echo '      "subject": "Math",'
echo '      "thumbnail": "https://via.placeholder.com/300"'
echo '    }'"
echo "  Expected: 201 status with course data and ID"
echo ""

# Test 7: Frontend startup
echo "✓ TEST 7: Frontend Student Startup"
echo "  Command: cd frontend-student && npm run dev"
echo "  Expected: Vite dev server on http://localhost:3000"
echo ""

# Test 8: Frontend login flow
echo "✓ TEST 8: Frontend Login Flow"
echo "  1. Navigate to http://localhost:3000"
echo "  2. Enter credentials from Test 3 (john@test.com / test123)"
echo "  3. Check browser console for errors"
echo "  4. Expected: Should redirect to /dashboard"
echo "  5. Check localStorage for 'authToken' and 'user'"
echo ""

# Test 9: Database connection
echo "✓ TEST 9: MongoDB Connection"
echo "  Check backend logs for: '✅ MongoDB Connected: localhost:27017'"
echo "  Or use: mongo mongodb://localhost:27017/ezyschool"
echo "  Show dbs"
echo "  use ezyschool"
echo "  show collections"
echo ""

# Test 10: All endpoints summary
echo "✓ TEST 10: API Endpoints Summary"
echo "  Auth Endpoints: 5"
echo "  Course Endpoints: 8"
echo "  Lecture Endpoints: 5"
echo "  Assignment Endpoints: 6"
echo "  Doubt Endpoints: 6"
echo "  Referral Endpoints: 3"
echo "  Test Endpoints: 5"
echo "  Report Endpoints: 5"
echo "  TOTAL: 43 endpoints"
echo ""

echo "=========================================="
echo "  Common Issues & Solutions"
echo "=========================================="
echo ""
echo "Issue: Port 5000 already in use"
echo "Solution: lsof -i :5000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
echo ""
echo "Issue: MongoDB connection error"
echo "Solution: Make sure MongoDB is running (brew services start mongodb-community)"
echo ""
echo "Issue: CORS errors on frontend"
echo "Solution: Check FRONTEND_STUDENT_URL in backend/.env"
echo ""
echo "Issue: Token not being sent with requests"
echo "Solution: Check localStorage for 'authToken' key"
echo ""
echo "Issue: Module not found errors"
echo "Solution: Run 'npm install' in backend and frontend-student"
echo ""

echo "=========================================="
echo "  Environment Variables Required"
echo "=========================================="
echo ""
echo "Backend .env file should have:"
echo "  PORT=5000"
echo "  NODE_ENV=development"
echo "  MONGODB_URI=mongodb://localhost:27017/ezyschool"
echo "  JWT_SECRET=your_secret_key"
echo "  JWT_EXPIRE=7d"
echo "  FRONTEND_STUDENT_URL=http://localhost:3000"
echo "  FRONTEND_ADMIN_URL=http://localhost:3001"
echo ""

echo "=========================================="
echo "  Quick Start Commands"
echo "=========================================="
echo ""
echo "# In Terminal 1 - Backend"
echo "cd backend && npm run dev"
echo ""
echo "# In Terminal 2 - Frontend Student"
echo "cd frontend-student && npm run dev"
echo ""
echo "# In Terminal 3 - MongoDB (optional, if local)"
echo "brew services start mongodb-community"
echo ""

echo "=========================================="
echo "  Files Created/Modified"
echo "=========================================="
echo ""
echo "Backend:"
echo "  ✓ src/server.js - Fixed imports (./src/ -> ./)"
echo "  ✓ .env - Created with all required variables"
echo "  ✓ src/config/db.js - MongoDB connection"
echo "  ✓ src/middleware/auth.js - JWT authentication"
echo "  ✓ src/middleware/errorHandler.js - Error handling"
echo ""
echo "Frontend Student:"
echo "  ✓ src/App.jsx - Router setup with protected routes"
echo "  ✓ src/pages/LoginPage.jsx - Login form"
echo "  ✓ src/pages/RegisterPage.jsx - Registration form"
echo "  ✓ src/pages/DashboardPage.jsx - Main dashboard"
echo "  ✓ src/api/client.js - Axios configuration"
echo "  ✓ src/api/endpoints.js - API endpoints"
echo "  ✓ src/contexts/authStore.js - Zustand auth store"
echo ""

echo ""
echo "✨ Ready to test! Follow the steps above in order."
echo "📚 For more details, see README.md and GETTING_STARTED.md"
echo ""
