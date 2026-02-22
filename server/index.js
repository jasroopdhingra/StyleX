/* eslint-env node */
import { createServer } from 'node:http';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

// Curated fashion retailers — Tavily will restrict results to these domains
const INCLUDE_DOMAINS = [
  'aritzia.com', 'everlane.com', 'revolve.com', 'shopbop.com',
  'anthropologie.com', 'madewell.com', 'cos.com', 'arket.com',
  'reiss.com', 'lululemon.com', 'abercrombie.com', 'freepeople.com',
  'urbanoutfitters.com', 'quince.com', 'farfetch.com', 'ssense.com',
  'net-a-porter.com', 'mytheresa.com', 'saks.com', 'bloomingdales.com',
  'zara.com', 'hm.com', 'uniqlo.com', 'gap.com', 'jcrew.com',
  'bananarepublic.com', 'rag-bone.com', 'theory.com', 'vince.com',
];

// Friendly display names for known domains
const RETAILER_NAMES = {
  'hm.com': 'H&M', 'net-a-porter.com': 'Net-a-Porter',
  'jcrew.com': 'J.Crew', 'bananarepublic.com': 'Banana Republic',
  'freepeople.com': 'Free People', 'urbanoutfitters.com': 'Urban Outfitters',
  'abercrombie.com': 'Abercrombie', 'shopbop.com': 'Shopbop',
  'bloomingdales.com': "Bloomingdale's", 'aritzia.com': 'Aritzia',
  'everlane.com': 'Everlane', 'revolve.com': 'Revolve',
  'anthropologie.com': 'Anthropologie', 'madewell.com': 'Madewell',
  'ssense.com': 'SSENSE', 'cos.com': 'COS', 'arket.com': 'ARKET',
  'reiss.com': 'Reiss', 'lululemon.com': 'Lululemon', 'quince.com': 'Quince',
  'farfetch.com': 'Farfetch', 'mytheresa.com': 'Mytheresa', 'saks.com': 'Saks',
  'gap.com': 'Gap', 'zara.com': 'Zara', 'uniqlo.com': 'Uniqlo',
  'rag-bone.com': 'Rag & Bone', 'theory.com': 'Theory', 'vince.com': 'Vince',
};

const fetchWithTimeout = (url, options, ms = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
};

const extractRetailer = (url) => {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const root = hostname.split('.').slice(-2).join('.');
    return RETAILER_NAMES[hostname] || RETAILER_NAMES[root] || (root.split('.')[0].charAt(0).toUpperCase() + root.split('.')[0].slice(1));
  } catch { return ''; }
};

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

// ─── LLM: generate 3 search queries via Gemini Flash ────────────────────────

const buildPromptText = (vibe, profile) => {
  const profileParts = [];
  if (profile?.gender && profile.gender !== 'Prefer not to say') profileParts.push(`gender: ${profile.gender}`);
  if (profile?.age && profile.age !== 'Prefer not to say') profileParts.push(`age: ${profile.age}`);
  if (profile?.aesthetic && profile.aesthetic !== 'Prefer not to say') profileParts.push(`aesthetic: ${profile.aesthetic}`);
  const profileContext = profileParts.length > 0 ? ` The shopper is: ${profileParts.join(', ')}.` : '';

  return `You are a fashion stylist.${profileContext} Generate exactly 3 short clothing product search queries (3–6 words each) for items that match this style vibe: "${vibe}". Each query should target a different piece (e.g. top, bottom, outerwear or shoes). Tailor results to the shopper's profile if provided. Return a JSON object with a single key "queries" containing an array of 3 strings.`;
};

const generateSearchQueries = async (vibe, profile) => {
  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a fashion stylist. Always respond with a JSON object containing a single key "queries" whose value is an array of exactly 3 strings. No other text.'
        },
        {
          role: 'user',
          content: buildPromptText(vibe, profile)
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 150
    })
  }, 8000);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';
  console.log('Groq:', content);

  const parsed = JSON.parse(content);
  const queries = parsed?.queries || Object.values(parsed).find(v => Array.isArray(v)) || [];
  if (queries.length === 0) throw new Error('No queries from Groq');
  return queries.slice(0, 3);
};

// ─── Tavily: find one product per query ─────────────────────────────────────

const searchProduct = async (query) => {
  const res = await fetchWithTimeout('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      query,
      search_depth: 'basic',
      max_results: 5,
      include_domains: INCLUDE_DOMAINS,
      country: 'united states',
    })
  }, 10000);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Tavily ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const results = data?.results || [];
  if (results.length === 0) return null;

  // Tavily already ranks by relevance — take the top result
  const best = results[0];

  return {
    title: best.title.replace(/\s*[-|–—].*$/, '').trim(),
    retailer: extractRetailer(best.url),
    url: best.url,
    description: (best.content || '').slice(0, 200).trim()
  };
};

// ─── HTTP plumbing ───────────────────────────────────────────────────────────

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  res.end(JSON.stringify(payload));
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); }
    catch (e) { reject(e); }
  });
  req.on('error', reject);
});

const handleMatchProducts = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' });
    res.end();
    return;
  }
  if (req.method !== 'POST') { sendJson(res, 405, { error: 'Method not allowed' }); return; }
  if (!TAVILY_API_KEY) { sendJson(res, 500, { error: 'TAVILY_API_KEY is not configured.' }); return; }

  try {
    const body = await readBody(req);
    const vibe = body?.vibe?.trim();
    const profile = body?.profile || null;
    if (!vibe) { sendJson(res, 400, { error: 'A vibe is required.' }); return; }

    console.log('\n— Vibe:', vibe, '| Profile:', profile);
    const start = Date.now();

    // Retry once if LLM times out
    let queries;
    try {
      queries = await generateSearchQueries(vibe, profile);
    } catch (err) {
      console.warn('LLM retry:', err.message);
      queries = await generateSearchQueries(vibe, profile);
    }
    console.log('Queries:', queries);

    const results = await Promise.all(
      queries.map(q =>
        searchProduct(q).catch(err => {
          console.error(`[${q}]:`, err.message);
          return null;
        })
      )
    );

    const products = results.filter(Boolean);
    console.log(`Done in ${Date.now() - start}ms — ${products.length} products`);

    if (products.length === 0) {
      sendJson(res, 502, { error: 'No products found. Try rephrasing your search.' });
      return;
    }

    sendJson(res, 200, { products });
  } catch (err) {
    console.error('Error:', err.message);
    sendJson(res, 500, { error: err.message || 'Something went wrong.' });
  }
};

const server = createServer((req, res) => {
  if (req.url === '/api/match-products') { handleMatchProducts(req, res); return; }
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = process.env.PORT || 5174;
server.listen(port, () => console.log(`Lumi backend on :${port}`));
