import { apiRequest } from './client';
import type { ProductsResponse, ProductResponse } from '@shared/types/api';

// Pages размещает только интерфейс. Не отправляем запросы на несуществующий API
// и не выдаём отключённый источник за успешно загруженный пустой каталог.
const pagesPreview = import.meta.env.MODE === 'pages';
const unavailable = 'Каталог Avito пока не подключён.';

export const productsService = {
  list: (signal?: AbortSignal): Promise<ProductsResponse> =>
    pagesPreview
      ? Promise.resolve({
          products: [],
          source: 'avito',
          sourceAvailable: false,
          error: unavailable,
          total: 0,
          page: 1,
        })
      : apiRequest<ProductsResponse>('/products', signal),
  detail: (productId: string, signal?: AbortSignal): Promise<ProductResponse> =>
    pagesPreview
      ? Promise.resolve({ product: null, sourceAvailable: false, error: unavailable })
      : apiRequest<ProductResponse>(`/products/${encodeURIComponent(productId)}`, signal),
};
