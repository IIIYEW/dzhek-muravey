import assert from 'node:assert/strict';
const base = process.argv[2] ?? 'http://127.0.0.1:4000';
for (const path of ['/', '/catalog', '/about', '/exchange', '/contacts', '/catalog/123']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  assert.match(await response.text(), /id="root"/, path);
  console.log('SPA entry OK', path);
}
for (const path of ['/missing', '/privacy']) assert.equal((await fetch(base + path)).status, 404);
const health = await fetch(base + '/api/health');
assert.equal(health.status, 200);
assert.equal((await health.json()).catalog.sourceAvailable, false);
for (const path of ['/api/products', '/api/products/123']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).sourceAvailable, false);
}
for (const path of [
  '/favicon.ico',
  '/images/logo/brand-logo.png',
  '/images/shop/appliances-panorama.png',
  '/images/shop/team-and-tools.png',
])
  assert.equal((await fetch(base + path)).status, 200, path);
const html = await (await fetch(base)).text();
const script = html.match(/src="([^"]+\.js)"/);
assert.ok(script);
assert.equal((await fetch(base + script[1])).status, 200);
console.log('API, 404, favicon, images and production JS OK');
