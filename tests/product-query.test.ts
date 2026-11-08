import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Product } from '../shared/types/product';
import { queryProducts } from '../shared/products/query';

// Isolated fixtures, never imported by the application or provider.
const products: Product[] = [
  {
    id: '1',
    title: 'Ноутбук',
    category: 'Электроника',
    images: [],
    price: 200,
    updatedAt: '2026-01-02',
  },
  { id: '2', title: 'Дрель', category: 'Инструменты', images: [], price: 100 },
  { id: '3', title: 'НОУТБУК без цены', category: 'Электроника', images: [], updatedAt: 'invalid' },
];

test('query combines Russian case-insensitive search and exact category without mutating input', () => {
  assert.deepEqual(
    queryProducts(products, { search: 'ноутбук', category: 'Электроника' }).map(
      (product) => product.id,
    ),
    ['1', '3'],
  );
  assert.deepEqual(queryProducts(products, { search: 'ноутбук', category: 'Инструменты' }), []);
  assert.deepEqual(
    queryProducts(products).map((product) => product.id),
    ['1', '2', '3'],
  );
  assert.deepEqual(queryProducts([]), []);
});

test('query preserves missing-price and invalid-date ordering in all sorting modes', () => {
  assert.deepEqual(
    queryProducts(products, { sort: 'price_asc' }).map((product) => product.id),
    ['2', '1', '3'],
  );
  assert.deepEqual(
    queryProducts(products, { sort: 'price_desc' }).map((product) => product.id),
    ['1', '2', '3'],
  );
  assert.deepEqual(
    queryProducts([...products].reverse(), { sort: 'new' }).map((product) => product.id),
    ['1', '3', '2'],
  );
  assert.deepEqual(
    products.map((product) => product.id),
    ['1', '2', '3'],
  );
});
