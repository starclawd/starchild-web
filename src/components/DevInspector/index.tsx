import { memo, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import copy from 'copy-to-clipboard'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const Overlay = styled.div`
  position: fixed;
  pointer-events: none;
  border: 2px solid #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  z-index: 99998;
  transition: all 0.05s ease;
`

const TooltipLabel = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  background: #1a1a2e;
  border: 1px solid #00d4ff;
  border-radius: 4px;
  padding: 6px 10px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 11px;
  color: #00d4ff;
  white-space: nowrap;
  margin-bottom: 4px;
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ComponentTag = styled.div`
  color: #fff;
  font-weight: bold;
  margin-bottom: 2px;
`

const FilePath = styled.div`
  color: #888;
  font-size: 10px;
`

const HintText = styled.div`
  color: #00d4ff;
  margin-top: 4px;
  font-size: 10px;
`

const StatusBar = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 10px;
  right: 10px;
  background: ${({ $isActive }) => ($isActive ? '#1a1a2e' : '#2d1a1a')};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#00d4ff' : '#ff4444')};
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: ${({ $isActive }) => ($isActive ? '#00d4ff' : '#ff4444')};
  z-index: 99999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${pulse} 2s ease-in-out infinite;
`

const StatusDot = styled.div<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $isActive }) => ($isActive ? '#00ff00' : '#ff4444')};
`

const CopiedToast = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a2e;
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 16px 24px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #00ff00;
  z-index: 99999;
  box-shadow: 0 4px 30px rgba(0, 255, 0, 0.3);
  text-align: center;
`

interface ElementInfo {
  element: HTMLElement
  rect: DOMRect
  componentName: string
  filePath: string | null
  relativePath: string | null
  line: number | null
  column: number | null
}

// 从 className 解析 styled-components 组件名
function parseStyledComponentName(className: string): string | null {
  const styledPattern = /([A-Z][a-zA-Z0-9]*(?:__[A-Z][a-zA-Z0-9]*)?)-sc-/
  const match = className.match(styledPattern)
  if (match) {
    return match[1]
  }
  return null
}

// 判断是否为公共组件路径
function isCommonComponentPath(path: string | null): boolean {
  if (!path) return false
  return path.includes('/src/components/') || path.includes('src/components/')
}

// 从 DOM 元素获取组件信息
function getElementInfo(element: HTMLElement): ElementInfo | null {
  let current: HTMLElement | null = element
  let componentName = ''
  let filePath: string | null = null
  let relativePath: string | null = null
  let line: number | null = null
  let column: number | null = null

  // 存储公共组件信息，作为备选
  let commonComponentFilePath: string | null = null
  let commonComponentRelativePath: string | null = null
  let commonComponentLine: number | null = null
  let commonComponentColumn: number | null = null

  // 向上遍历找到有 data-inspector-file 属性或 styled-component 类名的元素
  while (current) {
    // 检查是否有 inspector 数据属性
    const inspectorFile = current.getAttribute('data-inspector-file')
    const inspectorPath = current.getAttribute('data-inspector-path')
    const inspectorLine = current.getAttribute('data-inspector-line')
    const inspectorColumn = current.getAttribute('data-inspector-column')

    if (inspectorFile) {
      // 检查是否为公共组件
      if (isCommonComponentPath(inspectorFile)) {
        // 如果还没有保存公共组件信息，保存下来作为备选
        if (!commonComponentFilePath) {
          commonComponentFilePath = inspectorFile
          commonComponentRelativePath = inspectorPath
          commonComponentLine = inspectorLine ? parseInt(inspectorLine, 10) : null
          commonComponentColumn = inspectorColumn ? parseInt(inspectorColumn, 10) : null
        }
        // 继续向上查找引用该公共组件的组件
      } else if (!filePath) {
        // 找到非公共组件的文件路径
        filePath = inspectorFile
        relativePath = inspectorPath
        line = inspectorLine ? parseInt(inspectorLine, 10) : null
        column = inspectorColumn ? parseInt(inspectorColumn, 10) : null
      }
    }

    // 检查 styled-component 类名获取组件名
    const className = current.className
    if (typeof className === 'string' && className && !componentName) {
      const parsed = parseStyledComponentName(className)
      if (parsed) {
        componentName = parsed
      }
    }

    // 如果已经找到了非公共组件的文件路径和组件名，可以停止
    if (filePath && componentName) {
      break
    }

    current = current.parentElement
  }

  // 如果没有找到非公共组件的文件路径，使用公共组件的路径作为备选
  if (!filePath && commonComponentFilePath) {
    filePath = commonComponentFilePath
    relativePath = commonComponentRelativePath
    line = commonComponentLine
    column = commonComponentColumn
  }

  // 如果没有找到组件名，使用标签名
  if (!componentName) {
    componentName = element.tagName.toLowerCase()
  }

  const targetElement = current || element
  const rect = targetElement.getBoundingClientRect()

  return {
    element: targetElement,
    rect,
    componentName,
    filePath,
    relativePath,
    line,
    column,
  }
}

export default memo(function DevInspector() {
  const [isActive, setIsActive] = useState(false)
  const [hoveredInfo, setHoveredInfo] = useState<ElementInfo | null>(null)
  const [showCopied, setShowCopied] = useState(false)
  const [copiedName, setCopiedName] = useState('')
  const [hasFilePath, setHasFilePath] = useState(false)

  // 监听快捷键 Shift + Alt + C 切换检查模式
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.code === 'KeyC') {
        e.preventDefault()
        e.stopPropagation()
        setIsActive((prev) => !prev)
        setHoveredInfo(null)
      }

      if (e.key === 'Escape' && isActive) {
        setIsActive(false)
        setHoveredInfo(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isActive])

  // 监听鼠标移动
  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
      if (!target || target.closest('[data-dev-inspector]')) {
        return
      }

      const info = getElementInfo(target)
      if (info) {
        setHoveredInfo(info)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isActive])

  // 点击处理：复制并打开 Cursor
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isActive || !hoveredInfo) return

      e.preventDefault()
      e.stopPropagation()

      const searchTerm = hoveredInfo.componentName.split('__')[0]

      // 复制组件名
      copy(searchTerm)
      setCopiedName(searchTerm)
      setHasFilePath(!!hoveredInfo.filePath)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)

      // 如果有文件路径，打开 Cursor
      if (hoveredInfo.filePath) {
        const line = hoveredInfo.line || 1
        const col = hoveredInfo.column || 0
        window.open(`cursor://file/${hoveredInfo.filePath}:${line}:${col}`)
      }

      // 关闭 inspector 模式
      setIsActive(false)
      setHoveredInfo(null)
    },
    [isActive, hoveredInfo],
  )

  // 监听点击事件
  useEffect(() => {
    if (!isActive) return

    window.addEventListener('click', handleClick, true)
    return () => window.removeEventListener('click', handleClick, true)
  }, [isActive, handleClick])

  if (!isActive && !showCopied) return null

  const displayPath = hoveredInfo?.relativePath ? `${hoveredInfo.relativePath}:${hoveredInfo.line}` : null

  return createPortal(
    <div data-dev-inspector>
      {/* 状态栏 */}
      {isActive && (
        <StatusBar $isActive={isActive}>
          <StatusDot $isActive={isActive} />
          <span>Inspector ON</span>
          <span style={{ color: '#888' }}>| ESC 退出</span>
        </StatusBar>
      )}

      {/* 高亮边框 + 提示 */}
      {isActive && hoveredInfo && (
        <Overlay
          style={{
            left: hoveredInfo.rect.left,
            top: hoveredInfo.rect.top,
            width: hoveredInfo.rect.width,
            height: hoveredInfo.rect.height,
          }}
        >
          <TooltipLabel>
            <ComponentTag>{hoveredInfo.componentName}</ComponentTag>
            {displayPath && <FilePath>{displayPath}</FilePath>}
            <HintText>{hoveredInfo.filePath ? '点击打开 Cursor' : '点击复制名称'}</HintText>
          </TooltipLabel>
        </Overlay>
      )}

      {/* 复制成功提示 */}
      {showCopied && (
        <CopiedToast>
          ✓ 已复制 &quot;{copiedName}&quot;
          <br />
          <span style={{ fontSize: '12px', color: '#888' }}>
            {hasFilePath ? '正在打开 Cursor...' : '⌘+Shift+F 搜索'}
          </span>
        </CopiedToast>
      )}
    </div>,
    document.body,
  )
})
