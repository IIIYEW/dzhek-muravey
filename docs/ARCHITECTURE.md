# Архитектура

Один npm workspace, frontend Vite/React 19/React Router 7, backend Express 5/TypeScript. Node >=22.12. Next.js удалён из зависимостей и точек входа.

Frontend: main.tsx подключает CSS и React root; App.tsx — RouterProvider; app/router.tsx — центральный createBrowserRouter. AppLayout содержит Header, Main/Outlet, Footer, SEO и прокрутку. Pages содержат UI страниц, services/api — единственный HTTP-клиент, shared — сериализуемые типы и чистые функции без секретов.

Backend: server.ts читает только backend/.env, app.ts создаёт Express без автоматического listen (удобно тестировать), services/products.ts содержит кеш и центральный выбор provider. providers/avito содержит офлайн-provider, чистую нормализацию/кеш и изолированный OAuth-клиент. OAuth не вызывается текущим provider. Нет БД/Redis/очередей.

Безопасность: API не возвращает исключения/токены; CORS ограничен FRONTEND_URL, rate limit 120/min, no-store, валидация query/ID. OAuth ограничен официальным HTTPS URL, redirect:error, timeout 10s. Frontend fetch timeout 12s, отмена устаревших loaders через request.signal.

Production: Express отдаёт frontend/dist, REST, robots/sitemap и SPA fallback. Build backend сохраняет shared рядом с скомпилированными модулями в backend/dist. npm start из корня. Dev: concurrently, Vite proxy /api.

SPA SEO не равно SSR; canonical задаётся только с реальным VITE_SITE_URL. Нет выдуманного товарного SEO. Миграция сохраняет исходные CSS cascade и ресурсы. Обычные img вместо Next Image; серверной оптимизации картинок больше нет. Статические шрифты и лицензия находятся в frontend/public/assets/fonts, карта URL изображений — в frontend/src/utils/images.ts. Accessibility.css подключён последним для пользовательских настроек текста, логотипа и плавных hover-состояний.
