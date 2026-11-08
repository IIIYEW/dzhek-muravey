// Оригинальные фотографии владельца: это виды магазина, а не объявления каталога.
// Пути ведут в public; логотип используется без изменения пропорций и оформления.
const base = import.meta.env.BASE_URL;

export const assets = {
  logo: `${base}images/logo/brand-logo.png`,
  store: `${base}images/shop/appliances-panorama.png`,
  team: `${base}images/shop/team-and-tools.png`,
  electronics: `${base}images/shop/electronics-shelves.png`,
};
