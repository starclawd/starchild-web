/**
 * Icon Font Generator Script
 *
 * 这个脚本用于替代 IcoMoon 网站的功能：
 * 1. 读取 src/assets/icons 目录中的 SVG 文件
 * 2. 移除 SVG 中的颜色属性（fill, stroke 等）
 * 3. 生成字体文件（woff, ttf, svg）
 * 4. 生成对应的 CSS 文件
 *
 * 使用方法: yarn icons
 */

import { generateFonts } from 'fantasticon'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// 配置路径
const SOURCE_DIR = path.join(projectRoot, 'src/assets/icons')
const TEMP_DIR = path.join(projectRoot, '.temp-icons')
const OUTPUT_DIR = path.join(projectRoot, 'public/icon_fonts')
const FONTS_DIR = path.join(OUTPUT_DIR, 'fonts')

/**
 * 移除 SVG 中的颜色属性
 */
function removeColorAttributes(svgContent) {
  // 移除 fill 属性（保留 fill="none"）
  svgContent = svgContent.replace(/\s+fill="(?!none)[^"]*"/gi, '')

  // 移除 stroke 颜色属性（保留 stroke="none"）
  svgContent = svgContent.replace(/\s+stroke="(?!none)[^"]*"/gi, '')

  // 移除 style 中的 fill 和 stroke 颜色
  svgContent = svgContent.replace(/style="[^"]*"/gi, (match) => {
    let style = match
    // 移除 fill 颜色
    style = style.replace(/fill\s*:\s*[^;}"]+;?/gi, '')
    // 移除 stroke 颜色
    style = style.replace(/stroke\s*:\s*[^;}"]+;?/gi, '')
    // 清理空的 style 属性
    if (style === 'style=""' || style === 'style=" "') {
      return ''
    }
    return style
  })

  return svgContent
}

/**
 * 规范化文件名（移除特殊字符，转换为小写）
 */
function normalizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * 准备临时目录，处理 SVG 文件
 */
async function prepareTempIcons() {
  console.log('📁 正在准备图标文件...')

  // 清理并创建临时目录
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }
  fs.mkdirSync(TEMP_DIR, { recursive: true })

  // 读取源目录中的 SVG 文件
  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.svg'))

  console.log(`   找到 ${files.length} 个 SVG 文件`)

  const processedIcons = []

  for (const file of files) {
    const sourcePath = path.join(SOURCE_DIR, file)
    const baseName = path.basename(file, '.svg')
    const normalizedName = normalizeFileName(baseName)
    const destPath = path.join(TEMP_DIR, `${normalizedName}.svg`)

    // 读取并处理 SVG 内容
    let content = fs.readFileSync(sourcePath, 'utf-8')
    content = removeColorAttributes(content)

    // 写入临时目录
    fs.writeFileSync(destPath, content)

    processedIcons.push({
      original: baseName,
      normalized: normalizedName,
    })
  }

  console.log('   ✅ 图标文件准备完成')
  return processedIcons
}

/**
 * 加载现有的 codepoints（保持与之前的 unicode 编码一致）
 */
function loadExistingCodepoints() {
  const selectionPath = path.join(OUTPUT_DIR, 'selection.json')

  if (!fs.existsSync(selectionPath)) {
    return undefined
  }

  try {
    const selection = JSON.parse(fs.readFileSync(selectionPath, 'utf-8'))
    const codepoints = {}

    if (selection.icons) {
      for (const icon of selection.icons) {
        if (icon.properties && icon.properties.name && icon.properties.code) {
          const name = normalizeFileName(icon.properties.name)
          codepoints[name] = icon.properties.code
        }
      }
    }

    console.log(`   📋 加载了 ${Object.keys(codepoints).length} 个现有的 codepoints`)
    return Object.keys(codepoints).length > 0 ? codepoints : undefined
  } catch (error) {
    console.warn('   ⚠️ 无法加载现有 codepoints，将生成新的编码')
    return undefined
  }
}

/**
 * 生成图标字体
 */
async function generateIconFonts() {
  console.log('🔧 正在生成图标字体...')

  // 清理并创建输出目录
  if (fs.existsSync(FONTS_DIR)) {
    fs.rmSync(FONTS_DIR, { recursive: true })
  }
  fs.mkdirSync(FONTS_DIR, { recursive: true })

  const existingCodepoints = loadExistingCodepoints()

  try {
    await generateFonts({
      inputDir: TEMP_DIR,
      outputDir: FONTS_DIR,
      name: 'icomoon',
      fontTypes: ['ttf', 'woff', 'svg'],
      assetTypes: ['json'],
      formatOptions: {
        svg: {
          centerHorizontally: true,
          normalize: true,
        },
      },
      codepoints: existingCodepoints,
      fontHeight: 1024,
      descent: 64,
      normalize: true,
      round: 10e12,
      selector: '.icon',
      prefix: 'icon',
      tag: 'i',
    })

    console.log('   ✅ 图标字体生成完成')
  } catch (error) {
    console.error('   ❌ 生成字体时出错:', error.message)
    throw error
  }
}

/**
 * 生成自定义 CSS 文件（与 IcoMoon 格式一致）
 */
async function generateCustomCSS() {
  console.log('📝 正在生成 CSS 文件...')

  const jsonPath = path.join(FONTS_DIR, 'icomoon.json')

  if (!fs.existsSync(jsonPath)) {
    console.error('   ❌ 找不到生成的 JSON 文件')
    return
  }

  const iconData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const timestamp = Date.now().toString(36)

  let css = `@font-face {
  font-family: 'icomoon';
  src:
    url('fonts/icomoon.ttf?${timestamp}') format('truetype'),
    url('fonts/icomoon.woff?${timestamp}') format('woff'),
    url('fonts/icomoon.svg?${timestamp}#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="icon-"], [class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

`

  // 按名称排序生成 CSS 规则
  const sortedIcons = Object.entries(iconData).sort((a, b) => a[0].localeCompare(b[0]))

  for (const [name, codepoint] of sortedIcons) {
    const hexCode = codepoint.toString(16).padStart(4, '0')
    css += `.icon-${name}:before {
  content: "\\${hexCode}";
}
`
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'style.css'), css)
  console.log('   ✅ CSS 文件生成完成')
}

/**
 * 生成 selection.json（兼容 IcoMoon 格式）
 */
async function generateSelectionJSON(processedIcons) {
  console.log('📄 正在生成 selection.json...')

  const jsonPath = path.join(FONTS_DIR, 'icomoon.json')

  if (!fs.existsSync(jsonPath)) {
    console.error('   ❌ 找不到生成的 JSON 文件')
    return
  }

  const iconData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  const selection = {
    IcoMoonType: 'selection',
    icons: [],
    height: 1024,
    metadata: {
      name: 'icomoon',
    },
    preferences: {
      showGlyphs: true,
      showQuickUse: true,
      showQuickUse2: true,
      showSVGs: true,
      fontPref: {
        prefix: 'icon-',
        metadata: {
          fontFamily: 'icomoon',
          majorVersion: 1,
          minorVersion: 0,
        },
        metrics: {
          emSize: 1024,
          baseline: 6.25,
          whitespace: 50,
        },
        embed: false,
        noie8: true,
        ie7: false,
      },
      imagePref: {
        prefix: 'icon-',
        png: true,
        useClassSelector: true,
        color: 0,
        bgColor: 16777215,
        classSelector: '.icon',
        name: 'icomoon',
      },
      historySize: 50,
      showCodes: true,
      gridSize: 16,
      showLiga: false,
    },
  }

  let order = 0
  const sortedIcons = Object.entries(iconData).sort((a, b) => a[0].localeCompare(b[0]))

  for (const [name, codepoint] of sortedIcons) {
    selection.icons.push({
      icon: {
        paths: [],
        attrs: [],
        grid: 0,
        tags: [name],
      },
      attrs: [],
      properties: {
        order: order++,
        id: order,
        name: name,
        prevSize: 32,
        code: codepoint,
      },
      setIdx: 0,
      setId: 0,
      iconIdx: order - 1,
    })
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'selection.json'), JSON.stringify(selection, null, 2))

  console.log('   ✅ selection.json 生成完成')
}

/**
 * 清理临时文件
 */
function cleanup() {
  console.log('🧹 正在清理临时文件...')

  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true })
  }

  // 删除中间 JSON 文件（保留在 fonts 目录中）
  const tempJsonPath = path.join(FONTS_DIR, 'icomoon.json')
  if (fs.existsSync(tempJsonPath)) {
    fs.unlinkSync(tempJsonPath)
  }

  console.log('   ✅ 清理完成')
}

/**
 * 主函数
 */
async function main() {
  console.log('')
  console.log('🎨 Icon Font Generator')
  console.log('=======================')
  console.log('')

  try {
    const processedIcons = await prepareTempIcons()
    await generateIconFonts()
    await generateCustomCSS()
    await generateSelectionJSON(processedIcons)
    cleanup()

    console.log('')
    console.log('✨ 图标字体生成成功！')
    console.log(`   输出目录: ${OUTPUT_DIR}`)
    console.log('')
  } catch (error) {
    console.error('')
    console.error('❌ 生成失败:', error.message)
    console.error(error.stack)
    cleanup()
    process.exit(1)
  }
}

main()
