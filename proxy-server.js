// 本地代理服务器：同时 serve demo 文件 + 代理 /api/chat 到 DeepSeek
// 解决浏览器 CORS 阻止直接调用 DeepSeek API 的问题
// 用法：在本文件目录下运行 `node proxy-server.js`，然后浏览器打开 http://localhost:8768/

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8768;
const ROOT = process.cwd();

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 代理 /api/chat -> DeepSeek
  if (req.url.startsWith('/api/chat') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const auth = req.headers['authorization'] || '';
        const apiRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
          },
          body: body
        });
        const text = await apiRes.text();
        res.writeHead(apiRes.status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(text);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: e.message } }));
      }
    });
    return;
  }

  // 静态文件
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/writing-coach-demo.html';
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'text/plain; charset=utf-8' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('\n========================================');
  console.log('  写作助手代理服务器已启动');
  console.log('========================================');
  console.log(`\n  浏览器打开:  http://localhost:${PORT}/`);
  console.log(`\n  提供:`);
  console.log(`    - Demo 文件 (writing-coach-demo.html)`);
  console.log(`    - 代理 /api/chat -> DeepSeek API`);
  console.log(`    - 解决浏览器 CORS 阻止调用 DeepSeek 的问题`);
  console.log(`\n  按 Ctrl+C 停止\n`);
});