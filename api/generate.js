// api/generate.js
export default async function handler(req, res) {
  // Sirf POST request allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { subject, grade, topic, customObj, duration, curriculum, language } = req.body;

  // Vercel environment variable se API key uthayen
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API Key is missing on the server.' });
  }

  // AI Prompt (Wahi jo pehle tha)
  const prompt = `
    You are an expert curriculum developer and educator. 
    Create a highly detailed, structured lesson plan based on these exact parameters:
    - Subject: ${subject}
    - Grade Level: ${grade}
    - Topic: ${topic}
    - Duration: ${duration}
    - Curriculum Framework: ${curriculum}
    - Instruction Language: ${language}
    ${customObj ? `- Custom Objectives: ${customObj}` : ''}

    OUTPUT FORMATTING RULES:
    - Output ONLY valid HTML code. DO NOT wrap it in markdown or \`\`\`html blocks.
    - Use the exact HTML structure provided below.
    - Do NOT include any extra introductory or concluding text. Just the HTML.
    
    REQUIRED HTML STRUCTURE:
    <div class="doc-header">
      <div>
        <h2>${topic}</h2>
        <p class="doc-meta">${subject} • ${grade}</p>
      </div>
      <div class="doc-info">
        <p><strong>Duration:</strong> ${duration}</p>
        <p><strong>Framework:</strong> ${curriculum}</p>
        <p><strong>Language:</strong> ${language}</p>
      </div>
    </div>

    <div class="doc-section">
      <h3>1. Learning Objectives</h3>
      <ul>
        ${customObj ? `<li><strong>Custom Objective:</strong> ${customObj}</li>` : ''}
        <li>Write objective 1 here...</li>
        <li>Write objective 2 here...</li>
      </ul>
    </div>

    <div class="doc-section">
      <h3>2. Materials Required</h3>
      <ul>
        <li>List material 1...</li>
        <li>List material 2...</li>
      </ul>
    </div>

    <div class="doc-section">
      <h3>3. Lesson Procedure</h3>
      <div style="margin-top:16px;">
        <h4>Introduction (Hook) - [Time]</h4>
        <p>Write the introduction activity here...</p>
        
        <h4>Direct Instruction - [Time]</h4>
        <p>Write the direct instruction here...</p>
        
        <h4>Guided Practice - [Time]</h4>
        <p>Write the guided practice here...</p>
        
        <h4>Independent Work - [Time]</h4>
        <p>Write the independent work here...</p>
      </div>
    </div>

    <div class="doc-section" style="margin-bottom:0;">
      <h3>4. Assessment & Homework</h3>
      <ul>
        <li><strong>Formative:</strong> Write assessment here...</li>
        <li><strong>Homework:</strong> Write homework here...</li>
      </ul>
    </div>
  `;

  try {
    // Groq API ko call karein (Server side se, safe hai)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: "You are a professional educational content generator. You only output raw HTML." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 2048,
      })
    });

    if (!response.ok) {
      throw new Error("Groq API error");
    }

    const data = await response.json();
    let aiOutput = data.choices[0].message.content;
    
    // Markdown backticks saaf karein
    aiOutput = aiOutput.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');

    // Frontend ko result bhej dein
    return res.status(200).json({ result: aiOutput });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to generate plan. Please try again.' });
  }
}