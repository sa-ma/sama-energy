export interface AppConfig {
  port: number;
  webOrigin: string;
}

export function getConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3001),
    webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
  };
}
