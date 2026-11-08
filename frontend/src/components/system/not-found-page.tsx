import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="container section state">
      <p>404</p>
      <h1>Здесь ничего нет</h1>
      <p>Страница или объявление недоступны. Это не означает, что товар продан.</p>
      <Link className="button" to="/catalog">
        Вернуться в каталог
      </Link>
    </section>
  );
}
