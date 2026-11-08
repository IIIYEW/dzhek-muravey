import type { Product } from '../../../shared/types/product.js';

export interface ProductsResult {
  products: Product[];
  source: 'avito';
  sourceAvailable: boolean;
  error?: 'not_configured' | 'unavailable';
  stale?: boolean;
}

export interface ProductProvider {
  getProducts(): Promise<ProductsResult>;
  getProductById(id: string): Promise<Product | null>;
}
