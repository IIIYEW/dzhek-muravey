import { avitoProvider } from '../providers/avito/product-provider.js';
import { Cache } from '../providers/avito/core/cache.js';
import type { ProductsResult } from '../providers/product-provider.js';

// Кеш общий для REST-маршрутов: повторные запросы не создают лишнюю нагрузку на источник.
// #TODO(Avito): после подключения согласовать срок кеша с частотой обновления объявлений.
const catalog = new Cache<ProductsResult>(600, 600);
export async function getProducts(): Promise<ProductsResult> {
  const { value, stale } = await catalog.get(() => avitoProvider.getProducts());
  return { ...value, stale };
}
