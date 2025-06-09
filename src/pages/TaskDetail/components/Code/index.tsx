import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import useToast, { TOAST_STATUS } from 'components/Toast'
import copy from 'copy-to-clipboard'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { vm } from 'pages/helper'
import { useCallback } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

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
  overflow-x: hidden;
  padding: 16px;
  flex-grow: 1;
  min-height: 0;
  width: 100%;
  .markdown-wrapper {
    display: block;
    padding-bottom: 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px; 
    ${({ theme }) => theme.isMobile && css`
      padding: ${vm(16)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
  }
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(16)};
  `}
`

export default function Code() {
  const theme = useTheme()
  const toast = useToast()
  const ContentRef = useScrollbarClass<HTMLDivElement>()
  const copyContent = useCallback((content: string) => {
    copy(content)
    toast({
      title: <Trans>Copied</Trans>,
      description: content,
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-copy',
      iconTheme: theme.textL1,
    })
  }, [toast, theme.textL1])
  return <CodeWrapper
    $borderColor={theme.bgT30}
    $borderRadius={24}
  >
    <Title>
      <Trans>Code</Trans>
      <CopyWrapper onClick={() => copyContent('123')}>
        <IconBase className="icon-chat-copy" />
        <Trans>Copy</Trans>
      </CopyWrapper>
    </Title>
    <Content ref={ContentRef} className={!theme.isMobile ? 'scroll-style' : ''}>
      <Markdown>
        123
      </Markdown>
    </Content>
  </CodeWrapper>
}
