import type { Product } from '../../../../../shared/types/product.js';

export function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

export function avitoUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  try {
    const url = new URL(value);
    if (
      url.protocol === 'https:' &&
      ['avito.ru', 'www.avito.ru'].includes(url.hostname) &&
      !url.username &&
      !url.password
    ) {
      return url.href;
    }
  } catch {
    // Некорректную ссылку намеренно не передаём клиенту.
  }
}

// Разрешаем изображения только с официальных доменов Avito.
export function imageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && /(^|\.)avito\.(st|ru)$/.test(url.hostname)) return url.href;
  } catch {
    // Некорректную ссылку намеренно не передаём клиенту.
  }
}

export function normalize(value: unknown): Product | null {
  const raw = record(value);
  // Неизвестный статус не подтверждает наличие товара — такую запись не публикуем.
  // #TODO(Avito): сверить поля нормализации с подтверждёнными ответами Item API.
  if (raw.status !== 'active' || !/^\d+$/.test(String(raw.id))) return null;

  const images = Array.isArray(raw.images)
    ? raw.images.flatMap((image) => {
        const imageRecord = record(image);
        const url = imageUrl(typeof image === 'string' ? image : imageRecord.url);
        return url ? [url] : [];
      })
    : [];

  return {
    id: String(raw.id),
    title: typeof raw.title === 'string' ? raw.title : 'Объявление',
    price:
      typeof raw.price === 'number' && Number.isFinite(raw.price) && raw.price >= 0
        ? raw.price
        : undefined,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    category:
      typeof record(raw.category).name === 'string'
        ? (record(raw.category).name as string)
        : undefined,
    images,
    url: avitoUrl(raw.url),
    status: 'active',
    updatedAt:
      typeof raw.updated_at === 'string' && Number.isFinite(Date.parse(raw.updated_at))
        ? raw.updated_at
        : undefined,
  };
}
