import { chromium, expect } from '@playwright/test';

const base = process.argv[2];
if (!base) throw new Error('Укажите адрес сборки с префиксом /dzhek-muravey/');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
const apiRequests = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('request', (request) => {
  if (new URL(request.url()).pathname.startsWith('/api')) apiRequests.push(request.url());
});
page.on('response', (response) => {
  if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/about',
      '/contacts',
      '/exchange',
      '/catalog',
      '/catalog/123',
      '/missing',
    ]) {
      await page.goto(`${base}#${path}`);
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.fonts.check('700 20px Montserrat'))).toBe(true);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
      const broken = await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => !image.complete || !image.naturalWidth)
            .map((image) => image.src),
        );
      expect(broken).toEqual([]);
      if (path === '/catalog')
        await expect(page.locator('main')).toContainText('Каталог временно недоступен');
      if (path === '/catalog/123')
        await expect(page.locator('main')).toContainText('Объявление временно недоступно');
    }
    console.log(`Pages routes, images and fonts OK at ${width}px`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}#/`);
  await page.getByRole('link', { name: 'Смотреть каталог', exact: true }).click();
  await expect(page).toHaveURL(`${base}#/catalog`);
  await page.reload();
  await expect(page.locator('main')).toContainText('Каталог временно недоступен');
  await page.goBack();
  await expect(page.locator('main h1')).toContainText('Техника с выгодой');
  expect(apiRequests).toEqual([]);
  expect(errors).toEqual([]);
  console.log('Pages navigation, refresh, back, no API requests and no browser errors OK');
} finally {
  await browser.close();
}
