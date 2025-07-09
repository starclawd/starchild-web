/**
 * 错误边界组件
 * 用于捕获子组件树中的 JavaScript 错误
 * 记录错误并显示降级UI界面
 * 防止整个应用因组件错误而崩溃
 */
import React, { ReactNode, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { ROUTER } from 'pages/router'
import { useIsMobile } from 'store/application/hooks'
import { useIsDarkMode } from 'store/themecache/hooks'
import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

/**
 * 错误降级UI的容器组件
 * 使用flex布局垂直排列错误提示内容
 */
const FallbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  z-index: 1;
`

/**
 * 主体内容包装器
 * 使用flex-grow确保内容区域填充剩余空间
 */
const BodyWrapper = styled.div<{ margin?: string }>`
  width: 100%;
  flex-grow: 1;
`

/**
 * 错误边界组件的状态接口
 * @property error - 捕获到的错误对象，初始为null
 */
type ErrorBoundaryState = {
  error: Error | null
}

/**
 * 错误提示内容的包装器
 * 居中显示错误图片和提示文本
 */
const SuspendedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  padding-bottom: 60px;
  img {
    width: 260px;
    margin-bottom: 8px;
  }
`

/**
 * 错误提示标题样式
 * 显示错误信息的主标题
 */
const TiTle = styled.div`
  font-weight: 800;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 16px;
  text-align: center;
  color: ${({ theme }) => theme.textL1};
`

const ButtonBack = styled(ButtonCommon)`
  width: fit-content;
  height: 40px;
  white-space: nowrap;
`

/**
 * 错误提示组件
 * 显示404图片、错误信息和返回按钮
 * 支持移动端和桌面端不同布局
 */
function ErrorCom({ error }: { error: Error }) {
  const isMobile = useIsMobile()
  const isDark = useIsDarkMode()
  const scrollRef = useScrollbarClass<HTMLDivElement>()

  /**
   * 返回交易页面的回调函数
   * 通过修改window.location实现页面跳转
   */
  const refresh = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <FallbackWrapper>
      <BodyWrapper>
        <SuspendedWrapper ref={scrollRef} className='scroll-style'>
          <TiTle>
            <Trans>Oops! Something went wrong!</Trans>
          </TiTle>
          <span style={{ display: 'flex' }}>
            {error?.name && `${error.name}: `}
            {error?.message || error?.toString() || 'Unknown error'}
            {error?.stack && <div style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{error.stack}</div>}
          </span>
          <ButtonBack onClick={refresh}>
            <Trans>Refresh</Trans>
          </ButtonBack>
        </SuspendedWrapper>
      </BodyWrapper>
    </FallbackWrapper>
  )
}

/**
 * 错误边界类组件
 * 捕获子组件树中的JavaScript错误
 * 防止整个应用崩溃并显示降级UI
 */
export default class ErrorBoundary extends React.Component<
  {
    [param: string]: any
    children: ReactNode
  },
  ErrorBoundaryState
> {
  /**
   * 构造函数
   * 初始化错误状态为null
   */
  constructor(props: { [param: string]: any; children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  /**
   * 静态生命周期方法
   * 当捕获到错误时更新组件状态
   * @param error - 捕获到的错误对象
   * @returns 更新后的状态对象
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  /**
   * 渲染方法
   * 当发生错误时显示错误UI，否则渲染子组件
   */
  render() {
    const { error } = this.state

    if (error !== null) {
      return <ErrorCom error={error} />
    }
    return this.props.children
  }
}
