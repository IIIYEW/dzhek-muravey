export type Product = {
  id: string;
  title: string;
  price?: number;
  description?: string;
  category?: string;
  images: string[];
  url?: string;
  status?: string;
  updatedAt?: string;
  attributes?: Record<string, string | number | boolean>;
};
