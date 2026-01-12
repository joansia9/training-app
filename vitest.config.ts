import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    silent: 'passed-only',
    projects: [
      {
        extends: true,
        test: {
          include: ['src/server/**/*.spec.ts'],
          exclude: ['src/server/api/**/*.spec.ts'],
          name: { label: 'services', color: 'yellow' },
          environment: 'node',
          sequence: { groupOrder: 0 },
        },
      },
      {
        extends: true,
        test: {
          include: ['src/server/api/**/*.spec.ts'],
          name: { label: 'api', color: 'blue' },
          environment: 'node',
          fileParallelism: false,
          sequence: { groupOrder: 1 },
        },
      },
      {
        extends: true,
        test: {
          include: ['src/app/**/*.spec.ts'],
          name: { label: 'client', color: 'red' },
          environment: 'jsdom',
          setupFiles: ['src/test-setup.ts'],
          sequence: { groupOrder: 2 },
        },
      },
    ],
    server: {
      deps: {
        inline: [/@fhss-web-team\/backend-utils/],
      },
    },
  },
});
