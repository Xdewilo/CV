import puppeteer, { type Browser } from 'puppeteer';
import type { CV } from '@ats-cv/schema';
import { renderHtml } from '@ats-cv/templates';

let browserPromise: Promise<Browser> | null = null;

const getBrowser = () => {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserPromise;
};

export const renderPdf = async (cv: CV): Promise<Buffer> => {
  const html = renderHtml(cv);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '8mm', right: '12mm', bottom: '8mm', left: '12mm' },
      preferCSSPageSize: true,
    });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
};

const shutdown = async () => {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close().catch(() => undefined);
  }
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
