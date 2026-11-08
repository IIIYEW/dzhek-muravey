import { config } from 'dotenv';
import { createApp } from './app.js';

config({ path: 'backend/.env', quiet: true });
const port = Number(process.env.PORT ?? 4000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const server = createApp().listen(port, () =>
  console.log(`Backend listening on http://127.0.0.1:${port}`),
);
for (const signal of ['SIGTERM', 'SIGINT'] as const) process.on(signal, () => server.close());
