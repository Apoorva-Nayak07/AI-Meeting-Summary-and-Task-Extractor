import nodemailer from 'nodemailer';
import Meeting from '../models/Meeting.js';
import User from '../models/User.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @desc    Send follow-up email
// @route   POST /api/email/send
export const sendFollowUpEmail = async (req, res) => {
  try {
    const { meetingId, recipients, customMessage } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one recipient'
      });
    }

    const meeting = await Meeting.findById(meetingId);

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

    const transporter = createTransporter();

    const emailBody = customMessage || meeting.emailDraft.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: meeting.emailDraft.subject,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${meeting.title}</h2>
          <div style="white-space: pre-wrap; line-height: 1.6;">
            ${emailBody.replace(/\n/g, '<br>')}
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Sent via AI Meeting Assistant
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.emailsSent': 1 }
    });

    res.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
