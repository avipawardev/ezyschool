# 🏗️ EzySchool Architecture & Features Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
├──────────────────────────┬──────────────────────────────────┤
│   Student Frontend       │      Admin Dashboard             │
│  (React + Tailwind)      │   (React Admin + Tailwind)       │
│  - Mobile Optimized      │   - Course Management            │
│  - Responsive Design     │   - Student Management           │
│  - Real-time Updates     │   - Report Generation            │
└──────────────────────────┴──────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY                               │
│          (Express.js + Helmet + CORS + Auth)               │
└─────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
┌───────────────┬─────────────┬──────────────┐
│  Controllers  │  Services   │ Middleware   │
│  - Auth       │  - Auth     │ - JWT Auth   │
│  - Course     │  - Course   │ - Error      │
│  - Lecture    │  - Lecture  │ - Validation │
│  - Assignment │  - AI       │ - Rate Limit │
│  - Doubt      │  - Report   │              │
│  - Referral   │  - Referral │              │
│  - Report     │  - Payment  │              │
│  - Test       │             │              │
└───────────────┴─────────────┴──────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
├─────────────────────────────────────────────────────────────┤
│ • MongoDB - Data persistence                                │
│ • HuggingFace API - AI/ML (Embeddings, QA)                 │
│ • Cloudinary - Image/Video Storage                          │
│ • Firebase - Push Notifications                             │
│ • LibreTranslate - Multi-language Translation               │
└─────────────────────────────────────────────────────────────┘
```

## Features Deep Dive

### 1. Authentication System

**Single Device Login Flow:**

```
User Registration
  ↓
Email + Phone Verified
  ↓
Generate JWT Token
  ↓
Save Device ID
  ↓
Login Allowed Only on This Device
```

**Token Structure:**

```javascript
{
  userId: "user_id",
  role: "student|admin",
  expiresIn: "7d"
}
```

### 2. Course Management System

**For Students:**

- Browse all available courses
- Filter by class and subject
- View course details and enrollment
- Track progress
- Access lectures and resources

**For Admins:**

- Create/edit/delete courses
- Upload course thumbnail (Cloudinary)
- Manage course pricing
- View enrollment statistics
- Track course performance

### 3. Lecture Management

**Video Storage Options:**

1. **YouTube Unlisted**: Free, high quality, 12-hour limit
2. **Cloudinary Free Tier**: 25GB storage, CDN delivery
3. **Local Storage**: Upload to server

**Lecture Features:**

- Video player (HTML5)
- Notes PDF attachment
- Resource links
- AI-generated embeddings (for doubt solving)
- Content-based search

### 4. Assignment System

**Workflow:**

```
Assignment Created by Admin
         ↓
Student Receives Notification
         ↓
Student Submits (image/text)
         ↓
Admin Reviews & Grades
         ↓
Feedback Sent to Student
         ↓
Report Updated
```

**Features:**

- Due date tracking
- Multiple submission formats
- Automatic grade calculation
- Performance analytics
- Submission history

### 5. AI Doubt Solver

**Architecture:**

```
Question Input (Text)
       ↓
Language Detection
       ↓
Generate Question Embedding
  (all-MiniLM-L6-v2)
       ↓
Search Similar Lecture Content
  (Cosine Similarity)
       ↓
Retrieve Top Relevant Context
       ↓
Pass to QA Model
  (roberta-base-squad2)
       ↓
Generate Answer
       ↓
Optional Translation
  (LibreTranslate)
       ↓
Return to Student
```

**Key Points:**

- Works offline once embeddings are generated
- Supports English, Hindi, Marathi
- Context-aware answers
- Fallback to pre-written answers if model fails
- Student can rate helpfulness

### 6. Referral System (30% Commission)

**How It Works:**

```
Student A Creates Account
         ↓
Generates Unique Code: REF1234XYZ
         ↓
Shares with Friend (Student B)
         ↓
B Registers with Code
         ↓
B Enrolls in Course (₹499)
         ↓
A Gets Commission: 499 × 0.30 = ₹149.70
         ↓
Added to A's Earning Account
         ↓
Admin Pays Monthly
```

**Database Flow:**

```javascript
// When B registers with referral code
User B {
  referredBy: A's_ID,
  ...
}

// When B pays for course
Payment {
  userId: B_ID,
  referrerId: A_ID,
  amount: 499,
  referralCommission: 149.70
}

// Update A's earnings
User A {
  referralEarnings += 149.70,
  referralHistory.push({
    referredUserId: B_ID,
    earnings: 149.70,
    date: now
  })
}
```

### 7. Monthly Progress Reports

**Report Contents:**

- Total lectures watched
- Assignments completed
- Tests taken and scores
- Weekly progress breakdown
- Performance analysis (Excellent/Good/Average)
- Topics learned
- Recommendations

**Generation:**

```
Admin Triggers Report Generation
         ↓
System Queries Student Data
         ↓
Calculates Metrics
         ↓
Generates PDF
         ↓
Sends to Parent Email/WhatsApp
```

### 8. Subscription System

**States:**

```
Not Subscribed
    ↓
Enrolls in Course
    ↓
Subscription Active (30 days)
    ↓
Countdown Timer
    ↓
(Auto-renew or Expire)
```

**Features:**

- Automatic subscription on enrollment
- 30-day validity period
- Access control based on status
- Subscription expiry notifications

### 9. Test/Quiz System

**Features:**

- Multiple question types (MCQ, Short Answer, True/False)
- Timed tests
- Passing score threshold
- Instant evaluation
- Detailed feedback
- Score history

**Admin Controls:**

- Create/edit tests
- Set duration and marks
- Publish/unpublish
- View all submissions
- Analyze performance

### 10. Notifications System

**Triggered Events:**

```
New Lecture Added
    ↓ (Notify Students)

Assignment Created
    ↓ (Notify Enrolled Students)

Weekly Doubt Session
    ↓ (Notify All)

Monthly Report Ready
    ↓ (Notify Student & Parent)

Referral Commission Earned
    ↓ (Notify Referrer)
```

**Methods:**

- In-app notifications
- FCM push notifications (optional)
- Email notifications
- WhatsApp notifications (via integration)

## API Response Format

All endpoints follow consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "error_type"
}
```

**Status Codes:**

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Database Indexing Strategy

**Performance Optimized Indexes:**

```javascript
// User.js
email: index          // Fast email lookup
phone: index          // Fast phone lookup
referralCode: index   // Fast referral lookup
referredBy: index     // Fast referrer query
role: index           // Fast role filtering

// Lecture.js
courseId: index       // Fast course queries
week: index           // Fast week sorting

// Assignment.js
studentId: index      // Fast student queries
courseId: index       // Fast course queries
status: index         // Fast status filtering
submittedAt: index    // Fast date queries

// Report.js
studentId: index      // Fast student queries
month/year: index     // Fast monthly queries
```

## Security Measures

1. **Authentication:**

   - JWT token-based
   - Token expiry: 7 days
   - Refresh token option available

2. **Password Security:**

   - bcryptjs hashing (salt rounds: 10)
   - Minimum 6 characters required
   - No plain text storage

3. **API Security:**

   - CORS enabled only for frontend URLs
   - Helmet.js for security headers
   - Input validation on all routes
   - Rate limiting (optional)

4. **Data Protection:**
   - No sensitive data in logs
   - HTTPS recommended for production
   - Environment variables for secrets
   - No user data in localStorage except token

## Performance Optimization

**Frontend:**

- Lazy loading components
- Code splitting with React.lazy()
- Image optimization (Cloudinary)
- React Query for caching
- Minimal API calls

**Backend:**

- Database connection pooling
- API response compression
- MongoDB indexes
- Service layer for business logic
- Middleware for cross-cutting concerns

**Caching Strategy:**

```javascript
// React Query cache
queryClient.setQueryDefaults(
  ["courses"],
  { staleTime: 5 * 60 * 1000 } // 5 minutes
);

// Lecture embeddings cached in MongoDB
```

## Error Handling

**Global Error Handler:**

```javascript
// Catches all thrown errors
// Converts Mongoose errors to user-friendly messages
// Logs errors for debugging
// Returns consistent error response
```

**Frontend Error Handling:**

```javascript
// API interceptor catches 401 → redirect to login
// Toast notifications for user feedback
// console.error for debugging
```

## Scalability Considerations

**For 10K+ Students:**

1. Horizontal scaling with load balancer
2. Database sharding by region
3. Cache layer (Redis)
4. CDN for static assets
5. Separate storage servers

**For AI Load:**

1. Queue system for embedding generation
2. Batch processing
3. Fallback to simpler models
4. Rate limiting per user

## Monitoring & Logging

**Recommended:**

1. PM2 for process management
2. Winston for logging
3. New Relic/Datadog for APM
4. Sentry for error tracking
5. LogRocket for frontend monitoring

## Deployment Checklist

- [ ] All .env variables configured
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account setup
- [ ] HuggingFace API key generated
- [ ] Firebase project created
- [ ] Security headers configured
- [ ] CORS origins updated
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database backups configured
- [ ] Error logging setup
- [ ] Performance monitoring enabled

## Future Enhancements

1. **Live Classes**: WebRTC integration for live lectures
2. **Peer Learning**: Student collaboration features
3. **Gamification**: Points, badges, leaderboards
4. **Payment Integration**: Razorpay/Stripe integration
5. **Video Analytics**: Track video completion rate
6. **ML Analytics**: Predictive student performance
7. **Mobile Apps**: React Native apps
8. **Offline Mode**: Service Workers for offline access

---

**This architecture is designed to be:**

- ✅ Scalable (handle growth)
- ✅ Maintainable (clean code)
- ✅ Secure (protected data)
- ✅ Performance (optimized)
- ✅ Cost-effective (free tier services)
