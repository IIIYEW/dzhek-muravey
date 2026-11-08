import { Link } from 'react-router-dom';
import { assets } from '@/utils/images';
import { CatalogUnavailable } from '@/components/catalog/catalog-empty-state';
import { ProductCard } from '@/components/catalog/product-card';
import {
  Benefits,
  Categories,
  ExchangeBanner,
  ShopContacts,
} from '@/components/shop/shop-sections';
import { useLoaderData } from 'react-router-dom';
import type { ProductsResponse } from '@shared/types/api';
export default function HomePage() {
  const { products } = useLoaderData() as ProductsResponse;
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="badge">Проверенная техника · Томск</p>
            <h1>Техника с выгодой для тебя</h1>
            <p className="hero-copy">
              Проверенная бытовая техника, электроника и инструменты по доступным ценам. Выбирайте в
              магазине в Томске.
            </p>
            <div className="actions">
              <Link className="button lime" to="/catalog">
                Смотреть каталог
              </Link>
              <Link className="button secondary" to="/exchange">
                Сдать технику
              </Link>
            </div>
            <p className="hero-note">Принимаем, продаём и гарантию даём</p>
          </div>
          <div className="hero-collage" aria-label="Фотографии торгового зала">
            <img
              src={assets.store}
              alt="Холодильники в торговом зале"
              width={1600}
              height={441}
              sizes="(max-width:800px) 50vw, 240px"
              fetchPriority="high"
            />
            <img
              src={assets.store}
              alt="Отдел стиральных машин"
              width={1600}
              height={441}
              sizes="(max-width:800px) 50vw, 240px"
              fetchPriority="high"
            />
            <img
              src={assets.electronics}
              alt="Электроника на полках магазина"
              width={800}
              height={220}
              sizes="(max-width:800px) 50vw, 240px"
            />
          </div>
        </div>
      </section>
      <Benefits />
      <Categories />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Рекомендуем</h2>
            <Link to="/catalog">Смотреть все →</Link>
          </div>
          {products.length ? (
            <div className="product-grid">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <CatalogUnavailable />
          )}
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <h2 className="block-heading">Как это работает</h2>
          <div className="steps-grid">
            {[
              ['Выбираете товар', 'Смотрите каталог или сообщите, что ищете — подберём вариант.'],
              ['Связываетесь с магазином', 'Позвоните или напишите: уточним наличие и условия.'],
              ['Осматриваете товар', 'Приезжаете в магазин и проверяете технику лично.'],
              ['Покупаете в магазине', 'Условия покупки и гарантии уточняйте у продавца.'],
            ].map(([title, text], i) => (
              <div key={title}>
                <span className="step-number">{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ExchangeBanner />
      <section className="section">
        <div className="container">
          <h2>Отзывы покупателей</h2>
          <p className="section-copy">Читайте отзывы о магазине и делитесь своим опытом.</p>
          <a
            className="button secondary"
            href="https://2gis.ru/tomsk/search/Джек%20Муравей"
            target="_blank"
            rel="noreferrer"
          >
            Отзывы на 2ГИС ↗
          </a>
        </div>
      </section>
      <section className="section soft">
        <div className="container split-layout about-row">
          <img
            className="section-photo"
            src={assets.team}
            alt="Сотрудники магазина в отделе инструментов"
            width={548}
            height={533}
            sizes="(max-width:800px) 100vw, 560px"
          />
          <div>
            <h2>О нашем магазине</h2>
            <p className="section-copy">
              Мы принимаем подержанные вещи на комиссию и продаём технику, электронику, инструменты
              и аксессуары.
            </p>
            <p>
              Ассортимент постоянно обновляется, а продавцы помогут подобрать вещь по приемлемой
              цене.
            </p>
            <Link className="button" to="/about">
              Подробнее о магазине
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ShopContacts compact />
        </div>
      </section>
    </>
  );
}
