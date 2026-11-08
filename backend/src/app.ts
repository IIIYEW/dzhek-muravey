import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getProducts } from './services/products.js';
import { queryProducts } from '../../shared/products/query.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use((_request, response, next) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });
  app.use(
    '/api',
    cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }),
    rateLimit({
      windowMs: 60000,
      limit: 120,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      handler: (_request, response) => {
        response.status(429).json({ error: 'Слишком много запросов', sourceAvailable: false });
      },
    }),
  );
  app.use('/api', (_request, response, next) => {
    response.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.get('/api/health', async (_request, response) => {
    const { sourceAvailable } = await getProducts();
    response.json({ status: 'ok', catalog: { sourceAvailable } });
  });
  app.get('/api/products', async (request, response) => {
    const allowed = new Set(['q', 'category', 'sort', 'page', 'limit']);
    if (
      Object.entries(request.query).some(
        ([key, value]) => !allowed.has(key) || typeof value !== 'string' || value.length > 200,
      )
    ) {
      response.status(400).json({ error: 'Недопустимый параметр', sourceAvailable: false });
      return;
    }
    const {
      q = '',
      category = '',
      sort = 'new',
      page = '1',
      limit = '24',
    } = request.query as Record<string, string>;
    if (
      !['default', 'new', 'price_asc', 'price_desc'].includes(sort) ||
      !/^\d{1,6}$/.test(page) ||
      !/^\d{1,3}$/.test(limit) ||
      +page < 1 ||
      +limit < 1 ||
      +limit > 100
    ) {
      response.status(400).json({ error: 'Недопустимый параметр', sourceAvailable: false });
      return;
    }
    const data = await getProducts();
    const products = queryProducts(data.products, {
      search: q,
      category,
      sort: sort as import('../../shared/products/query.js').ProductSort,
    });
    response.status(data.sourceAvailable ? 200 : 503).json({
      ...data,
      products: products.slice((+page - 1) * +limit, +page * +limit),
      total: products.length,
      page: +page,
    });
  });
  app.get('/api/products/:productId', async (request, response) => {
    const { productId } = request.params;
    if (!/^\d{1,20}$/.test(productId)) {
      response
        .status(400)
        .json({ error: 'Некорректный идентификатор', product: null, sourceAvailable: false });
      return;
    }
    const data = await getProducts();
    if (!data.sourceAvailable) {
      response.status(503).json({ product: null, sourceAvailable: false, error: data.error });
      return;
    }
    const product = data.products.find((item) => item.id === productId) ?? null;
    response
      .status(product ? 200 : 404)
      .json({ product, sourceAvailable: true, ...(product ? {} : { error: 'Товар не найден' }) });
  });
  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'Маршрут не найден' });
  });
  const siteUrl = () => {
    try {
      const url = new URL(process.env.SITE_URL ?? '');
      return /^https?:$/.test(url.protocol) ? url.origin : null;
    } catch {
      return null;
    }
  };
  app.get('/robots.txt', (_request, response) => {
    const origin = siteUrl();
    response
      .type('text/plain')
      .send(
        origin
          ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`
          : 'User-agent: *\nDisallow: /\n',
      );
  });
  app.get('/sitemap.xml', (_request, response) => {
    const origin = siteUrl();
    if (!origin) {
      response.status(503).type('text/plain').send('SITE_URL is not configured');
      return;
    }
    response
      .type('application/xml')
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/catalog', '/about', '/contacts', '/exchange'].map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`,
      );
  });
  // В production backend отдаёт собранный frontend с того же адреса, что и REST API.
  // Неизвестные файлы не заменяем HTML; для страниц оставляем маршрутизацию React Router.
  const frontend = resolve('frontend/dist');
  if (existsSync(frontend)) {
    app.use(express.static(frontend));
    app.get('/{*path}', (request, response) => {
      if (request.path.split('/').pop()?.includes('.')) {
        response.sendStatus(404);
        return;
      }
      const known = /^\/(?:catalog(?:\/[^/]+)?|about|contacts|exchange)?\/?$/.test(request.path);
      response.status(known ? 200 : 404).sendFile(resolve(frontend, 'index.html'));
    });
  }
  const errorHandler: ErrorRequestHandler = (_error, _request, response, _next) => {
    void _next; // Express распознаёт обработчик ошибок по сигнатуре из четырёх аргументов.
    response.status(500).json({ error: 'Внутренняя ошибка сервера', sourceAvailable: false });
  };
  app.use(errorHandler);
  return app;
}
