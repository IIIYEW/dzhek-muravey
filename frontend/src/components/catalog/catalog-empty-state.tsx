import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export function CatalogUnavailable() {
  return (
    <div className="state catalog-unavailable" role="status">
      <Store size={36} strokeWidth={1.5} aria-hidden="true" />
      <h2>Каталог временно недоступен</h2>
      <p>
        Скоро здесь появятся актуальные предложения магазина. Пока уточните ассортимент по телефону
        или посмотрите объявления на Avito.
      </p>
      <div className="actions">
        <a
          className="button"
          href="https://www.avito.ru/brands/i93742069/all?sellerId=b54cfe210e588b5122176cc62773e0b4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Объявления на Avito ↗
        </a>
        <Link className="button secondary" to="/contacts">
          Связаться с магазином
        </Link>
      </div>
    </div>
  );
}
