import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../backend/src/app';
import { AvitoOAuthClient } from '../backend/src/providers/avito/oauth-client';

test('REST health, offline catalog/detail, validation, CORS and unknown API', async () => {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;
  try {
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok', catalog: { sourceAvailable: false } });
    for (const path of ['/api/products', '/api/products/123']) {
      const response = await fetch(`${base}${path}`, {
        headers: { Origin: 'http://localhost:5173' },
      });
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
      const body = await response.json();
      assert.equal(body.sourceAvailable, false);
      assert.equal(JSON.stringify(body).includes('access_token'), false);
    }
    for (const path of [
      '/api/products/invalid',
      '/api/products?limit=0',
      '/api/products?page=-1',
      '/api/products?q=x&q=y',
      '/api/products?unknown=1',
    ])
      assert.equal((await fetch(`${base}${path}`)).status, 400);
    assert.equal((await fetch(`${base}/api/missing`)).status, 404);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('OAuth rejects missing credentials without using transport', async () => {
  let calls = 0;
  const transport: typeof fetch = async () => {
    calls++;
    throw Error('must not run');
  };
  await assert.rejects(
    new AvitoOAuthClient({ clientId: '', clientSecret: '' }, transport).getToken(),
  );
  assert.equal(calls, 0);
});

test('OAuth checks JSON token, caches and refreshes; transport is test-only', async () => {
  let calls = 0;
  const transport: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(url, 'https://api.avito.ru/token');
    assert.equal(init?.method, 'POST');
    return Response.json({ access_token: 'unit-test-token', expires_in: 3600 });
  };
  const client = new AvitoOAuthClient({ clientId: 'unit', clientSecret: 'unit' }, transport);
  await Promise.all([client.getToken(1000), client.getToken(1000)]);
  await client.getToken(2000);
  assert.equal(calls, 1);
  await client.getToken(3600001);
  assert.equal(calls, 2);
  for (const response of [
    Response.json({ error: 'invalid_request' }),
    new Response('blocked', { status: 403 }),
    new Response('offline', { status: 503 }),
  ]) {
    const fail = new AvitoOAuthClient(
      { clientId: 'unit', clientSecret: 'unit' },
      async () => response,
    );
    await assert.rejects(fail.getToken());
  }
});
