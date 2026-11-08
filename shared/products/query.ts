import type { Product } from '../types/product.js';

export type ProductSort = 'default' | 'price_asc' | 'price_desc' | 'new';

/** Возвращает новый массив: сортировка не изменяет исходные данные провайдера. */
export function queryProducts(
  products: Product[],
  {
    search = '',
    category = '',
    sort = 'default',
  }: {
    search?: string;
    category?: string;
    sort?: ProductSort;
  } = {},
): Product[] {
  const items = products.filter(
    (product) =>
      product.title.toLocaleLowerCase('ru').includes(search.toLocaleLowerCase('ru')) &&
      (!category || product.category === category),
  );

  return items.sort((first, second) => {
    if (sort === 'price_asc') return (first.price ?? Infinity) - (second.price ?? Infinity);
    if (sort === 'price_desc') return (second.price ?? -1) - (first.price ?? -1);
    if (sort === 'new') {
      return (Date.parse(second.updatedAt ?? '') || 0) - (Date.parse(first.updatedAt ?? '') || 0);
    }
    return 0;
  });
}
