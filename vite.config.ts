import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'macros'
        ]
      }
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 配置所有非相对模块名称导入到src目录
      'api': path.resolve(__dirname, './src/api'),
      'components': path.resolve(__dirname, './src/components'),
      'constants': path.resolve(__dirname, './src/constants'),
      'hooks': path.resolve(__dirname, './src/hooks'),
      'i18n': path.resolve(__dirname, './src/i18n'),
      'locales': path.resolve(__dirname, './src/locales'),
      'pages': path.resolve(__dirname, './src/pages'),
      'routes': path.resolve(__dirname, './src/routes'),
      'store': path.resolve(__dirname, './src/store'),
      'styles': path.resolve(__dirname, './src/styles'),
      'types': path.resolve(__dirname, './src/types'),
      'App': path.resolve(__dirname, './src/App')
    }
  }
})
