const puppeteer = require('puppeteer');

/**
 * Sends a prompt to Gemini and returns the response.
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The generated response
 */
async function crawlGemini(prompt) {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  console.log('Browser launched, opening page...');
  const page = await browser.newPage();
  try {
    console.log('Navigating to Gemini...');
    await page.goto('https://gemini.google.com/app', { waitUntil: 'networkidle2' });

    // Wait for the input box to appear
    await page.waitForSelector('textarea', { timeout: 15000 });

    // Type the prompt and submit
    await page.type('textarea', prompt, { delay: 30 });
    await page.keyboard.press('Enter');

    // Wait for the response to appear (may need to adjust selector if Gemini changes UI)
    await page.waitForSelector('div[data-testid="response-text"]', { timeout: 20000 });

    // Scrape the response
    const response = await page.$eval('div[data-testid="response-text"]', el => el.textContent);

    await new Promise(res => setTimeout(res, 60000)); // Keeps the browser open for 60 seconds
    await browser.close();
    return response.trim();
  } catch (err) {
    console.error('Puppeteer error:', err);
    await browser.close();
    throw err;
  }
}

module.exports = { crawlGemini };

// Example usage
// crawlGemini('Your prompt here').then(console.log);