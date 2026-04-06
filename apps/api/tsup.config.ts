import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/server.ts'],
  format: ['esm'],
  noExternal: ['@sama-energy/contracts'],
  outDir: 'dist',
  target: 'node20',
});
