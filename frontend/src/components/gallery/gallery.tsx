import { useState } from 'react';
import { ProductImage } from '@/components/catalog/product-image';
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState<string>();
  const unique = [...new Set(images)];
  const current = selected && unique.includes(selected) ? selected : unique[0];
  return (
    <div>
      <div className="gallery-main">
        <ProductImage
          key={current ?? 'empty'}
          src={current}
          title={title}
          sizes="(max-width: 800px) 90vw, 50vw"
        />
      </div>
      {unique.length > 1 && (
        <div className="gallery-thumbs" aria-label="Фотографии товара">
          {unique.map((src, i) => (
            <button
              key={src}
              aria-label={`Фото ${i + 1}`}
              aria-pressed={current === src}
              onClick={() => setSelected(src)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
