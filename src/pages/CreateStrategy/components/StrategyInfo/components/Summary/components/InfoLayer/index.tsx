import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import styled, { keyframes } from 'styled-components'
import EditContent from '../EditContent'
import { Dispatch, memo, SetStateAction } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import UnLogin from '../UnLogin'
import { useIsLogin } from 'store/login/hooks'

// 打字机效果信息的类型定义
export interface TypewriterInfo {
  isTyping: boolean
  isCurrentLayer: boolean
  showCursor: boolean
  cursorPosition: 'title' | 'content'
  displayedTitle: string
  displayedContent: string
  isLayerComplete: boolean
}

// 光标闪烁动画
const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

// 光标组件
const TypewriterCursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 20px;
  background-color: ${({ theme }) => theme.brand100};
  animation: ${cursorBlink} 1s ease-in-out infinite;
  vertical-align: middle;
  margin-left: 2px;
`

const InfoLayerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  z-index: 2;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black0};
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.black0};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 28px;
  border-top: none;
`

const LoadingPlaceholderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 360px;
  margin-top: 20px;
`

const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 16px;
  background-color: ${({ theme }) => theme.black800};
  border-radius: 1px;
  &:last-child {
    width: 70%;
  }
`

// 打字机效果内容容器
const TypewriterContent = styled.div<{ $maxLines?: number }>`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  white-space: pre-wrap;
  word-break: break-word;
  ${({ $maxLines }) =>
    $maxLines &&
    `
    display: -webkit-box;
    -webkit-line-clamp: ${$maxLines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`

export default memo(function InfoLayer({
  content,
  updateContent,
  isEdit,
  iconCls,
  title,
  isLoading,
  typewriterInfo,
}: {
  content: string
  updateContent: Dispatch<SetStateAction<string>>
  isEdit: boolean
  iconCls: string
  title: React.ReactNode
  isLoading: boolean
  typewriterInfo?: TypewriterInfo
}) {
  const isLogin = useIsLogin()
  const { strategyId } = useParsedQueryString()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategy_config } = strategyDetail || {
    strategy_config: null,
  }

  // 判断是否在打字机效果模式（仅对当前正在打字的 layer 生效）
  const isInTypewriterMode = typewriterInfo?.isTyping && typewriterInfo?.isCurrentLayer

  // 渲染标题（支持打字机效果）
  const renderTitle = () => {
    if (isInTypewriterMode && typewriterInfo) {
      return (
        <>
          <span>{typewriterInfo.displayedTitle}</span>
          {typewriterInfo.showCursor && typewriterInfo.cursorPosition === 'title' && <TypewriterCursor />}
        </>
      )
    }
    return <span>{title}</span>
  }

  // 渲染内容（支持打字机效果）
  const renderContent = () => {
    if (isInTypewriterMode && typewriterInfo) {
      // 打字机模式：显示已打字的内容 + 光标
      // 未登录时最多显示 8 行
      return (
        <TypewriterContent $maxLines={!isLogin ? 8 : undefined}>
          <span>{typewriterInfo.displayedContent}</span>
          {typewriterInfo.showCursor && typewriterInfo.cursorPosition === 'content' && <TypewriterCursor />}
        </TypewriterContent>
      )
    }
    // 正常模式：使用 EditContent 组件
    return <EditContent content={content} isEdit={isEdit} updateContent={updateContent} />
  }

  return (
    <InfoLayerWrapper className='info-layer-wrapper'>
      <Title>
        <Left>
          <IconBase className={iconCls} />
          {renderTitle()}
        </Left>
        {!strategy_config && !isInTypewriterMode && <Pending />}
      </Title>
      <Content>
        {renderContent()}
        {!isLogin && (
          <LoadingPlaceholderWrapper>
            <LoadingPlaceholder />
            <LoadingPlaceholder />
            <LoadingPlaceholder />
          </LoadingPlaceholderWrapper>
        )}
      </Content>
      {!isLogin && <UnLogin />}
    </InfoLayerWrapper>
  )
})
