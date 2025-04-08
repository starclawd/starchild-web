import { defineConfig } from '@lingui/conf';

export default defineConfig({
  locales: [
    'en-US',
    'zh-CN',
  ],
  sourceLocale: 'en-US',
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src'],
    },
  ],
  orderBy: 'messageId',
  rootDir: '.',
  format: 'po',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  compileNamespace: 'json',
});