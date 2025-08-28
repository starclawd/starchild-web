#!/usr/bin/env node
/**
 * Bundle 大小分析脚本
 * 用于分析打包文件大小并提供优化建议
 */

import fs from 'fs'
import path from 'path'

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeBundleSize(distPath = './dist') {
  if (!fs.existsSync(distPath)) {
    console.log('❌ dist 目录不存在，请先运行构建命令')
    return
  }

  const jsDir = path.join(distPath, 'assets/js')
  const cssDir = path.join(distPath, 'assets/css')

  if (!fs.existsSync(jsDir)) {
    console.log('❌ JS 文件目录不存在')
    return
  }

  console.log('📊 Bundle 大小分析报告\n')
  console.log('=' * 60)

  // 分析 JS 文件
  const jsFiles = fs.readdirSync(jsDir).filter((file) => file.endsWith('.js') && !file.endsWith('.map'))
  const jsFilesWithSize = jsFiles
    .map((file) => {
      const filePath = path.join(jsDir, file)
      const stats = fs.statSync(filePath)
      return { name: file, size: stats.size, type: 'js' }
    })
    .sort((a, b) => b.size - a.size)

  console.log('🔸 JavaScript 文件 (按大小排序):')
  let totalJsSize = 0
  jsFilesWithSize.forEach((file, index) => {
    totalJsSize += file.size
    const sizeStr = formatBytes(file.size)
    const indicator = file.size > 500 * 1024 ? '🔴' : file.size > 200 * 1024 ? '🟡' : '🟢'
    console.log(`${index + 1}.`.padStart(3) + ` ${indicator} ${file.name.padEnd(40)} ${sizeStr}`)
  })
  console.log(`\n📦 总 JS 大小: ${formatBytes(totalJsSize)}`)

  // 分析 CSS 文件
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter((file) => file.endsWith('.css'))
    const cssFilesWithSize = cssFiles
      .map((file) => {
        const filePath = path.join(cssDir, file)
        const stats = fs.statSync(filePath)
        return { name: file, size: stats.size, type: 'css' }
      })
      .sort((a, b) => b.size - a.size)

    console.log('\n🔸 CSS 文件:')
    let totalCssSize = 0
    cssFilesWithSize.forEach((file, index) => {
      totalCssSize += file.size
      const sizeStr = formatBytes(file.size)
      console.log(`${index + 1}.`.padStart(3) + ` 🟦 ${file.name.padEnd(40)} ${sizeStr}`)
    })
    console.log(`\n🎨 总 CSS 大小: ${formatBytes(totalCssSize)}`)
  }

  // 分析大文件并给出建议
  console.log('\n🚀 优化建议:')
  const largeFiles = jsFilesWithSize.filter((file) => file.size > 500 * 1024)

  if (largeFiles.length > 0) {
    console.log('\n⚠️  发现大文件 (>500KB):')
    largeFiles.forEach((file) => {
      console.log(`   • ${file.name} (${formatBytes(file.size)})`)

      // 根据文件名推测优化建议
      if (file.name.includes('wagmi') || file.name.includes('web3')) {
        console.log('     💡 建议: 考虑按需加载 Web3 功能，或在用户连接钱包时才加载')
      } else if (file.name.includes('chart') || file.name.includes('echarts')) {
        console.log('     💡 建议: 图表库可以懒加载，在需要显示图表时再加载')
      } else if (file.name.includes('lottie')) {
        console.log('     💡 建议: 动画库可以按需加载，考虑使用 CSS 动画替代部分 Lottie 动画')
      } else if (file.name.includes('index') && file.size > 1024 * 1024) {
        console.log('     💡 建议: 主包过大，需要进一步拆分模块，使用更细粒度的代码分割')
      }
    })
  }

  const mediumFiles = jsFilesWithSize.filter((file) => file.size > 200 * 1024 && file.size <= 500 * 1024)
  if (mediumFiles.length > 0) {
    console.log('\n⚡ 中等大小文件 (200-500KB):')
    mediumFiles.forEach((file) => {
      console.log(`   • ${file.name} (${formatBytes(file.size)})`)
    })
    console.log('     💡 建议: 这些文件大小合适，但可以考虑进一步优化')
  }

  // 检查是否有重复的依赖
  console.log('\n🔍 潜在问题检查:')
  const chunkNames = jsFilesWithSize.map((f) => f.name)

  if (chunkNames.some((name) => name.includes('react')) && chunkNames.length > 1) {
    console.log('   ✅ React 已被正确分离到独立 chunk')
  }

  if (chunkNames.some((name) => name.includes('wagmi') || name.includes('web3'))) {
    console.log('   ✅ Web3 库已被分离到独立 chunk')
  }

  console.log('\n📈 推荐的优化策略:')
  console.log('   1. 🎯 路由级别的代码分割 - 确保每个页面都是懒加载')
  console.log('   2. 🔧 组件级别的懒加载 - 大型组件按需加载')
  console.log('   3. 📚 库的按需引入 - 只导入使用到的功能')
  console.log('   4. 🗜️  启用 gzip/brotli 压缩')
  console.log('   5. 🌐 使用 CDN 加载大型第三方库')
  console.log('   6. 📦 考虑使用 Webpack Bundle Analyzer 进行更详细分析')

  console.log('\n' + '=' * 60)
  console.log(`📊 分析完成! 总计 ${jsFilesWithSize.length} 个 JS 文件`)
}

// 运行分析
analyzeBundleSize()
