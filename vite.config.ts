import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { spawn } from 'child_process'
// @ts-ignore
import eslint from 'vite-plugin-eslint'

// TypeScript检查插件
function typeCheck() {
  let server: any = null
  return {
    name: 'vite-plugin-ts-check',
    configureServer(_server: any) {
      server = _server
      function runCheck() {
        const tsc = spawn('yarn', ['tsc', '--noEmit', '--pretty'], {
          stdio: ['ignore', 'pipe', 'inherit'],
          shell: true
        })
        
        tsc.stdout.on('data', (data) => {
          const str = data.toString()
          if (str.includes('error')) {
            server.config.logger.error(str)
          } else {
            server.config.logger.info(str)
          }
        })
      }
      
      // 当服务器启动时运行类型检查
      runCheck()
      
      // 监听文件变更时运行类型检查
      server.watcher.on('change', (path: any) => {
        if (path.endsWith('.ts') || path.endsWith('.tsx')) {
          runCheck()
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'macros',
          [
            'styled-components',
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
    typeCheck(),
    eslint({
      failOnError: false,
      failOnWarning: false,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules/**', 'dist/**'],
      lintOnStart: true,
      emitError: true,
      emitWarning: true
    })
  ],
  // 添加服务器配置，允许局域网访问
  server: {
    host: '0.0.0.0',
    port: 6066,
    proxy: {
      '/holomindsTestnet': {
        target: 'http://54.169.231.27:8005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/holomindsTestnet/, '/v1')
      },
      '/tradeaiTestnet': {
        target: 'http://54.169.231.27:8008',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tradeaiTestnet/, '')
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
      'App': path.resolve(__dirname, './src/App'),
      'utils': path.resolve(__dirname, './src/utils'),
      'assets': path.resolve(__dirname, './src/assets'),
      'theme': path.resolve(__dirname, './src/theme')
    },
    // 添加对各种文件扩展名的支持，包括.d.ts声明文件
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.d.ts']
  },
  define: {
    'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
  },
  // 确保构建时生成完整的sourcemap
  build: {
    sourcemap: true,
    modulePreload: {
      // 自定义 modulepreload 的处理
      polyfill: true,
      // 解决模块加载顺序问题
      resolveDependencies: (_filename, deps, _context) => {
        // 确保 react-core 在最前面加载
        const orderedChunks = [
          'react-core',
          'redux-core',
          'redux-persist',
          'router',
          'ui-components',
          'utils-common',
          'i18n',
          'feature-libs'
        ];
        
        // 按预定义顺序排序
        return deps.sort((a, b) => {
          const aChunk = orderedChunks.findIndex(chunk => a.includes(`/${chunk}-`));
          const bChunk = orderedChunks.findIndex(chunk => b.includes(`/${chunk}-`));
          
          // 如果都不在预定义列表中，保持原顺序
          if (aChunk === -1 && bChunk === -1) {
            return 0;
          }
          
          // 将预定义的放在前面
          if (aChunk === -1) return 1;
          if (bChunk === -1) return -1;
          
          // 根据预定义顺序排序
          return aChunk - bChunk;
        });
      }
    },
    // 构建前执行类型检查，如果有问题会中断构建
    rollupOptions: {
      onwarn(warning, warn) {
        // 忽略某些警告
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks: (id) => {
          // 先检查是否在预定义的chunks中 - 从依赖关系最底层的开始检查
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-core';
          }
          
          if (id.includes('node_modules/@reduxjs/toolkit') || 
              id.includes('node_modules/react-redux')) {
            return 'redux-core';
          }
          
          if (id.includes('node_modules/redux-persist')) {
            return 'redux-persist';
          }
          
          if (id.includes('node_modules/react-router-dom') || 
              id.includes('node_modules/@remix-run')) {
            return 'router';
          }
          
          if (id.includes('node_modules/styled-components') || 
              id.includes('node_modules/@reach/dialog')) {
            return 'ui-components';
          }
          
          if (id.includes('node_modules/dayjs') || 
              id.includes('node_modules/qs') || 
              id.includes('node_modules/copy-to-clipboard') || 
              id.includes('node_modules/bignumber.js') || 
              id.includes('node_modules/ua-parser-js')) {
            return 'utils-common';
          }
          
          if (id.includes('node_modules/@lingui/') || 
              id.includes('node_modules/make-plural')) {
            return 'i18n';
          }
          
          // 功能性库 - 放在所有基础库之后检查
          if (id.includes('node_modules/html2canvas') || 
              id.includes('node_modules/react-markdown') || 
              id.includes('node_modules/@microsoft/fetch-event-source')) {
            return 'feature-libs';
          }
          // 默认情况下，不进行特殊分块
          return null;
        },
        // 增加对入口chunks依赖明确声明
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
