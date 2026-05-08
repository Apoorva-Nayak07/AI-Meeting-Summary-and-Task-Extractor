import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Mic, Brain, CheckCircle, Mail, TrendingUp, Users, 
  Clock, Zap, Shield, Globe, ArrowRight, Star 
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: 'AI Transcription',
      description: 'Whisper-powered speech-to-text with 95%+ accuracy'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Smart Summaries',
      description: 'GPT-4 generates executive summaries and key insights'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Task Extraction',
      description: 'Automatically identify action items and deadlines'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Auto Follow-ups',
      description: 'Professional email drafts ready to send'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Analytics',
      description: 'Track productivity and meeting insights'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Speaker ID',
      description: 'Identify and track multiple speakers'
    }
  ];

  const stats = [
    { value: '42+', label: 'Hours Saved' },
    { value: '188', label: 'Tasks Extracted' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '1000+', label: 'Smart Teams' }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold gradient-text">AI Meeting Assistant</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition">
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Never Miss a <span className="gradient-text">Decision</span> Again
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Upload meetings. Get transcripts, summaries, tasks & follow-up notes in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 glass rounded-lg text-lg font-semibold glass-hover flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" /> Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass rounded-xl p-6">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powered by <span className="gradient-text">Advanced AI</span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to never miss important details</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-8 glass-hover"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Three simple steps to productivity</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Meeting', desc: 'Drag & drop audio/video files' },
              { step: '02', title: 'AI Processing', desc: 'Transcribe, analyze, extract insights' },
              { step: '03', title: 'Get Results', desc: 'Summary, tasks, and email draft ready' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-6xl font-bold gradient-text mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Smart Teams</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'Product Manager', text: 'Saves me 5+ hours every week. Game changer!' },
              { name: 'Mike Johnson', role: 'Engineering Lead', text: 'Never miss action items anymore. Brilliant!' },
              { name: 'Emily Davis', role: 'Sales Director', text: 'Client meetings are now perfectly documented.' }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-12 text-center gradient-bg"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Transform Your Meetings?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams saving time with AI
            </p>
            <Link 
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Free Today <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">AI Meeting Assistant</span>
          </div>
          <p>© 2024 AI Meeting Assistant. Built with ❤️ for productivity.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
