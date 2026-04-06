import { getConfig } from './lib/config.js';
import { createApp } from './app.js';

const config = getConfig();
const app = await createApp();

try {
  await app.listen({
    port: config.port,
    host: '0.0.0.0',
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
