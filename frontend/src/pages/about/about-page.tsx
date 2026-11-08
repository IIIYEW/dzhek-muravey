import { assets } from '@/utils/images';
import { Categories, Benefits, Callout } from '@/components/shop/shop-sections';
export default function AboutPage() {
  return (
    <>
      <section className="page-brand-hero">
        <div className="container split-layout">
          <div>
            <p className="badge">О магазине</p>
            <h1>Принимаем, продаём и гарантию даём</h1>
            <p className="section-copy">
              Комиссионный магазин «ДЖЕК МУРАВЕЙ» в Томске: продаём технику и принимаем подержанные
              вещи на комиссию.
            </p>
          </div>
          <img
            className="section-photo"
            src={assets.team}
            alt="Сотрудники в торговом зале магазина"
            width={548}
            height={533}
            sizes="(max-width:800px) 100vw, 480px"
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="section">
        <div className="container split-layout about-row">
          <img
            className="section-photo"
            src={assets.store}
            alt="Бытовая техника в торговом зале"
            width={1600}
            height={441}
            sizes="(max-width:800px) 100vw, 560px"
          />
          <div>
            <h2>Чем занимается магазин</h2>
            <p className="section-copy">
              Мы продаём и принимаем подержанные товары: бытовую технику, электронику, аксессуары и
              инструменты.
            </p>
            <p>
              Ассортимент постоянно обновляется. Если нужной вещи нет в наличии, сообщите, что вы
              ищете. Возможность приёма и условия комиссии согласовываются с магазином.
            </p>
          </div>
        </div>
      </section>
      <Categories title="Что мы принимаем и продаём" />
      <Benefits heading="Почему покупатели выбирают нас" />
      <section className="section warranty">
        <div className="container">
          <h2>Гарантийные обязательства</h2>
          <p className="section-copy">
            Срок и условия гарантии зависят от конкретной вещи — уточняйте у продавца по телефону
            или в магазине. Перед покупкой технику можно осмотреть и проверить.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="block-heading">Магазин и товары</h2>
          <div className="shop-gallery">
            <img
              src={assets.store}
              alt="Отдел бытовой техники"
              width={1600}
              height={441}
              sizes="(max-width:800px) 100vw, 384px"
            />
            <img
              src={assets.team}
              alt="Отдел инструментов и сотрудники магазина"
              width={548}
              height={533}
              sizes="(max-width:800px) 100vw, 384px"
            />
            <img
              src={assets.electronics}
              alt="Электроника в торговом зале"
              width={800}
              height={220}
              sizes="(max-width:800px) 100vw, 384px"
            />
          </div>
        </div>
      </section>
      <Callout />
    </>
  );
}
