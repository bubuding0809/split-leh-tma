// vitest.config.ts
/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/**', '.next/**', 'coverage/**'],
    },
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
  },
});
