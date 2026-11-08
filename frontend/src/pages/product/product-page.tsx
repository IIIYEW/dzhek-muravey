import { Link } from 'react-router-dom';
import { useLoaderData, useParams } from 'react-router-dom';
import type { ProductResponse } from '@shared/types/api';
import { NotFoundPage } from '@/components/system/not-found-page';
import { PageSeo } from '@/components/system/page-seo';
import { formatPrice } from '@/utils/format-price';
import { Gallery } from '@/components/gallery/gallery';

export default function ProductPage() {
  const { productId } = useParams();
  const { sourceAvailable, product } = useLoaderData() as ProductResponse;
  if (!/^\d{1,20}$/.test(productId ?? '')) return <NotFoundPage />;
  if (!sourceAvailable) {
    return (
      <section className="section container">
        <h1>Объявление временно недоступно</h1>
        <p className="lead">
          Сейчас мы не можем загрузить сведения о товаре. Это не означает, что его нет в магазине.
        </p>
        <div className="actions">
          <Link className="button" to="/catalog">
            Вернуться в каталог
          </Link>
          <Link className="button secondary" to="/contacts">
            Уточнить наличие
          </Link>
        </div>
      </section>
    );
  }

  if (!product) return <NotFoundPage />;

  let safeUrl: string | undefined;
  try {
    const url = new URL(product.url ?? '');
    if (
      url.protocol === 'https:' &&
      (url.hostname === 'avito.ru' || url.hostname === 'www.avito.ru')
    ) {
      safeUrl = url.href;
    }
  } catch {
    // Если безопасной ссылки на объявление нет, оставляем возможность позвонить.
  }

  return (
    <section className="section container">
      <PageSeo title={product.title} description={product.description?.slice(0, 160)} />
      <Link to="/catalog">← Назад в каталог</Link>
      <div className="detail-grid">
        <Gallery images={product.images} title={product.title} />
        <div>
          <p className="eyebrow">{product.category ?? 'Объявление'}</p>
          <h1>{product.title}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p>Наличие и условия покупки уточняйте у магазина.</p>
          {safeUrl ? (
            <a className="button" href={safeUrl} target="_blank" rel="noopener noreferrer">
              Смотреть на Avito ↗
            </a>
          ) : (
            <a className="button" href="tel:+79138096000">
              Уточнить по телефону
            </a>
          )}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <>
              <h2>Характеристики</h2>
              <dl className="attributes">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
          <h2>Описание</h2>
          <p className="description">
            {product.description ?? 'Описание недоступно. Подробности можно уточнить у магазина.'}
          </p>
        </div>
      </div>
    </section>
  );
}
