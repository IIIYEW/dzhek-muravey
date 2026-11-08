import { apiRequest } from './client';
import type { ProductsResponse, ProductResponse } from '@shared/types/api';

export const productsService = {
  list: (signal?: AbortSignal) => apiRequest<ProductsResponse>('/products', signal),
  detail: (productId: string, signal?: AbortSignal) =>
    apiRequest<ProductResponse>(`/products/${encodeURIComponent(productId)}`, signal),
};
