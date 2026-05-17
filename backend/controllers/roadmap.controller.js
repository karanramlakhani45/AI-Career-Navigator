import Roadmap from '../models/Roadmap.js';
import ResumeProfile from '../models/ResumeProfile.js';
import User from '../models/User.js';
import { generateRoadmap } from '../services/ai.service.js';

export const generateUserRoadmap = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const profile = await ResumeProfile.findOne({ where: { userId: req.user.id } });

    if (!user || !user.targetRole) {
      return res.status(400).json({ message: 'User or target role not found' });
    }

    if (!profile) {
      return res.status(400).json({ message: 'Resume profile not found. Please upload a resume first.' });
    }

    let roadmapData;
    try {
      roadmapData = await generateRoadmap(profile.skills, profile.missingSkills, user.targetRole);
    } catch (aiError) {
      return res.status(500).json({ message: 'Failed to generate roadmap from AI' });
    }

    let existingRoadmap = await Roadmap.findOne({ where: { userId: req.user.id } });
    if (existingRoadmap) {
      existingRoadmap.weeks = roadmapData;
      existingRoadmap.targetRole = user.targetRole;
      await existingRoadmap.save();
      return res.json(existingRoadmap);
    }

    const newRoadmap = await Roadmap.create({
      userId: req.user.id,
      targetRole: user.targetRole,
      weeks: roadmapData
    });

    res.status(201).json(newRoadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ where: { userId: req.user.id } });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
