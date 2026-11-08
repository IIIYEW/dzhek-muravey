import { useLocation } from 'react-router-dom';

const pages: Record<string, [string, string]> = {
  '/': [
    'ДЖЕК МУРАВЕЙ — комиссионный магазин в Томске',
    'Комиссионный магазин техники, электроники и инструментов в Томске.',
  ],
  '/catalog': [
    'Каталог',
    'Техника, электроника и инструменты комиссионного магазина ДЖЕК МУРАВЕЙ.',
  ],
  '/about': [
    'О магазине',
    'ДЖЕК МУРАВЕЙ — комиссионный магазин техники, электроники и инструментов в Томске.',
  ],
  '/contacts': ['Контакты', 'Томск, ул. Бердская, 37. Телефон 8 913 809-60-00. Пн–сб 10:00–18:00.'],
  '/exchange': [
    'Обмен техники',
    'Обсудите обмен бытовой техники с магазином ДЖЕК МУРАВЕЙ в Томске.',
  ],
};

// React 19 переносит эти теги в head при смене страницы.
export function PageSeo({ title, description }: { title?: string; description?: string }) {
  const { pathname } = useLocation();
  const defaults = pages[pathname];
  const resolvedTitle = title ?? defaults?.[0] ?? 'Страница недоступна';
  const fullTitle = pathname === '/' && !title ? resolvedTitle : `${resolvedTitle} | ДЖЕК МУРАВЕЙ`;
  const text = description ?? defaults?.[1] ?? 'Комиссионный магазин ДЖЕК МУРАВЕЙ в Томске';
  const origin = import.meta.env.VITE_SITE_URL as string | undefined;
  const canonical = origin ? new URL(pathname, origin).href : undefined;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={text} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={text} />
      <meta property="og:type" content="website" />
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {(import.meta.env.MODE === 'pages' || (!defaults && !title)) && (
        <meta name="robots" content="noindex" />
      )}
    </>
  );
}
