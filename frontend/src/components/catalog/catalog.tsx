import { useState } from 'react';
import type { Product } from '@shared/types/product';
import { ProductCard } from './product-card';
import { CatalogUnavailable } from './catalog-empty-state';
import { queryProducts } from '@shared/products/query';
export function Catalog({
  products,
  sourceAvailable = true,
}: {
  products: Product[];
  sourceAvailable?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('default');
  const [limit, setLimit] = useState(12);
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  ) as string[];
  const filtered = queryProducts(products, {
    search,
    category,
    sort:
      sort === 'asc'
        ? 'price_asc'
        : sort === 'desc'
          ? 'price_desc'
          : sort === 'new'
            ? 'new'
            : 'default',
  });
  // Отключённый источник не равен пустому каталогу: фильтры пока скрыты.
  if (!sourceAvailable)
    return (
      <>
        <p className="source-note">
          Поиск, фильтры и сортировка станут доступны вместе с каталогом.
        </p>
        <CatalogUnavailable />
      </>
    );
  return (
    <>
      <div className="filters">
        <label>
          Поиск
          <input
            type="search"
            value={search}
            placeholder="Название товара"
            onChange={(event) => {
              setSearch(event.target.value);
              setLimit(12);
            }}
          />
        </label>
        <label>
          Категория
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setLimit(12);
            }}
          >
            <option value="">Все категории</option>
            {categories.map((categoryName) => (
              <option key={categoryName}>{categoryName}</option>
            ))}
          </select>
        </label>
        <label>
          Сортировка
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="default">По умолчанию</option>
            <option value="asc">Сначала дешевле</option>
            <option value="desc">Сначала дороже</option>
            {products.some((product) => product.updatedAt) && (
              <option value="new">Сначала новые</option>
            )}
          </select>
        </label>
      </div>
      <p className="product-meta">Найдено: {filtered.length}</p>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.slice(0, limit).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <div className="state">
          <h2>{products.length ? 'Ничего не найдено' : 'Нет доступных объявлений'}</h2>
          <p>
            {products.length
              ? 'Попробуйте изменить запрос или категорию.'
              : 'Загляните позже или уточните ассортимент по телефону.'}
          </p>
          {products.length > 0 && (
            <button
              className="button"
              onClick={() => {
                setSearch('');
                setCategory('');
              }}
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}
      {filtered.length > limit && (
        <button className="button" onClick={() => setLimit(limit + 12)}>
          Показать ещё
        </button>
      )}
    </>
  );
}
