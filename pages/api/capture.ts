// pages/api/screenshots.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { firefox, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

const PROFILE_PATH = path.join(process.cwd(), 'firefox-profile');
const SCREENSHOT_ROOT = path.join(process.cwd(), 'screenshots');
const MAX_PAGES = 100;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { asin } = req.body;
  if (!asin) {
    return res.status(400).json({ message: 'ASIN is required' });
  }

  // Crear directorio raíz si no existe
  if (!fs.existsSync(SCREENSHOT_ROOT)) {
    fs.mkdirSync(SCREENSHOT_ROOT);
  }

  // Crear carpeta única para esta sesión
  const requestId = uuidv4();
  const sessionDir = path.join(SCREENSHOT_ROOT, requestId);
  fs.mkdirSync(sessionDir);

  let context: BrowserContext | undefined;

  try {
    context = await firefox.launchPersistentContext(PROFILE_PATH, {
      headless: false,
    });

    const [page] = context.pages().length ? context.pages() : [await context.newPage()];

    await page.goto('https://leer.amazon.com.mx/kindle-library', { waitUntil: 'networkidle' });
    res.status(200).json({ message: 'Started capturing the pages', requestId }); // Devuelve requestId

    await page.goto(`https://leer.amazon.com.mx/?asin=${asin}`, { waitUntil: 'networkidle' });

    let pageNum = 1;
    let lastContent: string | null = null;
    let noChangeCount = 0;

    while (pageNum <= MAX_PAGES && noChangeCount < 2) {
      const filename = path.join(sessionDir, `page_${String(pageNum).padStart(2, '0')}.png`);
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`Página ${pageNum} capturada en ${filename}`);

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
