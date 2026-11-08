import { Link } from 'react-router-dom';
import { assets } from '@/utils/images';
export default function ExchangePage() {
  return (
    <>
      <section className="page-brand-hero exchange-hero">
        <div className="container split-layout">
          <div>
            <p className="badge">Обмен техники</p>
            <h1>Меняем старую технику на обновлённую</h1>
            <p className="section-copy">
              Сдайте старую технику и получите выгоду при покупке другой. Позвоните — подскажем, как
              это работает.
            </p>
            <div className="actions">
              <a className="button lime" href="tel:+79138096000">
                Позвонить в магазин
              </a>
              <Link className="button secondary" to="/catalog">
                Смотреть каталог
              </Link>
            </div>
          </div>
          <img
            className="section-photo"
            src={assets.store}
            alt="Отдел холодильников и стиральных машин магазина"
            width={1600}
            height={441}
            sizes="(max-width:800px) 100vw, 480px"
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="block-heading">Как проходит обмен</h2>
          <div className="steps-grid exchange-steps">
            {[
              [
                'Позвоните и выберите товар',
                'Расскажите о модели и состоянии своей техники. Сотрудники уточнят возможность приёма и оценки.',
              ],
              [
                'Согласуйте передачу и доставку',
                'Выберите замену и обсудите размер доплаты, передачу старой техники и возможность доставки.',
              ],
              [
                'Сдайте старую и получите выгоду',
                'Обмен проводится на условиях, согласованных с магазином.',
              ],
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
      <section className="section soft">
        <div className="container">
          <h2 className="block-heading">Что можно сдать</h2>
          <div className="accepted-types">
            {[
              'Холодильники',
              'Стиральные машины',
              'Телевизоры',
              'Ноутбуки',
              'Электроника',
              'Инструменты',
            ].map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="callout">
        <div className="container">
          <div>
            <h2>Готовы обменять технику?</h2>
            <p>8 913 809-60-00 · Пн — сб, 10:00–18:00</p>
          </div>
          <a className="button lime" href="tel:+79138096000">
            Позвонить
          </a>
        </div>
      </section>
    </>
  );
}
