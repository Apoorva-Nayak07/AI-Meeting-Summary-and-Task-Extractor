import Meeting from '../models/Meeting.js';
import User from '../models/User.js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Lazy initialization of OpenAI client
let openai = null;
const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

// @desc    Upload meeting file
// @route   POST /api/meeting/upload
export const uploadMeeting = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { title } = req.body;

    const meeting = await Meeting.create({
      user: req.user.id,
      title: title || req.file.originalname,
      filename: req.file.originalname,
      filepath: req.file.path,
      filesize: req.file.size,
      status: 'uploaded'
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.totalMeetings': 1 }
    });

    res.status(201).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process meeting with AI
// @route   POST /api/meeting/process/:id
export const processMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update status to processing
    meeting.status = 'processing';
    await meeting.save();

    const startTime = Date.now();

    try {
      const openaiClient = getOpenAI();
      if (!openaiClient) {
        throw new Error('OpenAI API key not configured');
      }

      // Step 1: Transcribe audio using Whisper
      const transcription = await openaiClient.audio.transcriptions.create({
        file: fs.createReadStream(meeting.filepath),
        model: 'whisper-1',
        language: 'en'
      });

      meeting.transcript = transcription.text;
      meeting.metadata.wordCount = transcription.text.split(' ').length;

      // Step 2: Generate AI summary and insights
      const prompt = `Analyze this meeting transcript and provide:
1. Executive Summary (2-3 sentences)
2. Key Points (bullet list)
3. Decisions Made (list)
4. Risks Discussed (list)
5. Action Items with assignees and deadlines (structured format)
6. Unanswered Questions (list)
7. Follow-up Suggestions (list)
8. Overall Sentiment (positive/neutral/negative)
9. Meeting Tone
10. Keywords (comma-separated)
11. Category (e.g., Sales, Engineering, HR, Strategy)

Transcript:
${transcription.text}

Provide response in JSON format.`;

      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert meeting analyst. Provide structured, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });

      const analysis = JSON.parse(completion.choices[0].message.content);

      // Update meeting with AI analysis
      meeting.summary = {
        executive: analysis.executiveSummary || '',
        keyPoints: analysis.keyPoints || [],
        decisions: analysis.decisions || [],
        risks: analysis.risks || [],
        questions: analysis.questions || [],
        followUp: analysis.followUp || []
      };

      meeting.tasks = (analysis.actionItems || []).map(item => ({
        task: item.task || item,
        assignee: item.assignee || 'Unassigned',
        priority: item.priority || 'medium',
        deadline: item.deadline || 'TBD',
        status: 'pending'
      }));

      meeting.insights = {
        sentiment: analysis.sentiment?.toLowerCase() || 'neutral',
        tone: analysis.tone || 'Professional',
        keywords: analysis.keywords?.split(',').map(k => k.trim()) || [],
        category: analysis.category || 'General'
      };

      // Generate email draft
      meeting.emailDraft = {
        subject: `Meeting Summary – ${meeting.title} – ${new Date().toLocaleDateString()}`,
        body: generateEmailBody(meeting)
      };

      meeting.status = 'completed';
      meeting.metadata.processingTime = Date.now() - startTime;

      await meeting.save();

      // Update user stats
      const tasksCount = meeting.tasks.length;
      const hoursSaved = Math.round(meeting.metadata.wordCount / 150 / 60 * 10) / 10; // Estimate

      await User.findByIdAndUpdate(req.user.id, {
        $inc: {
          'stats.tasksExtracted': tasksCount,
          'stats.hoursSaved': hoursSaved
        }
      });

      res.json({
        success: true,
        data: meeting
      });

    } catch (aiError) {
      meeting.status = 'failed';
      await meeting.save();
      
      throw new Error(`AI processing failed: ${aiError.message}`);
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to generate email body
const generateEmailBody = (meeting) => {
  return `Hi Team,

Thank you for attending the meeting on ${meeting.title}.

EXECUTIVE SUMMARY:
${meeting.summary.executive}

KEY DECISIONS:
${meeting.summary.decisions.map((d, i) => `${i + 1}. ${d}`).join('\n')}

ACTION ITEMS:
${meeting.tasks.map((t, i) => `${i + 1}. ${t.task} - ${t.assignee} (Due: ${t.deadline})`).join('\n')}

NEXT STEPS:
${meeting.summary.followUp.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Please review and let me know if you have any questions.

Best regards`;
};

// @desc    Get all meetings for user
// @route   GET /api/meeting/history
export const getMeetings = async (req, res) => {
  try {
    const { status, search, sort = '-createdAt' } = req.query;
    
    const query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'insights.keywords': { $regex: search, $options: 'i' } }
      ];
    }

    const meetings = await Meeting.find(query)
      .sort(sort)
      .select('-transcript'); // Exclude large transcript field

    res.json({
      success: true,
      count: meetings.length,
      data: meetings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single meeting
// @route   GET /api/meeting/:id
export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete meeting
// @route   DELETE /api/meeting/:id
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Delete file from filesystem
    if (meeting.filepath && fs.existsSync(meeting.filepath)) {
      fs.unlinkSync(meeting.filepath);
    }

    await meeting.deleteOne();

    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Chat with meeting transcript
// @route   POST /api/meeting/:id/chat
export const chatWithMeeting = async (req, res) => {
  try {
    const { question } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    if (meeting.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const openaiClient = getOpenAI();
    if (!openaiClient) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API not configured'
      });
    }

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that answers questions about meeting transcripts. Here is the transcript:\n\n${meeting.transcript}`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7
    });

    res.json({
      success: true,
      data: {
        answer: completion.choices[0].message.content
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task status
// @route   PATCH /api/meeting/:id/task/:taskId
export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const task = meeting.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.status = status;
    await meeting.save();

    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/meeting/analytics
export const getAnalytics = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user.id });
    
    // Calculate analytics
    const totalMeetings = meetings.length;
    const completedMeetings = meetings.filter(m => m.status === 'completed').length;
    
    // Meetings per month (last 6 months)
    const monthlyData = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = 0;
    }

    meetings.forEach(meeting => {
      const monthKey = new Date(meeting.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey]++;
      }
    });

    // Common keywords
    const keywordCount = {};
    meetings.forEach(meeting => {
      meeting.insights?.keywords?.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });

    const topKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    res.json({
      success: true,
      data: {
        totalMeetings,
        completedMeetings,
        monthlyData: Object.entries(monthlyData).map(([month, count]) => ({ month, count })),
        topKeywords,
        avgDuration: meetings.reduce((sum, m) => sum + (m.duration || 0), 0) / totalMeetings || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
