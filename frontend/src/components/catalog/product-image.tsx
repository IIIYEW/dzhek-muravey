import { useState } from 'react';
import { ImageOff } from 'lucide-react';
export function ProductImage({
  src,
  title,
  sizes,
}: {
  src?: string;
  title: string;
  sizes: string;
}) {
  const [failed, setFailed] = useState<string>();
  return src && failed !== src ? (
    <img
      src={src}
      alt={title}
      className="product-photo"
      sizes={sizes}
      onError={() => setFailed(src)}
    />
  ) : (
    <div className="photo-empty">
      <ImageOff size={32} strokeWidth={1} aria-hidden="true" />
      <span>Фото не предоставлено</span>
    </div>
  );
}
