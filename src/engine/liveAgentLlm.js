/**
 * Live LLM Inference Engine for Autonomous Agents
 * Connects to Google Gemini 2.5 Flash via REST API at zero cost (free tier).
 * Dynamically prompts agents based on extracted LinkedIn and Instagram personas.
 */

export class LiveAgentLlmEngine {
  constructor() {
    this.model = 'gemini-2.5-flash';
  }

  getApiKey() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key');
      if (stored && stored.trim().length > 5) return stored.trim();
    }
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  setApiKey(key) {
    if (typeof window !== 'undefined') {
      if (key && key.trim()) {
        localStorage.setItem('gemini_api_key', key.trim());
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    }
  }

  isConfigured() {
    const key = this.getApiKey();
    return Boolean(key && key.length > 15);
  }

  async testConnection(testKey) {
    const key = testKey || this.getApiKey();
    if (!key) return { success: false, error: 'No API key provided' };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${key}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with the word READY' }] }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return { success: false, error: errData.error?.message || `HTTP ${response.status}` };
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      return { success: true, reply };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async generateTurn(speaker, partner, round, roundTitle, conversationHistory = []) {
    const key = this.getApiKey();
    if (!key) {
      throw new Error('No API key configured');
    }

    const speakerName = speaker.name.split(' ')[0];
    const partnerName = partner.name.split(' ')[0];

    const promptContext = `
You are an autonomous AI agent representing ${speaker.name} (${speaker.role}) on a dating simulation.
You are having an authentic speed-date conversation with an agent representing ${partner.name} (${partner.role}).

Your Persona Profile:
- Bio: ${speaker.bio}
- Core Values: ${speaker.values.join(', ')}
- Dealbreakers: ${speaker.dealbreakers.join(', ')}
- Dating Intent: ${speaker.dating_intent}
- Hobbies & Lifestyle: ${speaker.hobbies.join(', ')}
- Conversational Quirks: ${speaker.voice_quirks}

Round Information:
- Current Round: ${round} of 4 (${roundTitle})
${conversationHistory.length > 0 ? `Conversation So Far:\n${conversationHistory.map(h => `${h.speaker}: "${h.text}"`).join('\n')}` : 'You are opening the date.'}

Instructions:
1. Speak strictly in character as ${speakerName}.
2. Keep your response concise (2 to 3 sentences maximum).
3. Do NOT use buzzwords, corporate fluff, or AI clichés. Speak naturally, authentically, and warmly.
4. Reflect your real values and conversational style.
    `.trim();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${key}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptContext }] }],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 180
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    // Clean any surrounding quotation marks
    return rawText.replace(/^["']|["']$/g, '');
  }
}

export const liveLlm = new LiveAgentLlmEngine();
