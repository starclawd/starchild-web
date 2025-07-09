import dayjs from 'dayjs'
/**
 * 图片处理工具函数
 */

interface AddTextToImageOptions {
  text: string
  imageUrl: string
  fontSize?: number
  fontFamily?: string
  fontColor?: string
  backgroundColor?: string
  padding?: number
  lineHeight?: number
  position?: 'top' | 'bottom' | 'left' | 'right'
  textAlign?: 'left' | 'center' | 'right'
  parameter?: any
}

/**
 * 将文本和图片拼接在一起
 * @param options 配置选项
 * @returns Promise<string> 返回拼接后的图片的 data URL
 */
export async function addTextToImage(options: AddTextToImageOptions): Promise<string> {
  const {
    text,
    imageUrl,
    parameter,
    fontSize = 30,
    fontFamily = 'Arial, "Microsoft YaHei", sans-serif',
    fontColor = '#FFFFFF',
    backgroundColor = 'rgba(23, 26, 36, 1)',
    padding = 20,
    lineHeight = 1.4,
    position = 'top',
    textAlign = 'left',
  } = options

  // 解析 JSON 列表字符串
  let processedText: string
  try {
    const parsedData = JSON.parse(text)
    if (Array.isArray(parsedData)) {
      const list = parsedData.map((text, index) => {
        if (index === parsedData.length - 1) {
          return text
        }
        return `${index + 1}. ${text}`
      })
      const symbol = parameter?.symbol || ''
      const interval = parameter?.interval || ''
      const time = `${dayjs.tz(new Date(), 'Etc/UTC').format('YYYY-MM-DD HH:mm:ss')} UTC`
      const title = `${symbol.replace('BINANCE:', '').replace('WOONETWORK:', '')} ${interval}     ${time}`
      list.unshift(title)
      // 如果是数组，将每个元素用换行符连接
      processedText = list.join('\n')
    } else {
      // 如果不是数组，使用原始文本
      processedText = text
    }
  } catch (error) {
    // 如果解析失败，使用原始文本
    processedText = text
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('无法获取 canvas context'))
          return
        }

        // 设置字体样式来计算文本尺寸
        ctx.font = `${fontSize}px ${fontFamily}`

        // 根据位置计算画布尺寸和文本区域
        let canvasWidth: number
        let canvasHeight: number
        let imgX: number
        let imgY: number
        let textX: number
        let textY: number
        let textWidth: number
        let textHeight: number

        switch (position) {
          case 'top':
          case 'bottom': {
            // 文字铺满图片宽度
            textWidth = img.width
            canvasWidth = img.width
            // 计算文本换行
            const linesVertical = wrapText(ctx, processedText, textWidth - padding * 2)
            textHeight = linesVertical.length * fontSize * lineHeight + padding * 2
            canvasHeight = img.height + textHeight

            if (position === 'top') {
              imgX = 0
              imgY = textHeight
              textX = 0
              textY = 0
            } else {
              imgX = 0
              imgY = 0
              textX = 0
              textY = img.height
            }
            break
          }

          case 'left':
          case 'right': {
            // 文字铺满图片高度
            textHeight = img.height
            canvasHeight = img.height
            // 先估算文本宽度，然后计算换行
            const estimatedTextWidth = Math.max(200, img.width * 0.4) // 最小200px，或图片宽度的40%
            const linesHorizontal = wrapText(ctx, processedText, estimatedTextWidth - padding * 2)
            textWidth = estimatedTextWidth
            canvasWidth = img.width + textWidth

            if (position === 'left') {
              imgX = textWidth
              imgY = 0
              textX = 0
              textY = 0
            } else {
              imgX = 0
              imgY = 0
              textX = img.width
              textY = 0
            }
            break
          }

          default:
            throw new Error('不支持的位置配置')
        }

        // 设置画布尺寸
        canvas.width = canvasWidth
        canvas.height = canvasHeight

        // 填充背景色
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // 绘制图片
        ctx.drawImage(img, imgX, imgY)

        // 绘制文本
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = fontColor
        ctx.textAlign = textAlign as CanvasTextAlign

        // 重新计算文本换行（使用实际的文本区域宽度）
        const finalLines = wrapText(ctx, processedText, textWidth - padding * 2)

        finalLines.forEach((line, index) => {
          let x: number
          switch (textAlign) {
            case 'center':
              x = textX + textWidth / 2
              break
            case 'right':
              x = textX + textWidth - padding
              break
            case 'left':
            default:
              x = textX + padding
              break
          }

          const y = textY + padding + (index + 1) * fontSize * lineHeight
          ctx.fillText(line, x, y)
        })

        // 返回结果
        resolve(canvas.toDataURL('image/png'))
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    img.src = imageUrl
  })
}

/**
 * 文本换行处理
 * @param ctx Canvas 2D context
 * @param text 要换行的文本
 * @param maxWidth 最大宽度
 * @returns 换行后的文本数组
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  const paragraphs = text.split('\n')

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('')
      continue
    }

    // 对于中文文本，按字符分割而不是按空格
    const chars = paragraph.split('')
    let currentLine = ''

    for (const char of chars) {
      const testLine = currentLine + char
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = char
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }
  }

  return lines
}

/**
 * 下载图片
 * @param dataUrl 图片的 data URL
 * @param filename 文件名
 */
export function downloadImage(dataUrl: string, filename: string = 'image-with-text.png'): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
