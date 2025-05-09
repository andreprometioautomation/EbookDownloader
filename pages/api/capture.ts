import { NextApiRequest, NextApiResponse } from 'next';
import { firefox, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';

const PROFILE_PATH = path.join(process.cwd(), 'firefox-profile');
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');
const MAX_PAGES = 100;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { asin } = req.body;
  if (!asin) {
    return res.status(400).json({ message: 'ASIN is required' });
  }

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR);
  }

  let context: BrowserContext | undefined;

  try {
    context = await firefox.launchPersistentContext(PROFILE_PATH, {
      headless: false,
    });

    const [page] = context.pages().length ? context.pages() : [await context.newPage()];

    await page.goto('https://leer.amazon.com.mx/kindle-library', { waitUntil: 'networkidle' });
    res.status(200).json({ message: 'Started capturing the pages' });

    await page.goto(`https://leer.amazon.com.mx/?asin=${asin}`, { waitUntil: 'networkidle' });

    let pageNum = 1;
    let lastContent: string | null = null;
    let noChangeCount = 0;

    while (pageNum <= MAX_PAGES && noChangeCount < 2) {
      const filename = path.join(SCREENSHOT_DIR, `page_${String(pageNum).padStart(2, '0')}.png`);
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`Página ${pageNum} capturada.`);

      const currContent = await page.content();
      if (currContent === lastContent) {
        noChangeCount += 1;
      } else {
        noChangeCount = 0;
      }
      lastContent = currContent;

      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(1200);

      pageNum += 1;
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error capturing pages' });
  } finally {
    if (context) await context.close();
  }
}