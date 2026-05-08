# 🏗️ System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                    │  │
│  │                                                        │  │
│  │  • Landing Page      • Dashboard      • Upload       │  │
│  │  • Login/Register    • History        • Analytics    │  │
│  │  • Meeting Detail    • Profile        • AI Chat      │  │
│  │                                                        │  │
│  │  State: Context API + Local State                    │  │
│  │  Styling: Tailwind CSS + Framer Motion              │  │
│  │  Charts: Recharts                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Backend                       │  │
│  │                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │   Routes    │  │ Controllers │  │ Middleware  │ │  │
│  │  │             │  │             │  │             │ │  │
│  │  │ • Auth      │→ │ • Auth      │  │ • JWT Auth  │ │  │
│  │  │ • Meeting   │→ │ • Meeting   │  │ • Upload    │ │  │
│  │  │ • Email     │→ │ • Email     │  │ • Validate  │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │
│  │                                                        │  │
│  │  Security: JWT, Bcrypt, Rate Limiting, CORS          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   DATABASE   │ │   AI LAYER   │ │    EMAIL     │
│              │ │              │ │              │
│   MongoDB    │ │   OpenAI     │ │  Nodemailer  │
│   Atlas      │ │              │ │              │
│              │ │ • Whisper    │ │  • Gmail     │
│ • Users      │ │ • GPT-4      │ │  • SMTP      │
│ • Meetings   │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## Data Flow

### 1. User Registration/Login Flow

```
User Input (Frontend)
    │
    ├─→ Email & Password
    │
    ▼
Validation (Frontend)
    │
    ├─→ Check format
    │
    ▼
API Request (POST /api/auth/register or /login)
    │
    ▼
Backend Validation (express-validator)
    │
    ├─→ Check required fields
    │
    ▼
Password Hashing (bcrypt)
    │
    ├─→ Salt rounds: 12
    │
    ▼
Database Operation (MongoDB)
    │
    ├─→ Create/Find user
    │
    ▼
JWT Token Generation
    │
    ├─→ Sign with secret
    ├─→ Expires in 30 days
    │
    ▼
Response to Frontend
    │
    ├─→ User data + token
    │
    ▼
Store in Context + LocalStorage
    │
    ▼
Redirect to Dashboard
```

### 2. Meeting Upload & Processing Flow

```
User Selects File (Frontend)
    │
    ├─→ Drag & drop or browse
    │
    ▼
File Validation (Frontend)
    │
    ├─→ Check type (MP3, WAV, M4A, MP4)
    ├─→ Check size (< 100MB)
    │
    ▼
Upload to Server (POST /api/meeting/upload)
    │
    ├─→ FormData with file + title
    │
    ▼
Multer Middleware
    │
    ├─→ Save to /uploads directory
    ├─→ Generate unique filename
    │
    ▼
Create Meeting Record (MongoDB)
    │
    ├─→ Status: 'uploaded'
    ├─→ Store file path
    │
    ▼
Return Meeting ID
    │
    ▼
Start AI Processing (POST /api/meeting/process/:id)
    │
    ├─→ Update status: 'processing'
    │
    ▼
┌─────────────────────────────────────┐
│     AI PROCESSING PIPELINE          │
│                                     │
│  Step 1: Transcription              │
│  ├─→ Send file to Whisper API      │
│  ├─→ Receive text transcript       │
│  └─→ Save to database               │
│                                     │
│  Step 2: AI Analysis                │
│  ├─→ Send transcript to GPT-4      │
│  ├─→ Structured prompt              │
│  ├─→ Request JSON response          │
│  └─→ Parse AI response              │
│                                     │
│  Step 3: Extract Insights           │
│  ├─→ Executive summary              │
│  ├─→ Key points                     │
│  ├─→ Decisions made                 │
│  ├─→ Action items                   │
│  ├─→ Sentiment analysis             │
│  ├─→ Keywords                       │
│  └─→ Category                       │
│                                     │
│  Step 4: Generate Email             │
│  ├─→ Create subject line            │
│  ├─→ Format body                    │
│  └─→ Save draft                     │
│                                     │
└─────────────────────────────────────┘
    │
    ▼
Update Meeting Record
    │
    ├─→ Status: 'completed'
    ├─→ Save all AI results
    ├─→ Calculate processing time
    │
    ▼
Update User Stats
    │
    ├─→ Increment totalMeetings
    ├─→ Add tasksExtracted
    ├─→ Calculate hoursSaved
    │
    ▼
Return Complete Meeting Data
    │
    ▼
Frontend Updates
    │
    ├─→ Redirect to meeting detail
    ├─→ Display results
    └─→ Update dashboard stats
```

### 3. AI Chat Flow

```
User Asks Question (Frontend)
    │
    ├─→ Enter question in chat interface
    │
    ▼
API Request (POST /api/meeting/:id/chat)
    │
    ├─→ Send question + meeting ID
    │
    ▼
Fetch Meeting Transcript (MongoDB)
    │
    ▼
Send to GPT-4
    │
    ├─→ System prompt: "You are a helpful assistant..."
    ├─→ Context: Full transcript
    ├─→ User question
    │
    ▼
Receive AI Response
    │
    ▼
Return Answer to Frontend
    │
    ▼
Display in Chat Interface
```

### 4. Email Sending Flow

```
User Enters Recipients (Frontend)
    │
    ├─→ Comma-separated emails
    │
    ▼
API Request (POST /api/email/send)
    │
    ├─→ Meeting ID + recipients
    │
    ▼
Fetch Meeting Data (MongoDB)
    │
    ├─→ Get email draft
    │
    ▼
Create Email Transport (Nodemailer)
    │
    ├─→ Gmail SMTP
    ├─→ App password authentication
    │
    ▼
Format Email
    │
    ├─→ HTML template
    ├─→ Plain text fallback
    │
    ▼
Send Email
    │
    ▼
Update User Stats
    │
    ├─→ Increment emailsSent
    │
    ▼
Return Success Response
    │
    ▼
Show Success Toast (Frontend)
```

---

## Component Architecture

### Frontend Component Tree

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Landing
│       │   ├── Navbar
│       │   ├── Hero
│       │   ├── Features
│       │   ├── Testimonials
│       │   └── Footer
│       │
│       ├── Login
│       │   └── LoginForm
│       │
│       ├── Register
│       │   └── RegisterForm
│       │
│       └── PrivateRoute
│           ├── Navbar
│           │
│           ├── Dashboard
│           │   ├── StatsCards
│           │   ├── QuickActions
│           │   └── RecentMeetings
│           │
│           ├── Upload
│           │   ├── DropZone
│           │   └── FilePreview
│           │
│           ├── MeetingDetail
│           │   ├── Header
│           │   ├── InsightsCards
│           │   └── TabPanel
│           │       ├── SummaryTab
│           │       ├── TranscriptTab
│           │       ├── TasksTab
│           │       ├── EmailTab
│           │       └── ChatTab
│           │
│           ├── History
│           │   ├── SearchBar
│           │   ├── FilterButtons
│           │   └── MeetingList
│           │
│           ├── Analytics
│           │   ├── StatsOverview
│           │   ├── MeetingsChart
│           │   └── KeywordsChart
│           │
│           └── Profile
│               ├── StatsCard
│               └── ProfileForm
```

### Backend Module Structure

```
Server (Express)
├── Middleware
│   ├── CORS
│   ├── Body Parser
│   ├── Rate Limiter
│   └── Error Handler
│
├── Routes
│   ├── /api/auth
│   │   ├── POST /register
│   │   ├── POST /login
│   │   ├── GET /me
│   │   └── PUT /profile
│   │
│   ├── /api/meeting
│   │   ├── POST /upload
│   │   ├── POST /process/:id
│   │   ├── GET /history
│   │   ├── GET /analytics
│   │   ├── GET /:id
│   │   ├── DELETE /:id
│   │   ├── POST /:id/chat
│   │   └── PATCH /:id/task/:taskId
│   │
│   └── /api/email
│       └── POST /send
│
├── Controllers
│   ├── authController
│   │   ├── register()
│   │   ├── login()
│   │   ├── getMe()
│   │   └── updateProfile()
│   │
│   ├── meetingController
│   │   ├── uploadMeeting()
│   │   ├── processMeeting()
│   │   ├── getMeetings()
│   │   ├── getMeetingById()
│   │   ├── deleteMeeting()
│   │   ├── chatWithMeeting()
│   │   ├── updateTask()
│   │   └── getAnalytics()
│   │
│   └── emailController
│       └── sendFollowUpEmail()
│
├── Models
│   ├── User
│   │   ├── name
│   │   ├── email
│   │   ├── password (hashed)
│   │   ├── stats
│   │   └── timestamps
│   │
│   └── Meeting
│       ├── user (ref)
│       ├── title
│       ├── file info
│       ├── status
│       ├── transcript
│       ├── summary
│       ├── tasks
│       ├── insights
│       ├── emailDraft
│       ├── metadata
│       └── timestamps
│
└── Middleware
    ├── auth.js (JWT verification)
    └── upload.js (Multer config)
```

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  stats: {
    totalMeetings: Number,
    hoursSaved: Number,
    tasksExtracted: Number,
    emailsSent: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Meetings Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', indexed),
  title: String,
  filename: String,
  filepath: String,
  filesize: Number,
  duration: Number,
  status: String (enum: ['uploaded', 'processing', 'completed', 'failed'], indexed),
  transcript: String,
  summary: {
    executive: String,
    keyPoints: [String],
    decisions: [String],
    risks: [String],
    questions: [String],
    followUp: [String]
  },
  tasks: [{
    task: String,
    assignee: String,
    priority: String (enum: ['low', 'medium', 'high']),
    deadline: String,
    status: String (enum: ['pending', 'completed'])
  }],
  insights: {
    sentiment: String (enum: ['positive', 'neutral', 'negative']),
    tone: String,
    keywords: [String],
    category: String
  },
  speakers: [{
    name: String,
    segments: [String]
  }],
  emailDraft: {
    subject: String,
    body: String
  },
  metadata: {
    language: String,
    processingTime: Number,
    wordCount: Number
  },
  createdAt: Date (indexed),
  updatedAt: Date
}
```

---

## Security Architecture

### Authentication Flow

```
1. User Registration
   ├─→ Password hashed with bcrypt (12 rounds)
   ├─→ Stored in database
   └─→ JWT token generated

2. User Login
   ├─→ Password compared with bcrypt
   ├─→ JWT token generated if match
   └─→ Token sent to client

3. Protected Routes
   ├─→ Client sends token in Authorization header
   ├─→ Server verifies token with JWT secret
   ├─→ User ID extracted from token
   └─→ Request proceeds if valid

4. Token Expiration
   ├─→ Tokens expire after 30 days
   ├─→ User must login again
   └─→ Refresh token flow (future enhancement)
```

### Security Layers

```
┌─────────────────────────────────────┐
│         Input Validation            │
│  • Express-validator                │
│  • File type checking               │
│  • File size limits                 │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Authentication              │
│  • JWT tokens                       │
│  • Password hashing (bcrypt)        │
│  • Protected routes                 │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Rate Limiting               │
│  • 100 requests per 15 minutes      │
│  • Per IP address                   │
│  • Prevents abuse                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         CORS Protection             │
│  • Whitelist client URL             │
│  • Credentials allowed              │
│  • Specific origins only            │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Data Protection             │
│  • Environment variables            │
│  • No sensitive data in code        │
│  • Secure file storage              │
└─────────────────────────────────────┘
```

---

## Deployment Architecture

### Development Environment

```
Local Machine
├── Frontend (localhost:5173)
│   └── Vite Dev Server
│
├── Backend (localhost:5000)
│   └── Nodemon (auto-reload)
│
├── MongoDB Atlas (cloud)
│   └── Development cluster
│
└── OpenAI API (cloud)
    └── Development key
```

### Production Environment

```
┌─────────────────────────────────────┐
│            Vercel CDN               │
│                                     │
│  Frontend (React Build)             │
│  • Static files                     │
│  • Optimized bundles                │
│  • Global CDN                       │
└─────────────────────────────────────┘
              │
              │ HTTPS
              ▼
┌─────────────────────────────────────┐
│         Render/Railway              │
│                                     │
│  Backend (Node.js)                  │
│  • Express server                   │
│  • Environment variables            │
│  • Auto-scaling                     │
└─────────────────────────────────────┘
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
┌──────────────┐ ┌──────────────┐
│   MongoDB    │ │   OpenAI     │
│   Atlas      │ │   API        │
│              │ │              │
│  Production  │ │  Production  │
│  Cluster     │ │  Key         │
└──────────────┘ └──────────────┘
```

---

## Scalability Considerations

### Current Architecture (MVP)

- **Users:** 100-1000 concurrent
- **Meetings:** Unlimited storage
- **Processing:** Sequential (one at a time)
- **Database:** Single cluster

### Future Scaling (Phase 2)

```
┌─────────────────────────────────────┐
│         Load Balancer               │
└─────────────────────────────────────┘
              │
        ┌─────┴─────┬─────────┐
        ▼           ▼         ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Server 1 │ │ Server 2 │ │ Server 3 │
└──────────┘ └──────────┘ └──────────┘
        │           │         │
        └─────┬─────┴─────────┘
              ▼
┌─────────────────────────────────────┐
│         Redis Cache                 │
│  • Session storage                  │
│  • API response cache               │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Message Queue               │
│  • Bull/BullMQ                      │
│  • Background jobs                  │
│  • AI processing queue              │
└─────────────────────────────────────┘
              │
        ┌─────┴─────┐
        ▼           ▼
┌──────────────┐ ┌──────────────┐
│   MongoDB    │ │  Cloudinary  │
│   Cluster    │ │  (Files)     │
│   (Sharded)  │ │              │
└──────────────┘ └──────────────┘
```

---

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Minification

### Backend
- Database indexing
- Query optimization
- Response compression
- Caching (Redis)
- Connection pooling

### AI Processing
- Queue system
- Parallel processing
- Batch operations
- Result caching
- Retry logic

---

**This architecture supports:**
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ Extensibility
