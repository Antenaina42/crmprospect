const path = require('path');
const fs = require('fs');

// Multi-path dotenv loader for Hostinger entry point
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env.production'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
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
