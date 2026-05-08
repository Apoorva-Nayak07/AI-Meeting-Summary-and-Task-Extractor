import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, CheckCircle, Trash2, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const History = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMeetings();
  }, [filter]);

  const fetchMeetings = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      
      const res = await axios.get('/meeting/history', { params });
      setMeetings(res.data.data);
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      await axios.delete(`/meeting/${id}`);
      setMeetings(meetings.filter(m => m._id !== id));
      toast.success('Meeting deleted');
    } catch (error) {
      toast.error('Failed to delete meeting');
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(search.toLowerCase()) ||
    meeting.insights?.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Meeting <span className="gradient-text">History</span>
          </h1>
          <p className="text-gray-400 mb-8">View and manage all your meetings</p>

          {/* Filters */}
          <div className="glass rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search meetings..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'completed', 'processing', 'failed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-3 rounded-lg font-medium transition capitalize ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meetings List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No meetings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/meeting/${meeting._id}`}
                    className="block glass rounded-xl p-6 glass-hover transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{meeting.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
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
                          {meeting.insights?.category && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                              {meeting.insights.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                        <button
                          onClick={(e) => handleDelete(meeting._id, e)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {meeting.summary?.executive && (
                      <p className="text-gray-400 line-clamp-2">{meeting.summary.executive}</p>
                    )}

                    {meeting.insights?.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {meeting.insights.keywords.slice(0, 5).map((keyword, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
