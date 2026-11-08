import { createBrowserRouter, createHashRouter, useRevalidator } from 'react-router-dom';
import { AppLayout } from '@/components/system/app-layout';
import { GlobalError } from '@/components/system/global-error';
import { NotFoundPage } from '@/components/system/not-found-page';
import HomePage from '@/pages/home/home-page';
import CatalogPage from '@/pages/catalog/catalog-page';
import ProductPage from '@/pages/product/product-page';
import AboutPage from '@/pages/about/about-page';
import ContactsPage from '@/pages/contacts/contacts-page';
import ExchangePage from '@/pages/exchange/exchange-page';
import { productsService } from '@/services/api/products';

function RouteError() {
  const { revalidate } = useRevalidator();
  return (
    <GlobalError
      reset={() => {
        void revalidate();
      }}
    />
  );
}

// Единая карта маршрутов; общий макет сохраняется при переходах внутри сайта.
// Сигнал отмены loader прекращает запрос при уходе со страницы.
// На Pages нет SPA fallback: hash-маршруты переживают обновление страницы.
const createRouter = import.meta.env.MODE === 'pages' ? createHashRouter : createBrowserRouter;
export const router = createRouter([
  {
    Component: AppLayout,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          {
            path: '/',
            Component: HomePage,
            loader: ({ request }) => productsService.list(request.signal),
          },
          {
            path: '/catalog',
            Component: CatalogPage,
            loader: ({ request }) => productsService.list(request.signal),
          },
          {
            path: '/catalog/:productId',
            Component: ProductPage,
            loader: ({ params, request }) =>
              /^\d{1,20}$/.test(params.productId ?? '')
                ? productsService.detail(params.productId!, request.signal)
                : { product: null, sourceAvailable: true },
          },
          { path: '/about', Component: AboutPage },
          { path: '/contacts', Component: ContactsPage },
          { path: '/exchange', Component: ExchangePage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
]);
