// pages/api/books.ts
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const BOOKS_FILE = path.join(process.cwd(), 'public/pdfs/books.json');

  try {
    const books = fs.existsSync(BOOKS_FILE)
      ? JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8'))
      : [];
    res.status(200).json({ books });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load books.' });
  }
}
