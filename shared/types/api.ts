import type { Product } from './product.js';

export interface ProductsResponse {
  products: Product[];
  source: 'avito';
  sourceAvailable: boolean;
  error?: string;
  stale?: boolean;
  total: number;
  page: number;
}

export interface ProductResponse {
  product: Product | null;
  sourceAvailable: boolean;
  error?: string;
}
