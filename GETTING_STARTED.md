# EzySchool LMS - Getting Started Guide

## 🎯 Quick Start (5 minutes)

### Step 1: Clone & Setup

```bash
# The project is already cloned
cd ezyschool

# Run setup script (Mac/Linux)
chmod +x setup.sh
./setup.sh

# Or manual setup (Windows)
cd backend && npm install && cp .env.example .env
cd ../frontend-student && npm install
cd ../frontend-admin && npm install
```

### Step 2: Configure Environment

**Edit `backend/.env`:**

```env
MONGODB_URI=mongodb://localhost:27017/ezyschool
JWT_SECRET=change_this_to_random_string
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_STUDENT_URL=http://localhost:3000
FRONTEND_ADMIN_URL=http://localhost:3001
```

### Step 3: Start Services

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Student Frontend:**

```bash
cd frontend-student
npm run dev
# Runs on http://localhost:3000
```

**Terminal 3 - Admin Dashboard:**

```bash
cd frontend-admin
npm run dev
# Runs on http://localhost:3001
```

### Step 4: Test the Application

**Create Test User:**

```
Register at http://localhost:3000/register
Email: test@example.com
Password: test123
Phone: 9876543210
Class: 10
Parent Name: Parent Name
Parent Phone: 9876543211
Address: Test Address
```

**Admin Access:**

```
Create admin user in MongoDB directly:
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10/...", // Use bcrypt hash
  role: "admin",
  phone: "9876543212",
  class: "12",
  parentName: "Admin Parent",
  parentPhone: "9876543213",
  address: "Admin Address"
})
```

## 📦 Free Services Setup (Optional but Recommended)

### 1. MongoDB (Free Tier - 512MB)

```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new project
4. Create free cluster (M0)
5. Get connection string
6. Update MONGODB_URI in .env
```

### 2. Cloudinary (Free - 25GB Storage)

```
1. Go to: https://cloudinary.com/users/register
2. Sign up (free tier)
3. Get API key and API secret
4. Add to backend/.env:
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
```

### 3. HuggingFace (Free - 30 requests/day)

```
1. Go to: https://huggingface.co
2. Sign up for free account
3. Go to settings > Access Tokens
4. Create new token (read)
5. Add to backend/.env:
   HUGGINGFACE_API_KEY=hf_your_token
```

### 4. Firebase (Optional - Free Tier for Notifications)

```
1. Go to: https://firebase.google.com
2. Create new project
3. Enable Cloud Messaging
4. Get credentials
5. Add to backend/.env
```

## 🧪 Testing API Endpoints

### Install Postman

- Download from: https://www.postman.com/downloads/
- Or use VS Code REST Client extension

### Test Authentication

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "test123",
  "class": "10",
  "parentName": "Jane Doe",
  "parentPhone": "9876543211",
  "address": "123 Main St"
}
```

### Get Auth Token

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "test123",
  "deviceId": "device-123"
}
```

### Use Token in Requests

```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer your_token_here
Content-Type: application/json
```

## 🔧 Common Issues & Solutions

### ❌ "MongoDB connection failed"

**Solution:**

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (Mac)
brew services start mongodb-community

# Or use MongoDB Atlas (free cloud)
```

### ❌ "Port 5000 already in use"

**Solution:**

```bash
# Kill process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### ❌ "API calls returning 401"

**Solution:**

- Check if backend is running
- Verify token is being sent correctly
- Token must be in format: `Bearer token_value`

### ❌ "CORS errors"

**Solution:**

- Make sure FRONTEND_STUDENT_URL matches your frontend URL
- Check that backend is allowing CORS from your origin

### ❌ "HuggingFace API errors"

**Solution:**

- Verify API key is valid
- First call might take 30-60 seconds (model loading)
- Check rate limits: 30 requests/day for free tier

## 📊 Database Schema

All models are pre-configured in `backend/src/models/`:

- User.js
- Course.js
- Lecture.js
- Assignment.js
- Test.js
- Payment.js
- Report.js
- Doubt.js

MongoDB will auto-create collections on first insert.

## 🎨 UI Customization

### Update Colors (Tailwind)

Edit component className colors:

```jsx
// From
<div className="bg-indigo-600">

// To
<div className="bg-blue-600">
```

### Update Logo & Branding

Replace text "EzySchool" with your brand name in components.

### Custom Domains

After deployment, update:

- FRONTEND_STUDENT_URL
- FRONTEND_ADMIN_URL
- In .env and CORS settings

## 🚀 Deployment Guide

### Deploy Backend (Heroku - Free)

```bash
cd backend
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Vercel - Free)

```bash
npm install -g vercel
cd frontend-student
vercel

# Enter project name: ezyschool-student
```

### Deploy Admin (Vercel - Free)

```bash
cd frontend-admin
vercel

# Enter project name: ezyschool-admin
```

### Deploy Database (MongoDB Atlas - Free)

```
1. Create M0 (free) cluster on MongoDB Atlas
2. Update MONGODB_URI in Heroku env vars
3. Add IP whitelist: 0.0.0.0/0
```

## 📱 Testing on Mobile

### Local Testing

```bash
# Find your computer's IP
ipconfig getifaddr en0  # Mac
ipconfig  # Windows

# Access from phone on same network
http://YOUR_IP:3000
```

### Remote Testing

- Deploy to Vercel (free)
- Share URL with anyone
- Test on any device

## 💡 Tips for Development

### 1. Use Mock Data

If API is slow, use local mock data:

```javascript
const mockCourses = [
  { id: 1, title: "Math", price: 499 },
  { id: 2, title: "Science", price: 599 },
];
```

### 2. Test Without API

Use localStorage for offline testing:

```javascript
const user = JSON.parse(localStorage.getItem("user"));
```

### 3. Fast Debugging

Use React DevTools extension:

- Chrome: https://chrome.google.com/webstore
- Search: "React Developer Tools"

### 4. API Debugging

Use Network tab in browser DevTools to see all requests.

## 📚 Learning Resources

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **MongoDB**: https://docs.mongodb.com
- **Express.js**: https://expressjs.com
- **Vite**: https://vitejs.dev

## 🎯 Next Steps After Setup

1. ✅ Verify all services are running
2. ✅ Test user registration and login
3. ✅ Create test courses
4. ✅ Upload sample lectures
5. ✅ Test assignment submission
6. ✅ Test AI doubt solver
7. ✅ Deploy to production

## 📞 Troubleshooting Checklist

- [ ] Backend running on port 5000?
- [ ] Frontend running on port 3000?
- [ ] MongoDB connected?
- [ ] .env files configured?
- [ ] API tokens valid?
- [ ] CORS enabled?
- [ ] All dependencies installed?

## 🎉 You're Ready!

Your complete LMS is now set up and ready to use!

**Questions?** Check the main README.md for detailed API documentation.

Happy learning! 🚀📚
