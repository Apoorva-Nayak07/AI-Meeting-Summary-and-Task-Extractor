import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Clock, Tag } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/meeting/analytics');
      setAnalytics(res.data.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-800 rounded-xl"></div>
            <div className="h-64 bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Analytics</span> Dashboard
          </h1>
          <p className="text-gray-400 mb-8">Track your productivity and meeting insights</p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold">{analytics?.totalMeetings || 0}</div>
                  <div className="text-gray-400 text-sm">Total Meetings</div>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold">{analytics?.completedMeetings || 0}</div>
                  <div className="text-gray-400 text-sm">Completed</div>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold">{analytics?.avgDuration?.toFixed(0) || 0}m</div>
                  <div className="text-gray-400 text-sm">Avg Duration</div>
                </div>
              </div>
            </div>
          </div>

          {/* Meetings Over Time */}
          <div className="glass rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Meetings Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Keywords */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Top Keywords</h2>
            {analytics?.topKeywords?.length > 0 ? (
              <div className="space-y-4">
                {analytics.topKeywords.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 text-gray-300">{item.keyword}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-end pr-3 text-sm font-semibold"
                          style={{ width: `${(item.count / analytics.topKeywords[0].count) * 100}%` }}
                        >
                          {item.count}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No keyword data available yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
