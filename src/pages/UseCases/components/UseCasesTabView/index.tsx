import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'
import {
  TAB_CONTENT_CONFIG,
  TabKey,
  // 动画时间配置（主组件使用）
  CURSOR_MOVE_DURATION,
  BACKGROUND_FADE_DURATION,
  BUTTON_SCALE_DURATION,
  // 动画时序配置
  DELAY_CURSOR_REACH_BUTTON,
  DELAY_BUTTON_SCALE_UP,
  DELAY_BACKGROUND_FADE,
  USE_CASES_TAB_KEY,
} from 'constants/useCases'
import { useActiveTab, useIsPlaying } from 'store/usecases/hooks/useUseCasesHooks'
import { BaseButton, ButtonCommon, ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import useCasesDemoBg from 'assets/usecases/use-cases-demo-bg.png'
import { Trans } from '@lingui/react/macro'
import ChatContent from '../ChatContent'
import {
  useCloseStream,
  useAiResponseContentList,
  useSendAiContent,
  useIsShowDeepThink,
  useResetTempAiContentData,
  useTempAiContentData,
} from 'store/usecases/hooks/useChatContentHooks'
import { useAddNewThread, useSendAiContent as useSendAiContentToChat } from 'store/chat/hooks'
import { useIsMobile } from 'store/application/hooks'
import { vm } from 'pages/helper'
import { ROUTER } from 'pages/router'
import { useCurrentRouter } from 'store/application/hooks'
import GlowInput from './components/GlowInput'
import defalutCursor from 'assets/usecases/defalut-cursor.svg'
import useCasesDemoProcessBar from 'assets/usecases/use-cases-demo-process-bar.png'
import { useSleep } from 'hooks/useSleep'
import { ANI_DURATION } from 'constants/index'
import { useCarouselPaused } from 'store/usecases/hooks/useUseCasesHooks'
import CarouselIndicator from '../CarouselIndicator'
import { isPro } from 'utils/url'

const TabViewContainer = styled.div<{ $isPlaying?: boolean; $isRenderChatContent?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  ${({ theme, $isPlaying, $isRenderChatContent }) =>
    theme.isMobile &&
    css`
      ${$isPlaying &&
      css`
        justify-content: center;
        ${$isRenderChatContent &&
        css`
          justify-content: flex-start;
        `}
      `}
    `}
`

const TabContent = styled.div<{ $isPlaying?: boolean; $isRenderChatContent?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 640px;
  background: ${({ theme }) => theme.black800};
  overflow: hidden;

  ${({ theme, $isPlaying, $isRenderChatContent }) =>
    theme.isMobile &&
    css`
      height: ${vm(263)};
      max-height: ${vm(263)};
      transition: max-height ${ANI_DURATION}s;
      ${$isPlaying &&
      css`
        height: ${$isRenderChatContent ? `calc(100% - ${vm(72)})` : '100%'};
        max-height: 100vh;
      `}
    `}
`

// 进度条动画 - 宽度从0%到100%
const progressBarAnimation = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`

const ProgressBar = styled.img<{ $isActive?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 12px;
  width: 0%;
  z-index: 3;
  object-fit: cover;
  object-position: left;

  ${({ $isActive }) =>
    $isActive &&
    css`
      animation: ${progressBarAnimation} 2s linear forwards;
    `}

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(8)};
    `}
`

const DefaultCursor = styled.img<{
  $cursorMoving?: boolean
  $cursorHovering?: boolean
}>`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  z-index: 2;
  pointer-events: none;

  ${({ theme, $cursorMoving }) =>
    $cursorMoving &&
    css`
      ${theme.isMobile
        ? css`
            @keyframes mobileMoveCursorToButton {
              0% {
                right: 0;
                bottom: 0;
                transform: scale(1);
              }
              100% {
                right: ${vm(32)};
                bottom: calc(50% - ${vm(24)});
                transform: scale(0.8); /* 悬停时光标缩小到 0.8 倍 */
              }
            }
            animation: mobileMoveCursorToButton ${CURSOR_MOVE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
          `
        : css`
            @keyframes moveCursorToButton {
              0% {
                right: 0;
                bottom: 0;
                transform: scale(1);
              }
              100% {
                right: 248px;
                bottom: 319px;
                transform: scale(0.8); /* 悬停时光标缩小到 0.8 倍 */
              }
            }
            animation: moveCursorToButton ${CURSOR_MOVE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
          `}
    `}

  ${({ $cursorHovering }) =>
    $cursorHovering &&
    css`
      opacity: 1;
      transform: scale(0.8);
      transition: transform 0.1s;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(24)};
      height: ${vm(24)};
    `}
`

const BackgroundImage = styled.div<{ $shouldFadeOut?: boolean; $isPlaying?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${useCasesDemoBg});
  background-size: 150%;
  background-position: center 44%;
  background-repeat: no-repeat;
  transition: opacity ${BACKGROUND_FADE_DURATION}ms ease-out;
  opacity: ${({ $shouldFadeOut }) => ($shouldFadeOut ? 0 : 1)};
  z-index: 0;

  ${({ theme, $isPlaying }) =>
    theme.isMobile &&
    css`
      background-size: 190%;
      background-position: center 58%;
      ${$isPlaying &&
      css`
        background-size: cover;
      `}
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
  z-index: 2;

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
const CenterPlayButton = styled(BaseButton)<{ $isHidden?: boolean }>`
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
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  pointer-events: ${({ $isHidden }) => ($isHidden ? 'none' : 'auto')};

  > i {
    font-size: 32px;
    color: ${({ theme }) => theme.textL1};
  }

  &:hover {
    opacity: ${({ $isHidden }) => ($isHidden ? 0 : 0.7)};
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          top: 35%;
          width: ${vm(60)};
          height: ${vm(60)};
          border-radius: ${vm(30)};
        `
      : css`
          transition: all ${ANI_DURATION}s;
        `}
`

// 通用按钮区域 - 支持桌面端和移动端
const ButtonsArea = styled.div<{ $hideBg?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;

  ${({ theme, $hideBg }) =>
    theme.isMobile &&
    css`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: ${vm(8)} ${vm(20)} ${vm(20)} ${vm(20)};
      background-color: ${theme.bgL0};
      gap: ${vm(12)};
      z-index: 1;
      transition: background-color ${ANI_DURATION}s;
      ${$hideBg &&
      css`
        background-color: transparent;
      `}
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

  > i {
    font-size: 18px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    flex: 1;
    height: ${vm(44)};
    font-size: 0.16rem;
    font-weight: 500;
    border-radius: ${vm(60)};

     > i {
        font-size: 0.18rem;
      }
  `}
`

const RefreshButton = styled(ButtonBorder)`
  height: 36px;
  font-size: 14px;
  width: auto;
  white-space: nowrap;
  gap: 6px;
  padding: 8px 12px;

  > i {
    font-size: 18px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex: 1;
      height: ${vm(44)};
      font-size: 0.16rem;
      font-weight: 500;
      border-radius: ${vm(60)};

      > i {
        font-size: 0.18rem;
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
const UseCasesTabContentComponent = memo(() => {
  const [activeTab] = useActiveTab()
  const content = TAB_CONTENT_CONFIG[activeTab as USE_CASES_TAB_KEY]
  const [, setCarouselPaused] = useCarouselPaused()
  const [isPlaying, setIsPlaying] = useIsPlaying()
  const [showCursor, setShowCursor] = useState(false)
  const [cursorMoving, setCursorMoving] = useState(false)
  const [cursorHovering, setCursorHovering] = useState(false)
  const [shouldMoveUp, setShouldMoveUp] = useState(false)
  const [shouldFadeOut, setShouldFadeOut] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isShowInput, setIsShowInput] = useState(false)
  const [progressBarActive, setProgressBarActive] = useState(false)

  const sendAiContent = useSendAiContent()
  const sendAiContentToChat = useSendAiContentToChat()
  const addNewThread = useAddNewThread()
  const closeStream = useCloseStream()
  const resetTempAiContentData = useResetTempAiContentData()
  const [, setIsShowDeepThink] = useIsShowDeepThink()
  const [, setCurrentRouter] = useCurrentRouter()
  const isMobile = useIsMobile()
  const { sleep, abort: abortSleep } = useSleep()
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  const tempAiContentData = useTempAiContentData()

  const isAgentType = useMemo(() => {
    return (
      activeTab === USE_CASES_TAB_KEY.SIGNAL ||
      activeTab === USE_CASES_TAB_KEY.BRIEF ||
      activeTab === USE_CASES_TAB_KEY.BACKTEST
    )
  }, [activeTab])

  const isRenderChatContent = useMemo(() => {
    return aiResponseContentList.length > 0
  }, [aiResponseContentList.length])

  const agentIdMap = useMemo(() => {
    if (!isPro) {
      return {
        [USE_CASES_TAB_KEY.SIGNAL]: '285',
        [USE_CASES_TAB_KEY.BRIEF]: '18',
        [USE_CASES_TAB_KEY.BACKTEST]: '341',
      } as Record<USE_CASES_TAB_KEY, string>
    }
    return {
      [USE_CASES_TAB_KEY.SIGNAL]: '809',
      [USE_CASES_TAB_KEY.BRIEF]: '805',
      [USE_CASES_TAB_KEY.BACKTEST]: '546',
    } as Record<USE_CASES_TAB_KEY, string>
  }, [])

  if (!content) return null

  // 监听 isPlaying 和 isDropdownOpen 状态变化，控制轮播暂停
  useEffect(() => {
    if (isPlaying) {
      setCarouselPaused(true)
    }
  }, [isPlaying, setCarouselPaused])

  // 监听 activeTab 变化，触发进度条动画
  useEffect(() => {
    // 重置进度条状态
    setProgressBarActive(false)

    // 短暂延迟后激活进度条动画
    const timer = setTimeout(() => {
      setProgressBarActive(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [activeTab])

  const handlePlay = useCallback(async () => {
    setIsPlaying(true)
    if (isMobile) {
      await sleep(400)
      setIsShowInput(true)
    } else {
      setIsShowInput(true)
    }
  }, [isMobile, setIsPlaying, sleep])

  const handleTypingComplete = useCallback(async () => {
    try {
      // 阶段1: 打字完成后，显示光标并开始移动
      setShowCursor(true)
      setCursorMoving(true)

      // 阶段2: 光标到达按钮位置，触发悬停效果
      await sleep(DELAY_CURSOR_REACH_BUTTON)
      setCursorHovering(true)
      setIsButtonHovered(true) // 按钮放大到 1.5x

      // 阶段3: 按钮放大后，等待一段时间再恢复原始大小
      await sleep(DELAY_BUTTON_SCALE_UP)
      setIsButtonHovered(false) // 按钮恢复到 1x

      // 阶段4: 等待按钮恢复动画完全执行完成
      await sleep(BUTTON_SCALE_DURATION) // 等待按钮恢复动画完全执行完（300ms）

      // 阶段5: 按钮恢复动画完成后，GlowInput 开始消失，光标也开始消失
      setShouldMoveUp(true) // GlowInput 开始向上移动并消失
      setShowCursor(false) // 光标开始消失

      // 阶段6: 背景图淡出
      await sleep(DELAY_BACKGROUND_FADE)
      setShouldFadeOut(true)
      setCursorMoving(false)
      setCursorHovering(false)

      await sleep(BACKGROUND_FADE_DURATION)
      sendAiContent({
        value: content.prompt,
      })
    } catch (error) {
      // 如果被中断，静默处理
      console.log('Animation interrupted')
    }
  }, [content.prompt, sleep, sendAiContent])

  const resetState = useCallback(() => {
    // 中断所有正在进行的动画
    abortSleep()
    setShowCursor(false)
    setCursorMoving(false)
    setCursorHovering(false)
    setShouldMoveUp(false)
    setShouldFadeOut(false)
    setIsButtonHovered(false)
    setProgressBarActive(false)
    setIsShowInput(false)
    resetTempAiContentData()
    setAiResponseContentList([])
    setIsShowDeepThink(false)
    closeStream()
    window.useCasesAbortController?.abort()
  }, [setIsShowDeepThink, resetTempAiContentData, setAiResponseContentList, abortSleep, closeStream])

  const handleRefresh = useCallback(() => {
    resetState()
    setTimeout(() => {
      handlePlay()
    }, 0)
  }, [resetState, handlePlay])

  const handleUsePrompt = useCallback(() => {
    resetState()
    addNewThread()
    setCurrentRouter(ROUTER.CHAT)
    sendAiContentToChat({
      value: content.prompt,
    })
  }, [resetState, addNewThread, setCurrentRouter, sendAiContentToChat, content.prompt])
  const goAgentDetail = useCallback(() => {
    const agentId = agentIdMap[activeTab as USE_CASES_TAB_KEY]
    if (!agentId) return
    setCurrentRouter(`${ROUTER.AGENT_DETAIL}?agentId=${agentId}`)
  }, [agentIdMap, activeTab, setCurrentRouter])

  useEffect(() => {
    if (!isPlaying) {
      resetState()
    }
  }, [isPlaying, resetState])

  const ButtonsContent = () => (
    <>
      {isPlaying ? (
        <RefreshButton onClick={handleRefresh}>
          <IconBase className='icon-chat-refresh' />
          <Trans>Refresh</Trans>
        </RefreshButton>
      ) : (
        <PlayButton onClick={handlePlay}>
          <IconBase className='icon-run' />
          <Trans>Play demo</Trans>
        </PlayButton>
      )}

      {isAgentType ? (
        <UsePromptButton onClick={goAgentDetail}>
          <Trans>Subscribe</Trans>
        </UsePromptButton>
      ) : (
        <UsePromptButton onClick={handleUsePrompt}>
          <Trans>Use this prompt</Trans>
        </UsePromptButton>
      )}
    </>
  )

  return (
    <>
      <TabContent $isPlaying={isPlaying} $isRenderChatContent={isRenderChatContent}>
        {!isPlaying && <ProgressBar src={useCasesDemoProcessBar} alt='progress-bar' $isActive={progressBarActive} />}

        <BackgroundImage $isPlaying={isPlaying} $shouldFadeOut={shouldFadeOut} />

        <CenterPlayButton onClick={handlePlay} $isHidden={isPlaying}>
          <IconBase className='icon-run' />
        </CenterPlayButton>

        {isRenderChatContent && <ChatContent />}

        {isPlaying && isShowInput && (
          <GlowInput
            inputValue={content.prompt}
            onTypingComplete={handleTypingComplete}
            shouldMoveUp={shouldMoveUp}
            isButtonHovered={isButtonHovered}
          />
        )}

        {showCursor && (
          <DefaultCursor
            src={defalutCursor}
            alt='defalut-cursor'
            $cursorMoving={cursorMoving}
            $cursorHovering={cursorHovering}
          />
        )}

        {!(isMobile && isPlaying) && (
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
        )}
      </TabContent>

      {/* 移动端轮播指示器 */}
      {!isPlaying && <CarouselIndicator />}

      {/* 移动端底部固定按钮 */}
      {isMobile && (
        <ButtonsArea $hideBg={isPlaying && !isRenderChatContent && !shouldFadeOut}>
          <ButtonsContent />
        </ButtonsArea>
      )}
    </>
  )
})

UseCasesTabContentComponent.displayName = 'UseCasesTabContentComponent'

function UseCasesTabView() {
  const [isPlaying] = useIsPlaying()
  const [aiResponseContentList] = useAiResponseContentList()
  const isRenderChatContent = useMemo(() => {
    return aiResponseContentList.length > 0
  }, [aiResponseContentList.length])

  return (
    <TabViewContainer $isPlaying={isPlaying} $isRenderChatContent={isRenderChatContent}>
      <UseCasesTabContentComponent />
    </TabViewContainer>
  )
}

UseCasesTabView.displayName = 'UseCasesTabView'

export default memo(UseCasesTabView)
