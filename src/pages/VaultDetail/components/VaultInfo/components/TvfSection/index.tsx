import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useShareStrategyModalToggle } from 'store/application/hooks'
import { useCurrentShareStrategyData } from 'store/vaultsdetail/hooks/useCurrentShareStrategyData'
import { useVibeTradingStrategyInfo } from 'store/vaultsdetail/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { formatKMBNumber } from 'utils/format'
import { useFollowStrategy, useIsFollowedStrategy, useUnfollowStrategy } from 'store/vaults/hooks'
import Pending from 'components/Pending'
import { useIsLogin } from 'store/login/hooks'
import { useOnchainBalance } from 'store/vaultsdetail/hooks/useOnchainBalance'

const TvfSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 208px;
  transition: all ${ANI_DURATION}s;
`

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeOutUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(8px);
  }
`

const UserBalance = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: -20px;
  left: -8px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.green100};
  animation: ${({ $isVisible }) => ($isVisible ? fadeInUp : fadeOutUp)} ${ANI_DURATION}s ease-out forwards;
`

const TopContent = styled.div<{ $isFollowedStrategy: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  height: 20px;
  span {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
  > span:first-child {
    color: ${({ theme }) => theme.black200};
  }
  > span:last-child {
    position: relative;
    color: ${({ theme }) => theme.black0};
    ${({ $isFollowedStrategy, theme }) =>
      $isFollowedStrategy &&
      css`
        > span {
          width: fit-content;
          background: ${theme.thinkingGradient};
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}
  }
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 40px;
`

const BottomLeft = styled(ButtonCommon)<{ $isFollowedStrategy: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  i {
    font-size: 18px;
  }
  ${({ $isFollowedStrategy }) =>
    $isFollowedStrategy &&
    css`
      color: ${({ theme }) => theme.black200};
      i {
        color: ${({ theme }) => theme.black200};
      }
      background-color: ${({ theme }) => theme.black600};
      &:hover {
        opacity: 0.7;
      }
    `}
`

const ShareButton = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
`

export default memo(function TvfSection() {
  const isLogin = useIsLogin()
  const [isLoading, setIsLoading] = useState(false)
  const [showUserBalance, setShowUserBalance] = useState(false)
  const [shouldRenderBalance, setShouldRenderBalance] = useState(false)
  const { strategyId } = useParsedQueryString()
  const { isFollowedStrategy } = useIsFollowedStrategy({ strategyId: strategyId || '' })
  const { strategyInfo } = useVibeTradingStrategyInfo({ strategyId: strategyId || '' })
  const followStrategy = useFollowStrategy()
  const unfollowStrategy = useUnfollowStrategy()
  const { fetchIsFollowed } = useIsFollowedStrategy({ strategyId: '' })
  const { fetchStrategyInfo } = useVibeTradingStrategyInfo({ strategyId: '' })
  const toggleShareStrategyModal = useShareStrategyModalToggle()
  const [, setCurrentShareStrategyData] = useCurrentShareStrategyData()
  const { onchainBalance } = useOnchainBalance()
  const tvf = useMemo(() => strategyInfo?.tvf || 0, [strategyInfo?.tvf])

  // 处理动画状态
  useEffect(() => {
    if (showUserBalance) {
      setShouldRenderBalance(true)
    } else if (shouldRenderBalance) {
      // 等待消失动画完成后再移除元素
      const timer = setTimeout(() => {
        setShouldRenderBalance(false)
      }, ANI_DURATION * 1000)
      return () => clearTimeout(timer)
    }
  }, [showUserBalance, shouldRenderBalance])
  const shareStrategy = useCallback(() => {
    setCurrentShareStrategyData(strategyInfo)
    toggleShareStrategyModal()
  }, [setCurrentShareStrategyData, strategyInfo, toggleShareStrategyModal])

  const handleFollowClick = useCallback(async () => {
    if (isLoading || !strategyId || !isLogin) return
    try {
      setIsLoading(true)
      if (isFollowedStrategy) {
        await unfollowStrategy(strategyId)
      } else {
        await followStrategy(strategyId)
        // 显示用户资金
        setShowUserBalance(true)
      }
      await fetchIsFollowed(strategyId)
      await fetchStrategyInfo(strategyId)
      // 隐藏用户资金
      setShowUserBalance(false)
    } catch (err) {
      console.error('Follow strategy failed:', err)
    } finally {
      setIsLoading(false)
      setShowUserBalance(false)
    }
  }, [
    isLoading,
    strategyId,
    isFollowedStrategy,
    isLogin,
    unfollowStrategy,
    followStrategy,
    fetchIsFollowed,
    fetchStrategyInfo,
  ])
  console.log('showUserBalance', showUserBalance, onchainBalance, onchainBalance?.total_balance_usd)
  return (
    <TvfSectionWrapper>
      <TopContent $isFollowedStrategy={isFollowedStrategy}>
        <span>TVF:</span>
        <span>
          {shouldRenderBalance && onchainBalance && onchainBalance.total_balance_usd > 0 && (
            <UserBalance $isVisible={showUserBalance}>
              +{formatKMBNumber(onchainBalance.total_balance_usd, 2, { showDollar: true })}
            </UserBalance>
          )}
          <span>{tvf ? formatKMBNumber(tvf, 2, { showDollar: true }) : '0'}</span>
        </span>
      </TopContent>
      <BottomContent>
        <BottomLeft
          onClick={handleFollowClick}
          $isFollowedStrategy={isFollowedStrategy}
          $disabled={isLoading || !isLogin}
        >
          {isLoading ? (
            <Pending />
          ) : (
            <>
              <IconBase className='icon-boost' />
              <span>{isFollowedStrategy ? <Trans>Followed</Trans> : <Trans>Follow</Trans>}</span>
            </>
          )}
        </BottomLeft>
        <ShareButton onClick={shareStrategy}>
          <IconBase className='icon-share' />
        </ShareButton>
      </BottomContent>
    </TvfSectionWrapper>
  )
})
