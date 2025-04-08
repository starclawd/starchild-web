export const PAGE_SIZE = 10

export const ANI_DURATION = 0.3

// 环境常量
export const BUILD_ENV = process.env.BUILD_ENV || 'development'

// 环境显示名称
export const BUILD_ENV_NAMES = {
  development: '开发环境',
  test: '测试环境',
  stage: '预发布环境',
  production: '生产环境',
  papertrade: '模拟交易环境'
}