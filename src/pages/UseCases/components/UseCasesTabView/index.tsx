import { memo, useState } from 'react'
import styled from 'styled-components'
import { TAB_CONTENT_CONFIG, TabKey } from 'constants/useCases'
import { useActiveTab } from 'store/usecases/hooks'
import { BaseButton, ButtonCommon, ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import useCasesDemoBg from 'assets/usecases/use-cases-demo-bg.png'
import { Trans } from '@lingui/react/macro'

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
  background-size: 1080px 640px;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
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
`

const LeftContentArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ContentIcon = styled(IconBase)`
  font-size: 24px;
  color: ${({ theme }) => theme.textL1};
  flex-shrink: 0;
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
`

const ContentDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
  color: ${({ theme }) => theme.textL3};
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
`

// 右侧按钮区域
const RightButtonsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

// Play Demo 按钮 - 使用 ButtonCommon (主要操作)
const PlayDemoButton = styled(ButtonCommon)`
  height: 36px;
  font-size: 14px;
  width: auto;
  white-space: nowrap;
  gap: 6px;
  padding: 8px 12px;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid white;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
`

// Refresh 按钮 - 使用 ButtonBorder (次要操作)
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
`

// Use This Prompt 按钮 - 使用 ButtonBorder (次要操作)
const UsePromptButton = styled(ButtonBorder)`
  height: 36px;
  font-size: 14px;
  width: auto;
  white-space: nowrap;
  padding: 8px 12px;
`

// 渲染单个Tab内容的组件
const UseCasesTabContentComponent = memo(({ activeTab }: { activeTab: string }) => {
  const content = TAB_CONTENT_CONFIG[activeTab as TabKey]
  const [isPlaying, setIsPlaying] = useState(false)

  if (!content) return null

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handleRefresh = () => {
    // TODO: 实现刷新逻辑
    setIsPlaying(false)
  }

  const handleUsePrompt = () => {
    // TODO: 实现页面跳转逻辑
    console.log('Use this prompt clicked')
  }

  return (
    <TabContent>
      {!isPlaying && <CenterPlayButton onClick={handlePlay} />}

      <BottomOverlay>
        <LeftContentArea>
          <ContentIcon className={content.icon} />
          <ContentTextArea>
            <ContentTitle>{content.title}</ContentTitle>
            <ContentDescription>{content.description}</ContentDescription>
          </ContentTextArea>
        </LeftContentArea>

        <RightButtonsArea>
          {isPlaying ? (
            <RefreshButton onClick={handleRefresh}>
              <IconBase className='icon-chat-refresh' />
              <Trans>Refresh</Trans>
            </RefreshButton>
          ) : (
            <PlayDemoButton onClick={handlePlay}>
              <Trans>Play demo</Trans>
            </PlayDemoButton>
          )}

          <UsePromptButton onClick={handleUsePrompt}>
            <Trans>Use this prompt</Trans>
          </UsePromptButton>
        </RightButtonsArea>
      </BottomOverlay>
    </TabContent>
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
