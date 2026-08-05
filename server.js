const path = require('path');
const fs = require('fs');

// Auto-load env files for Hostinger deployment
const envProd = path.resolve(process.cwd(), '.env.production');
const envLocal = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envProd)) {
  require('dotenv').config({ path: envProd });
} else if (fs.existsSync(envLocal)) {
  require('dotenv').config({ path: envLocal });
}

// Fallback Hostinger MySQL database URL
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('mysql')) {
  if (process.env.NODE_ENV === 'production' || process.platform === 'linux') {
    process.env.DATABASE_URL = 'mysql://u697568943_prospect:Prospect2026@localhost:3306/u697568943_prospect';
  }
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
const app = next({ dev, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
});
