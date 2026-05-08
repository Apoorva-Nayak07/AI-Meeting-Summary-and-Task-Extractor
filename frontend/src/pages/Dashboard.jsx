import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, Clock, CheckCircle, Mail, TrendingUp, 
  FileText, ArrowRight, Calendar 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentMeetings();
  }, []);

  const fetchRecentMeetings = async () => {
    try {
      const res = await axios.get('/meeting/history?sort=-createdAt');
      setMeetings(res.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: <FileText className="w-8 h-8" />,
      label: 'Total Meetings',
      value: user?.stats?.totalMeetings || 0,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      label: 'Hours Saved',
      value: `${user?.stats?.hoursSaved || 0}+`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      label: 'Tasks Extracted',
      value: user?.stats?.tasksExtracted || 0,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      label: 'Emails Sent',
      value: user?.stats?.emailsSent || 0,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10';
      case 'processing': return 'text-yellow-400 bg-yellow-500/10';
      case 'failed': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-gray-400">Here's what's happening with your meetings</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/upload"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
            >
              <Upload className="w-6 h-6" />
              <div>
                <div className="font-semibold">Upload Meeting</div>
                <div className="text-sm opacity-90">Process new recording</div>
              </div>
            </Link>
            
            <Link
              to="/history"
              className="flex items-center gap-3 p-4 glass-hover rounded-lg border border-white/10"
            >
              <Calendar className="w-6 h-6" />
              <div>
                <div className="font-semibold">View History</div>
                <div className="text-sm text-gray-400">All meetings</div>
              </div>
            </Link>
            
            <Link
              to="/analytics"
              className="flex items-center gap-3 p-4 glass-hover rounded-lg border border-white/10"
            >
              <TrendingUp className="w-6 h-6" />
              <div>
                <div className="font-semibold">Analytics</div>
                <div className="text-sm text-gray-400">View insights</div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Meetings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Meetings</h2>
            <Link to="/history" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-800 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No meetings yet</p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                <Upload className="w-5 h-5" />
                Upload Your First Meeting
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <Link
                  key={meeting._id}
                  to={`/meeting/${meeting._id}`}
                  className="block p-4 glass-hover rounded-lg border border-white/10 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{meeting.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(meeting.createdAt), 'MMM dd, yyyy')}
                    </span>
                    {meeting.tasks?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {meeting.tasks.length} tasks
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
