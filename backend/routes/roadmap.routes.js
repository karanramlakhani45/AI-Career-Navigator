import express from 'express';
import { generateUserRoadmap, getRoadmap } from '../controllers/roadmap.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, generateUserRoadmap);
router.get('/', protect, getRoadmap);

export default router;
