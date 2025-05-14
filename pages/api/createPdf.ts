import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const SCREENSHOT_ROOT = path.join(process.cwd(), 'screenshots');
const OUTPUT_DIR = path.join(process.cwd(), 'output-pdfs');

// Asegura que el directorio de salida exista
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
}

// Genera el PDF desde la carpeta de screenshots específica
async function createPdfFromScreenshots(requestId: string): Promise<string> {
  const sessionDir = path.join(SCREENSHOT_ROOT, requestId);

  if (!fs.existsSync(sessionDir)) {
    throw new Error(`Screenshot folder for requestId "${requestId}" not found.`);
  }

  const pdfDoc = await PDFDocument.create();
  const files = fs
    .readdirSync(sessionDir)
    .filter(file => file.endsWith('.png'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No screenshots found in "${sessionDir}".`);
  }

  for (const file of files) {
    const filePath = path.join(sessionDir, file);
    const imageBytes = fs.readFileSync(filePath);

    const image = await pdfDoc.embedPng(imageBytes);
    const page = pdfDoc.addPage([image.width, image.height]);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFileName = `book-${requestId}-${timestamp}.pdf`;
  const outputFilePath = path.join(OUTPUT_DIR, outputFileName);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, pdfBytes);
  console.log(`✅ PDF creado en ${outputFilePath}`);

  return `/output-pdfs/${outputFileName}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { requestId } = req.body;
  if (!requestId) {
    return res.status(400).json({ message: 'Missing requestId in request body.' });
  }

  try {
    ensureOutputDir();
    const pdfPath = await createPdfFromScreenshots(requestId);
    res.status(200).json({ message: 'PDF created successfully.', pdfPath });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating PDF', error: e });
  }
}
