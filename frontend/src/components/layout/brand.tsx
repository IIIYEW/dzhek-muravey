import { Link } from 'react-router-dom';
import { assets } from '@/utils/images';
// Оригинальный квадратный логотип: фактический размер задаётся CSS для каждого экрана.
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="ДЖЕК МУРАВЕЙ — на главную">
      <img
        src={assets.logo}
        alt="ДЖЕК МУРАВЕЙ — комиссионный магазин"
        width={160}
        height={160}
        className="brand-logo"
        fetchPriority="high"
      />
      <span className="brand-tagline">
        <strong>КОМИССИОННЫЙ МАГАЗИН</strong>
        <span>Принимаем, продаём и гарантию даём</span>
      </span>
    </Link>
  );
}
