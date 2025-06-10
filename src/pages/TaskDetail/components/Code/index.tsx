import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import useCopyContent from 'hooks/useCopyContent'
import { vm } from 'pages/helper'
import { memo, useCallback, useMemo } from 'react'
import { useTaskDetail } from 'store/backtest/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import Highlight from 'react-highlight'
import NoData from 'components/NoData'
import 'highlight.js/styles/vs2015.css'

const CodeWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  border-bottom: none;
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  ${({ theme }) => theme.isMobile && css`
    flex-shrink: 0;
    border-radius: ${vm(24)} ${vm(24)} 0 0;
  `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 58px;
  padding: 16px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px; 
  color: ${({ theme }) => theme.textL1};
  background-color: #232527;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(58)};
    padding: ${vm(16)};
    font-size: 0.18rem;
    line-height: 0.26rem;
  `}
` 

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-copy {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile
  ? css`
      gap: ${vm(4)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      .icon-chat-copy {
        font-size: 0.18rem;
      }
    `
    : css`
      cursor: pointer;
    `}
`

const Content = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 16px;
  flex-grow: 1;
  min-height: 0;
  width: 100%;
  color: ${({ theme }) => theme.textL1};
  .no-data-wrapper {
    background-color: transparent;
  }
  
  /* 确保代码块可以正确换行和显示 */
  pre {
    margin: 0;
    /* white-space: pre-wrap; */
    /* word-wrap: break-word; */
    background: transparent !important;
    line-height: 1.4;
    width: 100%;
  }
  
  code {
    font-size: 14px;
    /* white-space: pre-wrap;
    word-wrap: break-word; */
    background: transparent !important;
  }
  
  .hljs {
    background: transparent !important;
    color: ${({ theme }) => theme.textL1} !important;
  }
  
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(16)};
    code {
      font-size: 0.14rem;
    }
  `}
`

export default memo(function Code() {
  const theme = useTheme()
  const [{ code }] = useTaskDetail()
  const ContentRef = useScrollbarClass<HTMLDivElement>()
  
  // 从 markdown 代码块中提取纯代码内容，或处理转义的换行符
  const extractExecutableCode = useCallback((codeContent: string) => {
    if (!codeContent) return ''
    
    // 首先检查是否是 markdown 代码块格式
    const codeBlockRegex = /```[\w]*\n?([\s\S]*?)```/g
    const matches = codeContent.match(codeBlockRegex)
    
    if (matches && matches.length > 0) {
      // 提取第一个代码块的内容
      const firstMatch = matches[0]
      // 去掉开头的```language和结尾的```
      const cleanCode = firstMatch
        .replace(/^```[\w]*\n?/, '') // 去掉开头的```和语言标识
        .replace(/```$/, '') // 去掉结尾的```
        .trim()
      return cleanCode
    }
    
    // 如果不是 markdown 格式，检查是否包含转义的换行符
    if (codeContent.includes('\\n')) {
      // 将转义的换行符转换为实际的换行符
      return codeContent
        .replace(/\\n/g, '\n')     // 转义的换行符
        .replace(/\\t/g, '\t')     // 转义的制表符
        .replace(/\\r/g, '\r')     // 转义的回车符
        .replace(/\\"/g, '"')      // 转义的双引号
        .replace(/\\'/g, "'")      // 转义的单引号
        .replace(/\\\\/g, '\\')    // 转义的反斜杠
    }
    
    // 其他情况直接返回原内容
    return codeContent
  }, [])

  const { copyWithCustomProcessor } = useCopyContent({ 
    mode: 'custom', 
    customProcessor: extractExecutableCode 
  })

  const codeContent = useMemo(() => {
    return extractExecutableCode(code)
  }, [code, extractExecutableCode])
  
  return <CodeWrapper
    $borderColor={theme.bgT30}
    $borderRadius={24}
  >
    <Title>
      <Trans>Code</Trans>
      <CopyWrapper onClick={() => code ? copyWithCustomProcessor(code) : null}>
        <IconBase className="icon-chat-copy" />
        <Trans>Copy</Trans>
      </CopyWrapper>
    </Title>
    <Content ref={ContentRef} className={!theme.isMobile ? 'scroll-style' : ''}>
      {code ? <Highlight className="python">{codeContent}</Highlight> : <NoData />}
    </Content>
  </CodeWrapper>
})
