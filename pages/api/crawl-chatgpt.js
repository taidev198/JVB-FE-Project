import { crawlChatGPT } from '../../services/chatgpt-crawl';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }
  try {
    // You may want to pass credentials here or store them securely
    const email = process.env.CHATGPT_EMAIL || '';
    const password = process.env.CHATGPT_PASSWORD || '';
    const response = await crawlChatGPT(email, password, prompt);
    res.status(200).json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to crawl ChatGPT' });
  }
} 