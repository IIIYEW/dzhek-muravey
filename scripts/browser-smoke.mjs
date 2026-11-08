import { chromium, expect } from '@playwright/test';

const base = process.argv[2] ?? 'http://127.0.0.1:4000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
try {
  for (const width of [1920, 1440, 1280, 1024, 768, 480, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/catalog',
      '/catalog/123',
      '/about',
      '/contacts',
      '/exchange',
      '/missing',
    ]) {
      await page.goto(base + path);
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        content: document.documentElement.scrollWidth,
      }));
      if (dimensions.content > dimensions.viewport + 1)
        throw Error(`Overflow ${path} at ${width}: ${JSON.stringify(dimensions)}`);
      // Проверяем размер оригинального логотипа и его размещение внутри шапки.
      const logo = page.locator('header .brand-logo');
      const logoBox = await logo.boundingBox();
      const headerBox = await page.locator('header').boundingBox();
      const expectedSize = width > 800 ? 64 : 56;
      expect(logoBox.width).toBe(expectedSize);
      expect(logoBox.height).toBe(expectedSize);
      expect(logoBox.y).toBeGreaterThanOrEqual(headerBox.y);
      expect(logoBox.y + logoBox.height).toBeLessThanOrEqual(headerBox.y + headerBox.height);
      if (path === '/' || path === '/exchange') {
        const section = page.locator(path === '/' ? '.purple-section' : '.exchange-hero');
        await expect(section).toHaveCSS('background-color', 'rgb(67, 35, 106)');
        await expect(page.locator('body')).toHaveCSS('font-size', '18px');
        await expect(page.locator('h1')).toHaveCSS('font-family', /Montserrat/);
      }
      const broken = await page
        .locator('img')
        .evaluateAll((images) =>
          images.filter((image) => image.complete && !image.naturalWidth).map((image) => image.src),
        );
      if (broken.length) throw Error(`Broken images: ${broken}`);
    }
    console.log('Routes and overflow OK at', width);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + '/about');
  // Наведение не возвращает подчёркивание; переход работает в обе стороны.
  const exchangeLink = page
    .locator('header .desktop-nav')
    .getByRole('link', { name: 'Обмен техники' });
  await exchangeLink.hover();
  await expect(exchangeLink).toHaveCSS('text-decoration-line', 'none');
  await expect(exchangeLink).toHaveCSS('transition-duration', /0\.2s/);
  await page.mouse.move(0, 0);
  await expect(exchangeLink).toHaveCSS('transition-duration', /0\.2s/);
  await page.evaluate(() => {
    window.__navigationMarker = 'preserved';
  });
  await page
    .locator('header .desktop-nav')
    .getByRole('link', { name: 'Контакты', exact: true })
    .click();
  await expect(page).toHaveURL(base + '/contacts');
  if ((await page.evaluate(() => window.__navigationMarker)) !== 'preserved')
    throw Error('Full document navigation');
  await page.goBack();
  await expect(page).toHaveURL(base + '/about');
  await page.goForward();
  await expect(page).toHaveURL(base + '/contacts');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Контакты', exact: true })).toBeVisible();
  await page.locator('footer').getByRole('link', { name: 'Каталог', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Каталог временно недоступен' })).toBeVisible();
  await page.goto(base + '/catalog/123');
  await expect(page.locator('main')).toContainText('Объявление временно недоступно');
  await page.goto(base + '/catalog/invalid');
  await expect(page.locator('main')).toContainText('404');
  // Пустой каталог, сбой сети и отсутствие товара моделируются только внутри теста.
  await page.route('**/api/products', (route) =>
    route.fulfill({
      json: { products: [], source: 'avito', sourceAvailable: true, total: 0, page: 1 },
    }),
  );
  await page.goto(base + '/catalog');
  await expect(page.locator('main')).toContainText('Нет доступных объявлений');
  await page.unroute('**/api/products');
  await page.route('**/api/products', (route) => route.abort());
  await page.goto(base + '/catalog');
  await expect(page.locator('main')).toContainText('Страница временно недоступна');
  await page.unroute('**/api/products');
  await page.route('**/api/products/123', (route) =>
    route.fulfill({ status: 404, json: { product: null, sourceAvailable: true } }),
  );
  await page.goto(base + '/catalog/123');
  await expect(page.locator('main')).toContainText('404');
  if (errors.length) throw Error(errors.join('\n'));
  console.log('SPA navigation, back/forward, refresh, offline, empty, network error and 404 OK');
} finally {
  await browser.close();
}
