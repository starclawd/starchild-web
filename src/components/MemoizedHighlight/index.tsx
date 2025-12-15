import { vm } from 'pages/helper'
import { memo, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import 'highlight.js/styles/vs2015.css'

hljs.registerLanguage('python', python)

const MemoizedHighlightWrapper = styled.div`
  height: fit-content;
  color: ${({ theme }) => theme.textL2};
  /* 确保代码块可以正确换行和显示 */
  pre {
    display: flex;
    margin: 0;
    height: fit-content;
    /* white-space: pre-wrap; */
    /* word-wrap: break-word; */
    background: transparent !important;
    line-height: 1.4;
    width: 100%;
  }

  code {
    font-size: 14px;
    padding: 0;
    overflow-x: unset;
    height: fit-content;
    /* white-space: pre-wrap;
    word-wrap: break-word; */
    background: transparent !important;
  }

  .hljs {
    background: transparent !important;
    color: ${({ theme }) => theme.textL2} !important;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      code {
        font-size: 0.14rem;
      }
    `}
`

export default memo(
  ({ className, children }: { className: string; children: string }) => {
    const [isResizing, setIsResizing] = useState(false)
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const codeRef = useRef<HTMLElement>(null)

    // 监听窗口大小变化，添加防抖机制
    useEffect(() => {
      const handleResize = () => {
        setIsResizing(true)

        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current)
        }

        resizeTimeoutRef.current = setTimeout(() => {
          setIsResizing(false)
        }, 150) // 150ms 防抖延迟
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current)
        }
      }
    }, [])

    // 使用 highlight.js 进行代码高亮
    useEffect(() => {
      if (codeRef.current && !isResizing) {
        // 清除之前的高亮
        codeRef.current.removeAttribute('data-highlighted')

        // 安全地设置代码内容，确保HTML被转义
        codeRef.current.textContent = children

        // 应用新的高亮
        hljs.highlightElement(codeRef.current)
      }
    }, [children, className, isResizing])

    return (
      <MemoizedHighlightWrapper>
        {isResizing ? (
          // 在窗口大小变化时显示简化版本，避免卡死
          <pre>
            <code>{children}</code>
          </pre>
        ) : (
          <pre>
            <code ref={codeRef} className={`${className} scroll-style`}>
              {/* 内容通过 useEffect 中的 textContent 安全设置 */}
            </code>
          </pre>
        )}
      </MemoizedHighlightWrapper>
    )
  },
  (prevProps, nextProps) => {
    // 只有当代码内容真正改变时才重新渲染
    return prevProps.children === nextProps.children && prevProps.className === nextProps.className
  },
)
