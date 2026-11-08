import { Link } from 'react-router-dom';
import { Brand } from './brand';
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Brand />
          <p className="footer-note">
            Принимаем, продаём
            <br />и гарантию даём.
          </p>
        </div>
        <div>
          <p className="footer-label">Навигация</p>
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/about">О магазине</Link>
          <Link to="/exchange">Обмен техники</Link>
          <Link to="/contacts">Контакты</Link>
        </div>
        <div>
          <p className="footer-label">Каталог</p>
          {['Холодильники', 'Стиральные машины', 'Телевизоры', 'Ноутбуки', 'Инструменты'].map(
            (label) => (
              <Link key={label} to="/catalog">
                {label}
              </Link>
            ),
          )}
        </div>
        <div>
          <p className="footer-label">Контакты</p>
          <span>г. Томск, ул. Бердская, 37</span>
          <a href="tel:+79138096000">8 913 809-60-00</a>
          <a href="mailto:muravey.km@gmail.com">muravey.km@gmail.com</a>
          <span>Пн — сб, 10:00–18:00</span>
        </div>
      </div>
      <div className="copyright">
        <div className="container footer-bottom">
          <span>© 2026 ДЖЕК МУРАВЕЙ. Комиссионный магазин, г. Томск</span>
        </div>
      </div>
    </footer>
  );
}
