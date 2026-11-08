# Маршруты

Единый реестр: frontend/src/app/router.tsx. Используются createBrowserRouter и RouterProvider, общий AppLayout/Outlet. React Router Link/NavLink не перезагружают документ. ProductPage читает useParams().productId. Loaders используют /api и AbortSignal.

| URL                 | Реализация                           |
| ------------------- | ------------------------------------ |
| /                   | pages/home/home-page.tsx             |
| /catalog            | pages/catalog/catalog-page.tsx       |
| /catalog/:productId | pages/product/product-page.tsx       |
| /about              | pages/about/about-page.tsx           |
| /contacts           | pages/contacts/contacts-page.tsx     |
| /exchange           | pages/exchange/exchange-page.tsx     |
| *                   | components/system/not-found-page.tsx |

/privacy ранее удалена владельцем; её не восстанавливаем. В каталог/товар загружаются реальные ответы собственного backend; 503 — недоступность источника, 404 — подтверждённое отсутствие. Некорректный ID отображает 404 без запроса к Avito.

При переходе сбрасывается прокрутка, hash ведёт к секции. Header/Footer стабильны. Во время loader показан status; при ошибке сети — GlobalError и revalidator. Production backend обслуживает прямые ссылки и refresh через index.html. Неподдерживаемый URL получает HTTP 404 и SPA 404; Vite dev fallback возвращает HTML 200, но UI остаётся 404.
