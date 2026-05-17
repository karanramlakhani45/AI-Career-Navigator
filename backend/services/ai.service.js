import dotenv from 'dotenv';
dotenv.config();

// We are using @google/genai SDK format (the prompt indicates Gemini)
// But for typical use, let's use the standard generative-ai or @google/genai package.
// Actually @google/genai uses new API. Let's make sure it's valid. Wait, `@google/generative-ai` is often used.
// If we installed `@google/genai`, the import is different. Let's use standard fetch if there's confusion, or assume standard SDK.
// Let's implement basic fetch to Google AI Studio to avoid SDK mismatch.

export const analyzeResumeText = async (resumeText, targetRole) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and technical recruiter.
    Analyze the following resume text for the role of ${targetRole}.
    Extract the candidate's technical and soft skills.
    Compare them against typical requirements for ${targetRole}.
    Calculate an ATS score out of 100 based on skills, keyword match, and format.
    Identify missing skills.
    Provide brief constructive feedback.

    Respond ONLY with a JSON object in this exact format, with no markdown formatting around it:
    {
      "skills": ["skill1", "skill2"],
      "atsScore": 85,
      "missingSkills": ["skill3", "skill4"],
      "feedback": "Your resume is strong in X but lacks Y."
    }

    Resume Text:
    ${resumeText.substring(0, 5000)} // Limiting length to avoid token limits
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    
    // Clean up possible markdown code blocks
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Failed to analyze resume with AI');
  }
};

export const generateRoadmap = async (skills, missingSkills, targetRole) => {
  const prompt = `
    You are an expert career coach. Based on the candidate's current skills and missing skills, generate a 4-week learning roadmap to help them become a ${targetRole}.
    Current Skills: ${skills.join(', ')}
    Missing Skills: ${missingSkills.join(', ')}

    Respond ONLY with a JSON array in this exact format:
    [
      {
        "week": 1,
        "title": "Focus Area",
        "description": "What to learn",
        "resources": ["Link or concept 1", "Link or concept 2"]
      }
    ]
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Failed to generate roadmap with AI');
  }
};
