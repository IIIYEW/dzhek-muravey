export function formatPrice(value?: number) {
  return value == null ? 'Цена уточняется' : new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}
