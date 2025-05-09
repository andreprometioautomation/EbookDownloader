// pages/api/createPdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');
const OUTPUT_PDF_PATH = path.join(process.cwd(), 'output.pdf');

async function createPdfFromScreenshots() {
  const pdfDoc = await PDFDocument.create();
  const files = fs.readdirSync(SCREENSHOT_DIR).filter(file => file.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(SCREENSHOT_DIR, file);
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

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(OUTPUT_PDF_PATH, pdfBytes);
  console.log(`PDF creado en ${OUTPUT_PDF_PATH}`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    await createPdfFromScreenshots();
    res.status(200).json({ message: 'PDF created successfully.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating PDF' });
  }
}