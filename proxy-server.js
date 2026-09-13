// 本地代理服务器：同时 serve demo 文件 + 代理 /api/chat 到 DeepSeek
// 解决浏览器 CORS 阻止直接调用 DeepSeek API 的问题
// 用法：在本文件目录下运行 `node proxy-server.js`，然后浏览器打开 http://localhost:8768/
// 安全：仅绑定本机回环地址 + 校验 Host 头（防 DNS rebinding）+ 请求体大小限制 + 路径穿越防护

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8768;
// 使用 __dirname 而不是 cwd()：无论从哪个目录启动都能正确找到 demo 文件
const ROOT = path.resolve(__dirname);
const MAX_BODY_BYTES = 2 * 1024 * 1024; // 请求体上限 2MB

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// 只允许本机访问（localhost / 127.0.0.1 / ::1），可选端口
function isLocalHost(hostHeader) {
  if (!hostHeader) return false;
  const h = String(hostHeader).toLowerCase().replace(/:\d+$/, '');
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
}

const server = http.createServer(async (req, res) => {
  // 1) Host 校验：拒绝任何非本机来源（防 DNS rebinding / 局域网滥用）
  if (!isLocalHost(req.headers.host)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden: only localhost access is allowed');
    return;
  }

  // 2) CORS：页面与本代理同源，无需放开；仅当来源是本机时回显 Origin
  const origin = req.headers.origin;
  if (origin && (origin.indexOf('http://localhost') === 0 || origin.indexOf('http://127.0.0.1') === 0)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 3) 代理 /api/chat -> DeepSeek
  if (req.url.startsWith('/api/chat') && req.method === 'POST') {
    let body = '';
    let tooLarge = false;
    req.on('data', chunk => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES && !tooLarge) {
        tooLarge = true;
        res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: { message: 'Request body too large (max 2MB)' } }));
        req.destroy();
      }
    });
    req.on('end', async () => {
      if (tooLarge) return;
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

  // 4) 静态文件（带路径穿越防护）
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400); res.end('Bad request'); return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405); res.end('Method not allowed'); return;
  }
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.resolve(ROOT, '.' + urlPath);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'text/plain; charset=utf-8' });
    res.end(data);
  });
});

// 只绑定回环地址：不暴露到局域网
server.listen(PORT, '127.0.0.1', () => {
  console.log('\n========================================');
  console.log('  写作助手代理服务器已启动');
  console.log('========================================');
  console.log(`\n  浏览器打开:  http://localhost:${PORT}/`);
  console.log(`\n  提供:`);
  console.log(`    - 主程序 (index.html)`);
  console.log(`    - 代理 /api/chat -> DeepSeek API`);
  console.log(`    - 解决浏览器 CORS 阻止调用 DeepSeek 的问题`);
  console.log(`\n  安全:`);
  console.log(`    - 仅绑定 127.0.0.1，拒绝非本机 Host 请求`);
  console.log(`    - 请求体上限 ${MAX_BODY_BYTES} 字节`);
  console.log(`\n  按 Ctrl+C 停止\n`);
});
