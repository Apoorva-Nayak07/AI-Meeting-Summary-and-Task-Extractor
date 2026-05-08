# 🛠️ Setup Guide

## Quick Start

Follow these steps to get the AI Meeting Assistant running locally.

## Prerequisites

Make sure you have these installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **MongoDB** Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **OpenAI** API key ([Get key](https://platform.openai.com/api-keys))
- **Gmail** account (for email features)

## Step 1: Clone & Install

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

## Step 2: MongoDB Atlas Setup

1. **Create Free Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or login
   - Create a new cluster (free tier is fine)

2. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Save username and password

3. **Whitelist IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Step 3: OpenAI API Key

1. **Get API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or login
   - Navigate to API keys section
   - Click "Create new secret key"
   - Copy and save the key securely

2. **Add Credits**
   - Go to Billing
   - Add payment method
   - Add $5-10 for testing

## Step 4: Gmail App Password

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security > 2-Step Verification
   - Enable it

2. **Generate App Password**
   - Go to Security > App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "AI Meeting Assistant"
   - Copy the 16-character password

## Step 5: Backend Configuration

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meeting-assistant
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
OPENAI_API_KEY=sk-your-openai-api-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Important:**
- Replace `username:password` in MONGODB_URI with your MongoDB credentials
- Use a strong random string for JWT_SECRET (at least 32 characters)
- Use your actual OpenAI API key
- Use your Gmail and app password

## Step 6: Frontend Configuration

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 7: Run the Application

### Option 1: Run Everything Together

```bash
# From root directory
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173).

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 8: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Step 9: Test the Application

1. **Register Account**
   - Click "Get Started" or "Sign Up"
   - Enter your details
   - Create account

2. **Upload Test Meeting**
   - Go to "Upload" page
   - Use a short audio file (30 seconds recommended for testing)
   - Supported formats: MP3, WAV, M4A, MP4
   - Click "Upload & Process"

3. **Wait for Processing**
   - Transcription takes ~10-30 seconds
   - AI analysis takes ~20-40 seconds
   - Total: ~1 minute for short files

4. **View Results**
   - Check the meeting summary
   - Review extracted tasks
   - Test the AI chat feature
   - Try sending an email

## Troubleshooting

### Backend Won't Start

**Error: MongoDB connection failed**
```bash
# Check your MONGODB_URI
# Make sure IP is whitelisted
# Verify username/password
```

**Error: OpenAI API key invalid**
```bash
# Verify your API key is correct
# Check if you have credits
# Make sure key starts with 'sk-'
```

### Frontend Won't Start

**Error: Cannot connect to backend**
```bash
# Make sure backend is running on port 5000
# Check VITE_API_URL in frontend/.env
# Verify no CORS errors in browser console
```

### File Upload Issues

**Error: File too large**
```bash
# Max file size is 100MB
# Try a smaller file
```

**Error: Invalid file type**
```bash
# Only audio/video files allowed
# Supported: MP3, WAV, M4A, MP4
```

### AI Processing Fails

**Error: Transcription failed**
```bash
# Check OpenAI API key
# Verify you have credits
# Try a shorter audio file
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes reflect immediately
- Backend: Server restarts on file changes

### Database GUI

Use MongoDB Compass to view your database:
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MONGODB_URI
3. Browse collections and documents

### API Testing

Use tools like Postman or Thunder Client:
- Import the API endpoints
- Test authentication
- Test file uploads
- Test AI processing

### Logs

**Backend logs:**
```bash
cd backend
npm run dev
# Watch console for logs
```

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab
- Check Network tab for API calls

## Project Structure

```
ai-meeting-assistant/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, upload, etc.
│   ├── uploads/         # Uploaded files (auto-created)
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── .env            # Environment variables
│   └── index.html      # HTML template
└── package.json        # Root package file
```

## Next Steps

1. **Customize the UI**
   - Edit colors in `tailwind.config.js`
   - Modify components in `frontend/src/components`

2. **Add Features**
   - Implement speaker diarization
   - Add more AI prompts
   - Create custom analytics

3. **Deploy to Production**
   - Follow `DEPLOYMENT.md` guide
   - Deploy to Vercel + Render
   - Set up monitoring

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review the logs (backend console)
3. Verify all environment variables
4. Test API endpoints individually
5. Check MongoDB connection
6. Verify OpenAI API key and credits

## Common Issues

### Port Already in Use

```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
cd backend && npm install
cd ../frontend && npm install
```

### CORS Errors

Make sure `CLIENT_URL` in backend/.env matches your frontend URL:
```env
CLIENT_URL=http://localhost:5173
```

---

**You're all set! Start building amazing meeting summaries! 🚀**
