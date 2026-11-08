import { Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import type { ProductsResponse } from '@shared/types/api';
import { Catalog } from '@/components/catalog/catalog';
export default function CatalogPage() {
  const data = useLoaderData() as ProductsResponse;
  return (
    <>
      <section className="page-heading">
        <div className="container">
          <p className="breadcrumbs">
            <Link to="/">Главная</Link> / Каталог
          </p>
          <h1>Каталог товаров</h1>
        </div>
      </section>
      <section className="section container catalog-body">
        <Catalog products={data.products} sourceAvailable={data.sourceAvailable} />
      </section>
    </>
  );
}
