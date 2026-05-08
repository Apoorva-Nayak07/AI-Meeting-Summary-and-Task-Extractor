import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put('/auth/profile', formData);
      updateUser(res.data.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Profile</span> Settings
          </h1>
          <p className="text-gray-400 mb-8">Manage your account information</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Stats Card */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{user?.stats?.totalMeetings || 0}</div>
                  <div className="text-sm text-gray-400">Total Meetings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{user?.stats?.hoursSaved || 0}+</div>
                  <div className="text-sm text-gray-400">Hours Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{user?.stats?.tasksExtracted || 0}</div>
                  <div className="text-sm text-gray-400">Tasks Extracted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">{user?.stats?.emailsSent || 0}</div>
                  <div className="text-sm text-gray-400">Emails Sent</div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="md:col-span-2 glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-6">Account Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-blue-300">Your data is encrypted and secure</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
