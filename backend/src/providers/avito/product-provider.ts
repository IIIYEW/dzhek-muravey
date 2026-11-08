import type { ProductProvider, ProductsResult } from '../product-provider.js';

export class UnavailableProductProvider implements ProductProvider {
  async getProducts(): Promise<ProductsResult> {
    return { products: [], source: 'avito', sourceAvailable: false, error: 'not_configured' };
  }
  async getProductById(productId: string): Promise<null> {
    void productId;
    return null;
  }
}

// Пока возвращаем недоступный источник, не пустой ассортимент.
// #TODO(Avito): проверить права и контракт Item API, затем подключить OAuth.
// #TODO(Avito): добавить пагинацию и карточку товара; сверить фото и статусы с ответами API.
export class AvitoProductProvider extends UnavailableProductProvider {}
export const avitoProvider = new AvitoProductProvider();
