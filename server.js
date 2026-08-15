const path = require('path');
const fs = require('fs');

// Multi-path dotenv loader for Hostinger entry point
const possibleEnvPaths = [
  path.resolve(__dirname, '.env.production'),
  path.resolve(__dirname, '.env'),
  path.resolve(process.cwd(), '.env.production'),
  path.resolve(process.cwd(), '.env'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    try {
      require('dotenv').config({ path: envPath });
    } catch (e) {}
  }
}

// Hostinger TCP socket default (127.0.0.1)
const HOSTINGER_MYSQL_URL = 'mysql://u697568943_prospect:Prospect2026@127.0.0.1:3306/u697568943_prospect';

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost') || !process.env.DATABASE_URL.startsWith('mysql')) {
  if (process.env.NODE_ENV === 'production' || process.platform === 'linux') {
    process.env.DATABASE_URL = HOSTINGER_MYSQL_URL;
  }
}

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('@localhost:')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('@localhost:', '@127.0.0.1:');
}

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'https://crm.m-itlevelup.com';
}

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = 'prospect-mada-crm-secret-key-change-in-production';
}

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const appDir = fs.existsSync(path.resolve(__dirname, '.next')) ? __dirname : process.cwd();
const app = next({ dev, dir: appDir });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Server ready and listening on port ${port} (Dir: ${appDir})`);
    });
  })
  .catch((err) => {
    console.error('> Startup error in server.js:', err);
    // Serve fallback diagnostic page instead of crashing with 503
    const server = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Diagnostic CRM Prospect</title><meta charset="utf-8"></head>
        <body style="font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:1.5rem;background:#f8fafc;color:#1e293b;">
          <h2 style="color:#e11d48;margin-top:0;">Démarrage Next.js en cours ou Build requis</h2>
          <p>Le serveur Node.js fonctionne mais Next.js a rencontré un problème d'initialisation :</p>
          <pre style="background:#0f172a;color:#f8fafc;padding:1rem;border-radius:10px;overflow:auto;font-size:12px;">${err.stack || err.message || err}</pre>
          <div style="background:#ffffff;border:1px solid #e2e8f0;padding:1rem;border-radius:10px;margin-top:1rem;">
            <h3 style="margin-top:0;font-size:14px;">Informations Système :</h3>
            <ul style="font-size:12px;line-height:1.8;">
              <li><strong>__dirname :</strong> ${__dirname}</li>
              <li><strong>process.cwd() :</strong> ${process.cwd()}</li>
              <li><strong>NODE_ENV :</strong> ${process.env.NODE_ENV}</li>
              <li><strong>.next dans __dirname :</strong> ${fs.existsSync(path.resolve(__dirname, '.next')) ? 'OUI' : 'NON'}</li>
              <li><strong>.next dans cwd :</strong> ${fs.existsSync(path.resolve(process.cwd(), '.next')) ? 'OUI' : 'NON'}</li>
            </ul>
          </div>
          <p style="margin-top:1rem;font-size:13px;"><strong>Solution :</strong> Rendez-vous sur Hostinger hPanel &gt; Node.js App et cliquez sur <strong>Build</strong> (ou relancez <code>npm run build</code>).</p>
        </body>
        </html>
      `);
    });

    server.listen(port, () => {
      console.log(`> Fallback diagnostic server listening on port ${port}`);
    });
  });
