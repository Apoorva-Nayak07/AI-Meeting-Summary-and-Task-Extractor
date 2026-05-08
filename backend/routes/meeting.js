import express from 'express';
import { 
  uploadMeeting, 
  processMeeting, 
  getMeetings, 
  getMeetingById, 
  deleteMeeting,
  chatWithMeeting,
  updateTask,
  getAnalytics
} from '../controllers/meetingController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/upload', upload.single('file'), uploadMeeting);
router.post('/process/:id', processMeeting);
router.get('/history', getMeetings);
router.get('/analytics', getAnalytics);
router.get('/:id', getMeetingById);
router.delete('/:id', deleteMeeting);
router.post('/:id/chat', chatWithMeeting);
router.patch('/:id/task/:taskId', updateTask);

export default router;
