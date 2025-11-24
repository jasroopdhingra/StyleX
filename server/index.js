import { createServer } from 'node:http';

const openaiApiKey = process.env.OPENAI_API_KEY;

const buildPrompt = (userPrompt) => `You are a concise fashion AI. Given the user's description, output a short style brief followed by three outfit bullet points. Keep it under 120 words. User prompt: "${userPrompt}"`;

const sendJson = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  res.end(body);
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    try {
      const raw = Buffer.concat(chunks).toString() || '{}';
      resolve(JSON.parse(raw));
    } catch (error) {
      reject(error);
    }
  });
  req.on('error', reject);
});

const handleGenerateStyle = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    });
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readBody(req);
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string') {
      sendJson(res, 400, { error: 'A prompt string is required.' });
      return;
    }

    if (!openaiApiKey) {
      sendJson(res, 200, {
        response: `AI is offline. Here is a quick inspiration for "${prompt}":\n- Light layers with breathable fabrics\n- Mix one statement piece with everyday basics\n- Add a textured accessory to finish the look`,
        source: 'fallback'
      });
      return;
    }

    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a friendly but concise fashion stylist who returns tight outfit suggestions.' },
          { role: 'user', content: buildPrompt(prompt) }
        ],
        max_tokens: 220,
        temperature: 0.7
      })
    });

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      console.error('OpenAI error:', completionResponse.status, errorText);
      sendJson(res, 502, { error: 'Language model returned an error.' });
      return;
    }

    const json = await completionResponse.json();
    const message = json?.choices?.[0]?.message?.content?.trim();
    if (!message) {
      sendJson(res, 502, { error: 'No response from the language model.' });
      return;
    }

    sendJson(res, 200, { response: message, source: 'openai' });
  } catch (error) {
    console.error('LLM generation failed', error);
    sendJson(res, 500, { error: 'Failed to generate a style response.' });
  }
};

const server = createServer((req, res) => {
  if (req.url === '/api/generate-style') {
    handleGenerateStyle(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = process.env.PORT || 5174;
server.listen(port, () => {
  console.log(`StyleX AI backend listening on port ${port}`);
});
