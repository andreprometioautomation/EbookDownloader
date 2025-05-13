import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

async function createPdfFromScreenshots(folderName: string): Promise<string> {
  const screenshotDir = path.join(process.cwd(), 'screenshots', folderName);

  if (!fs.existsSync(screenshotDir)) {
    throw new Error('Screenshot folder does not exist');
  }

  const pdfDoc = await PDFDocument.create();
  const files = fs.readdirSync(screenshotDir)
    .filter(file => file.endsWith('.png'))
    .sort(); // asegúrate que las páginas estén ordenadas

  for (const file of files) {
    const filePath = path.join(screenshotDir, file);
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

  const outputPath = path.join(process.cwd(), 'pdfs');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const outputPdfPath = path.join(outputPath, `${folderName}.pdf`);
  fs.writeFileSync(outputPdfPath, pdfBytes);
  console.log(`PDF creado en ${outputPdfPath}`);

  return outputPdfPath;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { folderName } = req.body;
  if (!folderName) {
    return res.status(400).json({ message: 'folderName is required' });
  }

  try {
    const pdfPath = await createPdfFromScreenshots(folderName);
    res.status(200).json({ message: 'PDF created successfully', pdfPath });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating PDF' });
  }
}
