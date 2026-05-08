import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import MeetingDetail from './pages/MeetingDetail';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/upload" element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            } />
            
            <Route path="/meeting/:id" element={
              <PrivateRoute>
                <MeetingDetail />
              </PrivateRoute>
            } />
            
            <Route path="/history" element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } />
            
            <Route path="/analytics" element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
