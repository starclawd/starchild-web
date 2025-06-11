import { vm } from "pages/helper"
import { memo, useEffect, useRef, useState } from "react"
import Highlight from "react-highlight"
import styled, { css } from "styled-components"
import 'highlight.js/styles/vs2015.css'

const MemoizedHighlightWrapper = styled.div`
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

  ${({ theme }) => theme.isMobile && css`
    code {
      font-size: 0.14rem;
    }
  `}
`

export default memo(({ className, children }: { className: string; children: string }) => {
  const [isResizing, setIsResizing] = useState(false)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
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
  return <MemoizedHighlightWrapper>
    {
       isResizing ? (
        // 在窗口大小变化时显示简化版本，避免卡死
        <pre>
          <code>
            {children}
          </code>
        </pre>
      ) : (
        <Highlight className={className}>{children}</Highlight>
      )
    }
  </MemoizedHighlightWrapper>
}, (prevProps, nextProps) => {
  // 只有当代码内容真正改变时才重新渲染
  return prevProps.children === nextProps.children && prevProps.className === nextProps.className
})
