import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

const CV_TARGETS = {
  'index.html': 'CV-Jeremy-Posada.pdf',
  'index2.html': 'CV-Nellis-Zapata.pdf',
  'index3.html': 'CV-Karen-Zapata.pdf',
  'index4.html': 'CV-Karen-Zapata-ATS.pdf'
};

app.get('/export-pdf', async (req, res) => {
  try {
    const requested = (req.query.file || 'index.html').toString();
    if (!Object.prototype.hasOwnProperty.call(CV_TARGETS, requested)) {
      res.status(400).send('Invalid file');
      return;
    }
    const downloadName = CV_TARGETS[requested];

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const filePath = path.join(__dirname, requested);
    const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;

    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Hide UI buttons before printing
    await page.addStyleTag({ content: `.download-button{display:none!important}` });

    // ATS margins handled inside .inner padding (15mm). @page margin must be 0
    // so the 210mm-wide .cv-container fills the A4 page without overflowing.
    await page.addStyleTag({
      content: `
        @page {
          size: A4;
          margin: 0;
        }
        .cv-container {
          max-height: none !important;
          height: auto !important;
          page-break-inside: avoid;
        }
      `
    });

    const pdfData = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate PDF');
  }
});

app.listen(PORT, () => {
  console.log(`PDF server running at http://localhost:${PORT}`);
});
