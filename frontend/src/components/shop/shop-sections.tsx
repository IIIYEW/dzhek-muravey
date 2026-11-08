import { Link } from 'react-router-dom';
import {
  Refrigerator,
  WashingMachine,
  Tv,
  Laptop,
  Smartphone,
  Wrench,
  Headphones,
  Package,
  ShieldCheck,
  BadgeRussianRuble,
  CheckCheck,
  Truck,
  MapPin,
} from 'lucide-react';
import { assets } from '@/utils/images';
export const categories = [
  'Холодильники',
  'Стиральные машины',
  'Телевизоры',
  'Ноутбуки и компьютеры',
  'Смартфоны и электроника',
  'Инструменты',
  'Аксессуары и другое',
  'Бытовая техника',
];
const icons = [Refrigerator, WashingMachine, Tv, Laptop, Smartphone, Wrench, Headphones, Package];
export function Categories({ title = 'Популярные категории' }: { title?: string }) {
  return (
    <section className="section soft">
      <div className="container">
        <div className="section-heading">
          <h2>{title}</h2>
          <Link to="/catalog">Весь каталог →</Link>
        </div>
        <div className="category-grid">
          {categories.map((name, i) => {
            const Icon = icons[i];
            return (
              <Link to="/catalog" className="category-tile" key={name}>
                <span className="category-icon">
                  <Icon size={28} />
                </span>
                <strong>{name}</strong>
                <span aria-hidden="true">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function Benefits({ heading }: { heading?: string }) {
  const items = [
    {
      Icon: ShieldCheck,
      title: 'Гарантия на товары',
      text: 'Срок и условия гарантии уточняйте у продавца при покупке.',
    },
    {
      Icon: BadgeRussianRuble,
      title: 'Выгодные цены',
      text: 'Подберём технику под ваши задачи и бюджет.',
    },
    {
      Icon: CheckCheck,
      title: 'Проверенная техника',
      text: 'Технику можно осмотреть и проверить в магазине.',
    },
    {
      Icon: Truck,
      title: 'Доставка',
      text: 'Возможность и условия доставки уточняйте по телефону.',
    },
  ];
  return (
    <section className="section">
      <div className="container">
        {heading && <h2 className="block-heading">{heading}</h2>}
        <div className="benefits-grid">
          {items.map(({ Icon, title, text }) => (
            <div className="benefit" key={title}>
              <span className="benefit-icon">
                <Icon size={28} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ExchangeBanner() {
  return (
    <section className="section purple-section">
      <div className="container split-layout">
        <div>
          <p className="badge">Обмен техники</p>
          <h2>Меняем старую технику на обновлённую</h2>
          <p className="section-copy">
            Сдайте старую технику и получите выгоду при покупке другой. Позвоните — подскажем, как
            это работает.
          </p>
          <div className="actions">
            <a className="button lime" href="tel:+79138096000">
              Позвонить
            </a>
            <Link className="button secondary" to="/exchange">
              Подробнее об обмене
            </Link>
          </div>
        </div>
        <img
          className="section-photo"
          src={assets.store}
          alt="Отдел бытовой техники магазина"
          width={1600}
          height={441}
          sizes="(max-width:800px) 100vw, 480px"
        />
      </div>
    </section>
  );
}
export function ShopContacts({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`shop-contacts ${compact ? 'compact' : ''}`}>
      <div>
        {compact && <h2>Контакты</h2>}
        <dl className="contact-list">
          <div>
            <dt>Адрес</dt>
            <dd>г. Томск, ул. Бердская, 37</dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd>
              <a href="tel:+79138096000">8 913 809-60-00</a>
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:muravey.km@gmail.com">muravey.km@gmail.com</a>
            </dd>
          </div>
          <div>
            <dt>Время работы</dt>
            <dd>Понедельник — суббота, 10:00–18:00</dd>
          </div>
        </dl>
        <div className="actions">
          <a className="button" href="tel:+79138096000">
            Позвонить
          </a>
          {!compact && (
            <a className="button secondary" href="mailto:muravey.km@gmail.com">
              Написать на email
            </a>
          )}
        </div>
      </div>
      <div>
        <a
          className="map-panel"
          href="https://yandex.ru/maps/?text=Томск%20Бердская%2037"
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={40} />
          <strong>г. Томск, ул. Бердская, 37</strong>
          <span>Открыть на Яндекс Картах ↗</span>
        </a>
        {!compact && (
          <img
            className="contact-store"
            src={assets.store}
            alt="Торговый зал магазина ДЖЕК МУРАВЕЙ"
            width={1600}
            height={441}
            sizes="(max-width:800px) 100vw, 692px"
          />
        )}
      </div>
    </div>
  );
}
export function Callout() {
  return (
    <section className="callout">
      <div className="container">
        <h2>Не нашли нужное? Позвоните — подберём вариант.</h2>
        <a className="button lime" href="tel:+79138096000">
          Позвонить 8 913 809-60-00
        </a>
      </div>
    </section>
  );
}
