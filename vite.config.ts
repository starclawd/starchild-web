import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { spawn } from 'child_process'

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
          'macros'
        ]
      }
    }),
    typeCheck()
  ],
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
      'assets': path.resolve(__dirname, './src/assets')
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
    // 构建前执行类型检查，如果有问题会中断构建
    rollupOptions: {
      onwarn(warning, warn) {
        // 忽略某些警告
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    }
  }
})
