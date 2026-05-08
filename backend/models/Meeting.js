import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task: String,
  assignee: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  deadline: String,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
});

const meetingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  filepath: String,
  filesize: Number,
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded'
  },
  transcript: {
    type: String,
    default: ''
  },
  summary: {
    executive: String,
    keyPoints: [String],
    decisions: [String],
    risks: [String],
    questions: [String],
    followUp: [String]
  },
  tasks: [taskSchema],
  insights: {
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    },
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
    language: { type: String, default: 'en' },
    processingTime: Number,
    wordCount: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
meetingSchema.index({ user: 1, createdAt: -1 });
meetingSchema.index({ status: 1 });

export default mongoose.model('Meeting', meetingSchema);
