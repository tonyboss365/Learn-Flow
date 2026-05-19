/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { MOCK_COURSES } from '../constants';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';

const getSystemInstruction = () => {
  const courseContext = MOCK_COURSES.map(c => 
    `- ${c.title} ($${c.price}): ${c.description}. Category: ${c.category}. Instructor: ${c.instructor}`
  ).join('\n');

  return `You are the AI Tutor and Assistant for "LearnFlow AI", an elite, personalized educational platform. 
  Your tone is expert, encouraging, clear, and sophisticated, mirroring the brand's aesthetic.
  
  Here is our current course catalog:
  ${courseContext}
  
  Answer student questions about curriculum, learning paths, and course recommendations.
  Keep answers concise and helpful. 
  If asked about topics not related to the courses, gently provide a high-level educational explanation and suggest a relevant course.`;
};

export const sendChatMessage = async (
  history: {role: string, text: string}[], 
  newMessage: string,
  courseContext?: string
): Promise<string> => {
  try {
    let apiKey: string | undefined;
    try {
      apiKey = (import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_API_KEY) as string;
    } catch (e) {
      console.warn("Accessing import.meta.env failed");
    }
    
    if (!apiKey) {
      // Set VITE_OPENROUTER_API_KEY in your .env.local or Vercel environment variables
      apiKey = '';
    }

    const systemPrompt = courseContext 
      ? `${getSystemInstruction()}\n\nYOU ARE CURRENTLY INSTRUCTING IN THE CONTEXT OF THIS SPECIFIC COURSE:\n${courseContext}`
      : getSystemInstruction();

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.text
      })),
      { role: "user", content: newMessage }
    ];

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I apologize, but I am unable to generate a response at this time.";

  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return "I apologize, but I seem to be having trouble reaching our archives at the moment.";
  }
};

export const generateCourseDescription = async (title: string, category: string, level: string): Promise<string> => {
  try {
    let apiKey: string | undefined;
    try {
      apiKey = (import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_API_KEY) as string;
    } catch (e) {
      console.warn("Accessing import.meta.env failed");
    }
    
    if (!apiKey) {
      // Set VITE_OPENROUTER_API_KEY in your .env.local or Vercel environment variables
      apiKey = '';
    }

    const prompt = `Write a compelling, professional, 2-3 paragraph course description for a new course titled "${title}". 
    Category: ${category}. Level: ${level}. 
    Make it engaging and suitable for an elite educational platform. Do not include extra conversational text, just the description.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenRouter Generate Description Error:", error);
    return "";
  }
};
