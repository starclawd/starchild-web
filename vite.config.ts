import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { spawn } from 'child_process'
// @ts-ignore
import eslint from 'vite-plugin-eslint'
import { visualizer } from 'rollup-plugin-visualizer'

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
          shell: true,
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
    },
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
              fileName: false,
            },
          ],
        ],
      },
    }),
    typeCheck(),
    eslint({
      failOnError: false,
      failOnWarning: false,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules/**', 'dist/**'],
      lintOnStart: true,
      emitError: true,
      emitWarning: true,
    }),
    // 添加打包分析插件，只在构建时启用
    process.env.ANALYZE &&
      visualizer({
        filename: 'dist/bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
  ].filter(Boolean),

  // 依赖优化配置
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'styled-components',
      'dayjs',
      'bignumber.js',
      'react-router-dom',
      '@tanstack/react-query',
      'copy-to-clipboard',
      'qs',
    ],
    exclude: [
      // 避免预构建有循环依赖风险的包
      '@noble/secp256k1',
      '@noble/hashes',
      '@noble/curves',
    ],
  },

  // 服务器配置
  server: {
    host: '0.0.0.0',
    port: 6066,
    allowedHosts: ['9d63cb846602.ngrok-free.app'],
    proxy: {
      '/starchildTestnet': {
        target: 'https://go-api-testnet-a516af3dc7f6.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/starchildTestnet/, '/v1'),
      },
      '/chatTestnet': {
        target: 'https://tg-api-testnet-899f9ba9abd5.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatTestnet/, ''),
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      api: path.resolve(__dirname, './src/api'),
      components: path.resolve(__dirname, './src/components'),
      constants: path.resolve(__dirname, './src/constants'),
      hooks: path.resolve(__dirname, './src/hooks'),
      i18n: path.resolve(__dirname, './src/i18n'),
      locales: path.resolve(__dirname, './src/locales'),
      pages: path.resolve(__dirname, './src/pages'),
      routes: path.resolve(__dirname, './src/routes'),
      store: path.resolve(__dirname, './src/store'),
      styles: path.resolve(__dirname, './src/styles'),
      types: path.resolve(__dirname, './src/types'),
      App: path.resolve(__dirname, './src/App'),
      utils: path.resolve(__dirname, './src/utils'),
      assets: path.resolve(__dirname, './src/assets'),
      theme: path.resolve(__dirname, './src/theme'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.d.ts'],
  },

  define: {
    'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV),
    'process.env.VITE_TG_AUTH_TOKEN': JSON.stringify(process.env.VITE_TG_AUTH_TOKEN),
    global: 'globalThis',
  },

  // 构建配置
  build: {
    sourcemap: process.env.BUILD_ENV === 'development',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: process.env.BUILD_ENV === 'production',
        drop_debugger: process.env.BUILD_ENV === 'production',
        pure_funcs: process.env.BUILD_ENV === 'production' ? ['console.log', 'console.info'] : [],
        conditionals: true,
        unused: true,
        // 更激进的 tree-shaking
        side_effects: false,
      },
    },
    // 启用更好的 tree-shaking
    modulePreload: {
      polyfill: false, // 不需要 polyfill，减少包大小
    },

    rollupOptions: {
      onwarn(warning, warn) {
        // 忽略某些常见警告
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        // 忽略循环依赖警告 - 但不要过度忽略
        if (
          warning.code === 'CIRCULAR_DEPENDENCY' &&
          (warning.message?.includes('@noble/') ||
            warning.message?.includes('secp256k1') ||
            warning.message?.includes('ox/_esm'))
        ) {
          return
        }
        warn(warning)
      },

      output: {
        // 使用对象形式的 manualChunks（更稳定）
        manualChunks: {
          // React 核心 - 分离 react 和 react-dom 避免重复打包
          'react-core': ['react'],
          'react-dom-vendor': ['react-dom', 'react-dom/client', 'react-dom/server'],

          // 样式库
          'ui-vendor': ['styled-components'],

          // 状态管理
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],

          // 路由
          'router-vendor': ['react-router-dom'],

          // 国际化
          'i18n-vendor': ['@lingui/core', '@lingui/react', '@lingui/macro'],
          'viem-vendor': ['viem'],
          'wagmi-vendor': ['wagmi'],

          // AppKit 相关 - 分离成独立模块
          'appkit-core-vendor': ['@reown/appkit'],
          'appkit-react-vendor': ['@reown/appkit/react'],
          'appkit-networks-vendor': ['@reown/appkit/networks'],
          'appkit-adapter-vendor': ['@reown/appkit-adapter-wagmi'],
          'walletconnect-vendor': ['@walletconnect/universal-provider'],

          // 数据查询
          'query-vendor': ['@tanstack/react-query'],

          // 图表库
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'lightweight-charts'],

          // 动画库
          'animation-vendor': ['lottie-web'],

          // 基础工具库
          'utils-vendor': ['dayjs', 'bignumber.js', 'copy-to-clipboard', 'qs'],

          // 图像处理库
          'canvas-vendor': ['html2canvas'],

          // Markdown 和代码高亮
          'markdown-vendor': ['react-markdown'],
          'highlight-vendor': ['highlight.js'],

          // Toast 和其他 UI 库
          'toast-vendor': ['react-toastify'],

          // QR 码库
          'qr-vendor': ['qrcode.react'],

          // 压缩和数据处理
          'compress-vendor': ['json-bigint'],

          // 头像和其他小工具
          'avatar-vendor': ['boring-avatars'],

          // 浏览器工具
          'browser-vendor': ['ua-parser-js'],

          // WebSocket
          'websocket-vendor': ['react-use-websocket'],

          // 开发调试工具
          'debug-vendor': ['vconsole'],

          // 对话框和弹窗
          'dialog-vendor': ['@reach/dialog'],
        },

        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
})
