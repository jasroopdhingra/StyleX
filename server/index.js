/* eslint-env node */
import { createServer } from 'node:http';

const buildPrompt = (userPrompt) => [
  'You are a concise, upbeat fashion AI copywriter.',
  'Return crisp Markdown with this exact structure:',
  'Style Brief: <one sentence summary>',
  '- Look 1: <12-18 words with pieces and vibe>',
  '- Look 2: <12-18 words with pieces and vibe>',
  '- Look 3: <12-18 words with pieces and vibe>',
  'Keep language modern (think 2024 runways, TikTok street style, emerging designers) and avoid extra paragraphs.',
  `User prompt: "${userPrompt}"`
].join('\n');

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

    const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(buildPrompt(prompt))}`;
    const completionResponse = await fetch(pollinationsUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/plain'
      }
    });

    if (!completionResponse.ok) {
      const errorText = await completionResponse.text();
      console.error('Pollinations error:', completionResponse.status, errorText);
      sendJson(res, 502, { error: 'Language model returned an error.' });
      return;
    }

    const message = (await completionResponse.text()).trim();
    if (!message) {
      sendJson(res, 502, { error: 'No response from the language model.' });
      return;
    }

    sendJson(res, 200, { response: message, source: 'pollinations' });
  } catch (error) {
    console.error('LLM generation failed', error);
    sendJson(res, 500, { error: 'Failed to generate a style response.' });
  }
};

const truncateDataUrl = (value, max = 1800) => {
  if (typeof value !== 'string') return '';
  return value.length > max ? `${value.slice(0, max)}...` : value;
};

const buildDomainLabel = (urlString) => {
  try {
    const hostname = new URL(urlString).hostname.replace(/^www\./, '');
    return hostname;
  } catch (error) {
    console.error('Unable to parse product URL', urlString, error);
    return 'source';
  }
};

const handleSearchProducts = async (req, res) => {
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

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: 'FIRECRAWL_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const body = await readBody(req);
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string') {
      sendJson(res, 400, { error: 'A prompt string is required.' });
      return;
    }

    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query: `${prompt} clothing site:com`,
        pageOptions: { limit: 6 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl search failed', response.status, errorText);
      sendJson(res, 502, { error: 'Product search returned an error.' });
      return;
    }

    const data = await response.json();
    const results = Array.isArray(data?.data)
      ? data.data
          .filter(item => item?.url)
          .map(item => ({
            url: item.url,
            title: item.title || 'View product',
            source: buildDomainLabel(item.url)
          }))
          .slice(0, 6)
      : [];

    if (results.length === 0) {
      sendJson(res, 200, { results: [], source: 'firecrawl' });
      return;
    }

    sendJson(res, 200, { results, source: 'firecrawl' });
  } catch (error) {
    console.error('Firecrawl search exception', error);
    sendJson(res, 500, { error: 'Failed to search for products.' });
  }
};

const handleVirtualTryOn = async (req, res) => {
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
    const userImage = body?.userImage;
    const outfitImage = body?.outfitImage;

    if (!userImage || typeof userImage !== 'string' || !userImage.startsWith('data:image')) {
      sendJson(res, 400, { error: 'A valid user image data URL is required.' });
      return;
    }

    if (!outfitImage || typeof outfitImage !== 'string') {
      sendJson(res, 400, { error: 'A valid outfit image is required.' });
      return;
    }

    const prompt = [
      'Photorealistic fashion virtual try-on.',
      'Use the first reference as the person to dress and the second reference as the outfit.',
      `User reference photo (base64): ${truncateDataUrl(userImage)}`,
      `Outfit reference photo (base64): ${truncateDataUrl(outfitImage)}`,
      'Blend them naturally with accurate lighting, fabric drape, and proportions.',
      'Full body, neutral studio backdrop, cinematic lighting, 4K.'
    ].join(' ');

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&enhance=true&model=flux-realism&width=768&height=1024`;
    const imageResponse = await fetch(pollinationsUrl, { method: 'GET' });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('Pollinations image error:', imageResponse.status, errorText);
      sendJson(res, 502, { error: 'Image model returned an error.' });
      return;
    }

    sendJson(res, 200, { imageUrl: pollinationsUrl, source: 'pollinations' });
  } catch (error) {
    console.error('Virtual try-on failed', error);
    sendJson(res, 500, { error: 'Failed to generate a virtual try-on image.' });
  }
};

const server = createServer((req, res) => {
  if (req.url === '/api/generate-style') {
    handleGenerateStyle(req, res);
    return;
  }

  if (req.url === '/api/virtual-try-on') {
    handleVirtualTryOn(req, res);
    return;
  }

  if (req.url === '/api/search-products') {
    handleSearchProducts(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = process.env.PORT || 5174;
server.listen(port, () => {
  console.log(`Lumi AI backend listening on port ${port}`);
});
