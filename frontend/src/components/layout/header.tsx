import { Link, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Brand } from './brand';
const links = [
  ['/', 'Главная'],
  ['/catalog', 'Каталог'],
  ['/about', 'О магазине'],
  ['/exchange', 'Обмен техники'],
  ['/contacts', 'Контакты'],
];
// Одна карта ссылок для десктопа и телефона; выбор пункта закрывает мобильное меню.
function NavLinks() {
  const { pathname } = useLocation();
  return (
    <>
      {links.map(([href, label]) => (
        <NavLink
          key={href}
          to={href}
          end={href === '/'}
          aria-current={
            (href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined
          }
          onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
        >
          {label}
        </NavLink>
      ))}
    </>
  );
}
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Основная навигация">
          <NavLinks />
        </nav>
        <div className="header-actions">
          <Link className="search-link" to="/catalog" aria-label="Поиск по каталогу">
            <Search size={20} />
          </Link>
          <a className="button header-call" href="tel:+79138096000">
            Позвонить
          </a>
        </div>
        <details className="mobile-menu">
          <summary>Меню</summary>
          <nav aria-label="Мобильная навигация">
            <NavLinks />
            <a href="tel:+79138096000">8 913 809-60-00</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
