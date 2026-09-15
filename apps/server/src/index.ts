import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderPdf } from './pdf-renderer.js';
import { cvSchema } from '@ats-cv/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, version: '0.1.0' });
});

app.post('/api/export-pdf', async (req, res) => {
  const parse = cvSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid CV payload', issues: parse.error.issues });
    return;
  }

  try {
    const pdfBuffer = await renderPdf(parse.data);
    const safeName = (parse.data.personal.fullName || 'cv').replace(/[^\w\-]+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('[pdf]', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

const webDist = path.resolve(__dirname, '../../web/dist/web/browser');
app.use(express.static(webDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(webDist, 'index.html'), (err) => {
    if (err) res.status(404).send('Not found. Run the web app in dev mode at http://localhost:4200');
  });
});

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
});
