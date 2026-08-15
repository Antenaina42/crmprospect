const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in server.js:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in server.js:', reason);
});

// Multi-path dotenv loader for Hostinger entry point
const possibleEnvPaths = [
  path.resolve(__dirname, '.env.production'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '.env.local'),
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

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

let isPrepared = false;
let prepareError = null;

const preparePromise = app
  .prepare()
  .then(() => {
    isPrepared = true;
    console.log('> Next.js app prepared successfully');
  })
  .catch((err) => {
    prepareError = err;
    console.error('> Error during app.prepare():', err);
  });

// Immediate server binding to avoid Passenger 503 timeout on startup
const server = createServer(async (req, res) => {
  try {
    if (!isPrepared) {
      if (prepareError) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(`<!DOCTYPE html><html><head><title>Initialisation CRM</title><meta charset="utf-8"></head><body style="font-family:sans-serif;padding:2rem;"><h2>Initialisation du CRM Prospect M-It LevelUp</h2><p>Le serveur est en train de se préparer ou nécessite une compilation (Build).</p><pre style="background:#f1f5f9;padding:1rem;border-radius:8px;overflow:auto;">${prepareError.stack || prepareError.message || prepareError}</pre></body></html>`);
        return;
      }
      await preparePromise;
    }
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  } catch (err) {
    console.error('Error handling request:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;"><h2>Erreur Interne du Serveur</h2><pre style="background:#f1f5f9;padding:1rem;border-radius:8px;">${err.stack || err.message || err}</pre></body></html>`);
  }
});

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Server listening immediately on port ${port} (PID: ${process.pid})`);
});
