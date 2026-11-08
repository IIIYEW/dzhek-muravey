# REST API

Base: /api. Ответы JSON, no-store; CORS FRONTEND_URL, лимит 120 запросов/минуту/IP. Ошибки содержат error; sourceAvailable/product присутствуют там, где относятся к ответу товара. Никаких секретов и raw внешних ошибок.

- GET /health: 200 {status:'ok', catalog:{sourceAvailable:false}}. Не проверяет внешнюю сеть.
- GET /products: products, source, sourceAvailable, error?, stale, total, page. Сейчас 503 и products:[] — источник отключён. При доступном источнике 200, пустой products означает подтверждённо пустую выборку.
- GET /products/:productId: 1–20 цифр, иначе 400. При отключении 503 {product:null,sourceAvailable:false,error:'not_configured'}. При доступном источнике 200/product или 404/product:null.

Параметры списка: q до 200 символов, category до 200, sort=default|new|price_asc|price_desc, page=1..999999, limit=1..100 (24 по умолчанию). Это локальная фильтрация/пагинация нормализованного результата, не обещание соответствующих параметров Avito. Повторяющиеся, неизвестные и вложенные параметры отклоняются 400. UI сейчас скрывает фильтры при offline.

Другие API пути 404, превышение лимита 429, внутреннее исключение 500 с общим текстом. Production SPA fallback не перехватывает /api. /robots.txt и /sitemap.xml вне API; требуют SITE_URL для публикации (sitemap без него 503).
