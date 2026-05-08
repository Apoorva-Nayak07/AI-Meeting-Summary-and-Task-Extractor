import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, CheckCircle, Mail, MessageSquare, Download, 
  Copy, Trash2, Send, Loader, Calendar, Clock 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MeetingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatAnswer, setChatAnswer] = useState('');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const fetchMeeting = async () => {
    try {
      const res = await axios.get(`/meeting/${id}`);
      setMeeting(res.data.data);
    } catch (error) {
      toast.error('Failed to load meeting');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      await axios.delete(`/meeting/${id}`);
      toast.success('Meeting deleted');
      navigate('/history');
    } catch (error) {
      toast.error('Failed to delete meeting');
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    setChatLoading(true);
    try {
      const res = await axios.post(`/meeting/${id}/chat`, {
        question: chatQuestion
      });
      setChatAnswer(res.data.data.answer);
    } catch (error) {
      toast.error('Failed to get answer');
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailRecipients.trim()) {
      toast.error('Please enter recipient emails');
      return;
    }

    setSendingEmail(true);
    try {
      await axios.post('/email/send', {
        meetingId: id,
        recipients: emailRecipients.split(',').map(e => e.trim())
      });
      toast.success('Email sent successfully!');
      setEmailRecipients('');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'transcript', label: 'Transcript', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'email', label: 'Email Draft', icon: <Mail className="w-4 h-4" /> },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{meeting.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(meeting.createdAt), 'MMM dd, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {meeting.metadata?.processingTime ? `${(meeting.metadata.processingTime / 1000).toFixed(1)}s` : 'N/A'}
                </span>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Sentiment</div>
              <div className="font-semibold capitalize">{meeting.insights?.sentiment || 'N/A'}</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Category</div>
              <div className="font-semibold">{meeting.insights?.category || 'N/A'}</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Word Count</div>
              <div className="font-semibold">{meeting.metadata?.wordCount || 0}</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Tasks</div>
              <div className="font-semibold">{meeting.tasks?.length || 0}</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex overflow-x-auto border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">Executive Summary</h3>
                    <button
                      onClick={() => handleCopy(meeting.summary?.executive || '')}
                      className="p-2 hover:bg-white/5 rounded-lg transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{meeting.summary?.executive}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {meeting.summary?.keyPoints?.map((point, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Decisions Made</h3>
                  <ul className="space-y-2">
                    {meeting.summary?.decisions?.map((decision, i) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{decision}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {meeting.insights?.keywords?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {meeting.insights.keywords.map((keyword, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Transcript Tab */}
            {activeTab === 'transcript' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Full Transcript</h3>
                  <button
                    onClick={() => handleCopy(meeting.transcript)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{meeting.transcript}</p>
                </div>
              </motion.div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {meeting.tasks?.map((task, i) => (
                  <div key={i} className="glass rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{task.task}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>👤 {task.assignee}</span>
                      <span>📅 {task.deadline}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={meeting.emailDraft?.subject}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Body</label>
                  <textarea
                    value={meeting.emailDraft?.body}
                    readOnly
                    rows={12}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Recipients (comma-separated)</label>
                  <input
                    type="text"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sendingEmail ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </motion.div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                  <p className="text-gray-400 text-sm">Ask questions about this meeting transcript</p>
                </div>
                
                <form onSubmit={handleChat} className="space-y-4">
                  <textarea
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    placeholder="e.g., What deadline was discussed? Who is responsible for the marketing campaign?"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {chatLoading ? <Loader className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                    {chatLoading ? 'Thinking...' : 'Ask AI'}
                  </button>
                </form>

                {chatAnswer && (
                  <div className="glass rounded-lg p-6">
                    <h4 className="font-semibold mb-2">Answer:</h4>
                    <p className="text-gray-300 leading-relaxed">{chatAnswer}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetail;
