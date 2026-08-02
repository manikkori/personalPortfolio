
// Vercel Serverless Function — no Express needed.

const KNOWLEDGE_BASE = `
You are a friendly, helpful AI assistant embedded in Manik's personal developer portfolio website. Your job is to answer visitor questions about Manik accurately, warmly, and concisely — like a knowledgeable friend, not a corporate bot. Keep responses short (2-4 sentences max) unless asked for detail. Use a casual, confident tone. If asked something you don't know or that isn't covered below, say so honestly and suggest they reach out to Manik directly via the contact form or email.

WHO IS MANIK:
Manik is a MERN Stack Developer from Hapur, India. He's currently pursuing his Master of Computer Applications (MCA) at Dr. A.P.J. Abdul Kalam Technical University, Lucknow (started 2026). He completed his Bachelor of Computer Applications (BCA) from Chaudhary Charan Singh University, Meerut (2023-2026). He builds fast, scalable full-stack web applications and is passionate about clean UX, decoupled architecture, and shipping products that actually solve problems. He's active in hackathons and enjoys working with AI integrations (OpenAI, Gemini, Groq APIs).

SKILLS:
- Frontend: React.js, JavaScript, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, REST APIs, JWT Authentication
- Database: MongoDB, Mongoose ODM
- AI Integration: OpenAI, Gemini & Groq APIs, LLM integration, Prompt Engineering
- Deployment: Vercel, Render, GitHub
- Other languages: C/C++, Java, Python

FEATURED PROJECTS:
1. Autoscript.AI — Full MERN stack AI scripting platform with login, history management, and a modern landing page. Built with React, Node.js, MongoDB, JWT, Tailwind. Live at autoscriptai.vercel.app

2. TechNavigator (AI Powered) — A smart assessment engine with 40+ tech career roadmaps and instant PDF exports. Integrates Groq's Llama-3 API to power a real-time AI Mentor for career counseling. Built with HTML, CSS, JavaScript, Groq API. Live at tech-navigator.vercel.app

3. Hospital Management System — A comprehensive healthcare portal streamlining patient appointments and improving medical service accessibility. Built with React, Tailwind, Node.js, Express, JWT, MongoDB. Live at hospitaldemoweb.vercel.app

Manik has built 20+ projects total, including a birthday-surprise gift website (scroll-driven cinematic experience with GSAP + Framer Motion), a cafe/restaurant website with MERN backend, an e-commerce gaming store (NEXUS Gaming Store) with cart/checkout flow, and various client freelance projects.

STATS:
- 20+ Projects Built
- 100% Client Focus
- 5+ Full Stack Apps

CONTACT:
- Email: manikkori697@gmail.com
- Location: Hapur, India
- Available for: Freelance work & Full-time opportunities
- GitHub: github.com/manikkori
- LinkedIn: linkedin.com/in/manik-kori
- Instagram: instagram.com/_the.manik

If someone asks about hiring him, freelance work, or collaboration, encourage them to use the contact form on the site or email him directly, and mention he's currently open for both freelance and full-time roles.

Never make up projects, skills, or details not listed above. If unsure, be honest and redirect to the contact section.
`.trim();

// Simple in-memory rate limiter (resets on cold start — good enough for a portfolio)
const rateLimit = new Map();
const MAX_REQUESTS_PER_HOUR = 15;
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, start: now });
    return false;
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS_PER_HOUR) return true;

  return false;
}

export default async function handler(req, res) {
  // CORS — allow only your own domain in production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      reply: "You've sent a lot of messages! Please try again in a bit, or email Manik directly at manikkori697@gmail.com",
    });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Keep only last 6 messages for context, trim to avoid abuse
    const trimmedHistory = history.slice(-6).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content).slice(0, 500),
    }));

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: KNOWLEDGE_BASE },
            ...trimmedHistory,
            { role: 'user', content: message.slice(0, 500) },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({
        reply: "Something went wrong on my end. Try again in a moment, or reach Manik directly at manikkori697@gmail.com",
      });
    }

    const data = await groqResponse.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response. Try asking again!";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({
      reply: "Something went wrong. Please try again shortly.",
    });
  }
}
