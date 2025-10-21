import { memo, useState } from 'react'
import styled, { css } from 'styled-components'
import { TAB_CONTENT_CONFIG, TabKey } from 'constants/useCases'
import { useActiveTab } from 'store/usecases/hooks'
import { BaseButton, ButtonCommon, ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import useCasesDemoBg from 'assets/usecases/use-cases-demo-bg.png'
import { Trans } from '@lingui/react/macro'
import ChatContent from '../ChatContent'
import { useAiResponseContentList, useSendAiContent } from 'store/usecases/hooks/useChatContentHooks'
import { useIsMobile } from 'store/application/hooks'
import { vm } from 'pages/helper'

const TabViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const TabContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 640px;
  background-image: url(${useCasesDemoBg});
  background-size: 150%;
  background-position: center 44%;
  background-repeat: no-repeat;
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(263)};
      background-size: 190%;
      background-position: center 58%;
    `}
`

const BottomOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  background: #0b0c0e8a;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(12)};
      justify-content: flex-start;
      backdrop-filter: blur(${vm(12)});
      -webkit-backdrop-filter: blur(${vm(12)});
    `}
`

const LeftContentArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const ContentIcon = styled(IconBase)`
  font-size: 24px;
  color: ${({ theme }) => theme.textL1};
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.18rem;
    `}
`

const ContentTextArea = styled.div`
  display: flex;
  flex-direction: column;
`

const ContentTitle = styled.h3`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0 0 ${vm(4)} 0;
      font-size: 0.16rem;
      line-height: 0.24rem;
    `}
`

const ContentDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

// 中心播放按钮样式
const CenterPlayButton = styled(BaseButton)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: ${({ theme }) => theme.brand100};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.7;
  }

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 20px solid ${({ theme }) => theme.textL1};
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    margin-left: 4px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      top: 35%;
      width: ${vm(60)};
      height: ${vm(60)};
      border-radius: ${vm(30)};
    `}
`

// Refresh 按钮 - 只在桌面端使用
const RefreshButton = styled(ButtonBorder)`
  height: 36px;
  font-size: 14px;
  width: auto;
  white-space: nowrap;
  gap: 6px;
  padding: 8px 12px;

  /* 图标和文字间距 */
  .icon-base {
    margin-right: 6px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(36)};
      font-size: 0.14rem;
    `}
`

// 通用按钮区域 - 支持桌面端和移动端
const ButtonsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: ${vm(12)} ${vm(16)} ${vm(24)} ${vm(16)};
      background: ${theme.bgL0};
      border-top: 1px solid ${theme.bgT30};
      gap: ${vm(12)};
      z-index: 1000;
    `}
`

// 通用播放按钮 - 支持移动端和桌面端样式
const PlayButton = styled(ButtonCommon)`
  height: 36px;
  font-size: 14px;
  width: auto;
  white-space: nowrap;
  gap: 6px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.brand100};

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid white;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    flex: 1;
    height: ${vm(44)};
    font-size: 0.16rem;
    font-weight: 500;
    border-radius: ${vm(60)};
    
    &::before {
      border-left-width: ${vm(8)};
      border-top-width: ${vm(5)};
      border-bottom-width: ${vm(5)};
      margin-right: ${vm(6)};
    }
  `}
`

const UsePromptButton = styled(ButtonBorder)<{ $isMobile?: boolean }>`
  height: 36px;
  font-size: 14px;
  width: auto;
  white-space: nowrap;
  padding: 8px 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex: 1;
      height: ${vm(44)};
      font-size: 0.16rem;
      font-weight: 500;
      border-radius: ${vm(60)};
    `}
`

// 渲染单个Tab内容的组件
const UseCasesTabContentComponent = memo(({ activeTab }: { activeTab: string }) => {
  const content = TAB_CONTENT_CONFIG[activeTab as TabKey]
  const [isPlaying, setIsPlaying] = useState(false)
  const sendAiContent = useSendAiContent()
  const isMobile = useIsMobile()

  if (!content) return null

  const handlePlay = () => {
    setIsPlaying(true)
    setTimeout(() => {
      sendAiContent({
        value: 'TA sol',
      })
    }, 1000)
  }

  const handleRefresh = () => {
    // TODO: 实现刷新逻辑
    setIsPlaying(false)
  }

  const handleUsePrompt = () => {
    // TODO: 实现页面跳转逻辑
    console.log('Use this prompt clicked')
  }

  const ButtonsContent = () => (
    <>
      {isPlaying ? (
        <RefreshButton onClick={handleRefresh}>
          <IconBase className='icon-chat-refresh' />
          <Trans>Refresh</Trans>
        </RefreshButton>
      ) : (
        <PlayButton onClick={handlePlay}>
          <Trans>Play demo</Trans>
        </PlayButton>
      )}

      <UsePromptButton onClick={handleUsePrompt}>
        <Trans>Use this prompt</Trans>
      </UsePromptButton>
    </>
  )

  return (
    <>
      <TabContent>
        {isPlaying ? <ChatContent /> : <CenterPlayButton onClick={handlePlay} />}

        <BottomOverlay>
          <LeftContentArea>
            <ContentIcon className={content.icon} />
            <ContentTextArea>
              <ContentTitle>{content.title}</ContentTitle>
              <ContentDescription>{content.description}</ContentDescription>
            </ContentTextArea>
          </LeftContentArea>

          {/* 桌面端按钮区域 */}
          {!isMobile && (
            <ButtonsArea>
              <ButtonsContent />
            </ButtonsArea>
          )}
        </BottomOverlay>
      </TabContent>

      {/* 移动端底部固定按钮 */}
      {isMobile && (
        <ButtonsArea>
          <ButtonsContent />
        </ButtonsArea>
      )}
    </>
  )
})

UseCasesTabContentComponent.displayName = 'UseCasesTabContentComponent'

function UseCasesTabView() {
  const [activeTab] = useActiveTab()

  return (
    <TabViewContainer>
      <UseCasesTabContentComponent activeTab={activeTab} />
    </TabViewContainer>
  )
}

UseCasesTabView.displayName = 'UseCasesTabView'

export default memo(UseCasesTabView)
