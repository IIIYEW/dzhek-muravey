import { Link } from 'react-router-dom';
import { ProductImage } from './product-image';
import type { Product } from '@shared/types/product';
import { formatPrice } from '@/utils/format-price';
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link to={`/catalog/${encodeURIComponent(product.id)}`}>
        <div className="product-image">
          <ProductImage
            src={product.images[0]}
            title={product.title}
            sizes="(max-width: 600px) 90vw, 33vw"
          />
        </div>
        <div className="product-info">
          <h3>{product.title}</h3>
          <p className="product-meta">{product.category ?? 'Категория не указана'}</p>
          <div className="price">{formatPrice(product.price)}</div>
        </div>
      </Link>
      {product.url && (
        <a className="avito-link" href={product.url} target="_blank" rel="noopener noreferrer">
          Смотреть на Avito ↗
        </a>
      )}
    </article>
  );
}
