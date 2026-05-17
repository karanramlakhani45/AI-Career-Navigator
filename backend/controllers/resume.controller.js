import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
import ResumeProfile from '../models/ResumeProfile.js';
import User from '../models/User.js';
import { analyzeResumeText } from '../services/ai.service.js';

export const uploadAndParseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileMimeType = req.file.mimetype;
    let parsedText = '';

    if (fileMimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      parsedText = data.text;
    } else {
      const result = await mammoth.extractRawText({ path: filePath });
      parsedText = result.value;
    }

    const user = await User.findByPk(req.user.id);
    if (!user.targetRole) {
      return res.status(400).json({ message: 'Please set a target role before uploading resume' });
    }

    // Call Gemini API for analysis
    let analysis;
    try {
      analysis = await analyzeResumeText(parsedText, user.targetRole);
    } catch (aiError) {
      return res.status(500).json({ message: 'Error analyzing resume with AI' });
    }

    // Save or update profile
    let profile = await ResumeProfile.findOne({ where: { userId: req.user.id } });
    if (profile) {
      profile.originalFileName = req.file.originalname;
      profile.filePath = filePath;
      profile.parsedText = parsedText;
      profile.skills = analysis.skills;
      profile.atsScore = analysis.atsScore;
      profile.missingSkills = analysis.missingSkills;
      profile.feedback = analysis.feedback;
      await profile.save();
    } else {
      profile = await ResumeProfile.create({
        userId: req.user.id,
        originalFileName: req.file.originalname,
        filePath,
        parsedText,
        skills: analysis.skills,
        atsScore: analysis.atsScore,
        missingSkills: analysis.missingSkills,
        feedback: analysis.feedback
      });
    }

    res.status(200).json({
      message: 'Resume analyzed successfully',
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResumeProfile = async (req, res) => {
  try {
    const profile = await ResumeProfile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
