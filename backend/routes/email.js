import express from 'express';
import { sendFollowUpEmail } from '../controllers/emailController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', protect, sendFollowUpEmail);

export default router;
