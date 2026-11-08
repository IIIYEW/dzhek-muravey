import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AvitoProductProvider as AvitoProvider } from '../backend/src/providers/avito/product-provider';

test('offline provider never calls fetch or returns demonstration products', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error('Network must not be used');
  };
  try {
    const provider = new AvitoProvider();
    assert.deepEqual(await provider.getProducts(), {
      products: [],
      source: 'avito',
      sourceAvailable: false,
      error: 'not_configured',
    });
    assert.equal(await provider.getProductById('123'), null);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = original;
  }
});
