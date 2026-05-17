import express from 'express';
import { uploadAndParseResume, getResumeProfile } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('resume'), uploadAndParseResume);
router.get('/profile', protect, getResumeProfile);

export default router;
