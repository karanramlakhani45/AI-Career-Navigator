import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/chat', protect, async (req, res) => {
  const { message, history } = req.body;
  
  try {
    const prompt = `
      You are an expert AI Career Navigator Chatbot.
      Context history: ${JSON.stringify(history)}
      User Message: ${message}
      
      Provide a helpful, concise career guidance response.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    res.json({ text });
  } catch (error) {
    console.error("Gemini API Error in Chatbot:", error);
    res.status(500).json({ message: 'Failed to get response from AI Chatbot' });
  }
});

export default router;
