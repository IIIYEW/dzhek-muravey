import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, avitoUrl, imageUrl } from '../backend/src/providers/avito/core/normalization';
import { Cache, ttl } from '../backend/src/providers/avito/core/cache';

test('unknown, removed and sold states never appear as active', () => {
  for (const status of [undefined, 'removed', 'closed', 'sold', 'unknown'])
    assert.equal(normalize({ id: 123, title: 'Товар', status }), null);
  assert.equal(normalize({ id: 123, status: 'active' })?.id, '123');
});
test('normalizer preserves missing data, rejects unsafe URLs', () => {
  const p = normalize({
    id: 12,
    status: 'active',
    price: -1,
    url: 'javascript:alert(1)',
    images: ['https://example.com/x.jpg'],
  });
  assert.equal(p?.price, undefined);
  assert.equal(p?.url, undefined);
  assert.deepEqual(p?.images, []);
  assert.equal(avitoUrl('https://avito.ru.attacker.com'), undefined);
  assert.equal(imageUrl('http://a.avito.st/x'), undefined);
  assert.ok(avitoUrl('https://www.avito.ru/tomsk/123'));
});
test('TTL rejects unbounded and malformed configuration', () => {
  assert.equal(ttl('NaN'), 600);
  assert.equal(ttl('-1'), 600);
  assert.equal(ttl('300'), 300);
});
test('cache deduplicates calls, refreshes and serves bounded stale data', async () => {
  const cache = new Cache<number>(60, 120);
  let calls = 0;
  const load = async () => ++calls;
  assert.equal((await cache.get(load, 1000)).value, 1);
  assert.equal((await cache.get(load, 2000)).value, 1);
  assert.equal(calls, 1);
  assert.equal((await cache.get(load, 62000)).value, 2);
  const fail = async () => {
    throw Error('offline');
  };
  assert.equal((await cache.get(fail, 123000)).stale, true);
  await assert.rejects(cache.get(fail, 200000));
});
test('simultaneous callers share a single request', async () => {
  const cache = new Cache<number>(60);
  let calls = 0;
  const load = async () => {
    calls++;
    await new Promise((r) => setTimeout(r, 10));
    return 42;
  };
  await Promise.all([cache.get(load), cache.get(load)]);
  assert.equal(calls, 1);
});
