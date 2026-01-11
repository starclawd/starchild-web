import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useShareStrategyModalToggle } from 'store/application/hooks'
import { useCurrentShareStrategyData } from 'store/vaultsdetail/hooks/useCurrentShareStrategyData'
import { useStrategyInfo } from 'store/vaultsdetail/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { formatKMBNumber } from 'utils/format'
import { useFollowStrategy, useIsFollowedStrategy, useUnfollowStrategy } from 'store/vaults/hooks'
import Pending from 'components/Pending'
import { useIsLogin } from 'store/login/hooks'

const TvfSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 92px;
  border-radius: 4px;
  overflow: hidden;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1440`
    width: 240px;
  `}
  ${({ theme }) => theme.mediaMaxWidth.width1280`
     width: 200px;
  `}
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  span:first-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black200};
  }
  span:last-child {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
  }
  background-color: ${({ theme }) => theme.black700};
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
`

const BottomLeft = styled.div<{ $isFollowedStrategy: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  gap: 8px;
  background-color: ${({ theme }) => theme.brand100};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  .icon-boost {
    font-size: 28px;
    color: ${({ theme }) => theme.black1000};
  }
  span {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    color: ${({ theme }) => theme.black1000};
  }
  ${({ $isFollowedStrategy, $disabled, theme }) =>
    $disabled || $isFollowedStrategy
      ? css`
          background-color: ${theme.black1000};
          span {
            color: ${theme.black200};
          }
          .icon-boost {
            color: ${theme.black200};
          }
        `
      : css`
          &:hover {
            opacity: 0.7;
          }
        `}
  ${({ $isFollowedStrategy }) =>
    $isFollowedStrategy &&
    css`
      &:hover {
        opacity: 0.7;
      }
    `}
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed !important;
      &:hover {
        opacity: 1 !important;
      }
    `}
`

const BottomLeftContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  z-index: 2;
`

const ShareButton = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 0;
  background-color: ${({ theme }) => theme.brand300};
  .icon-share {
    font-size: 24px;
    color: ${({ theme }) => theme.black0};
  }
`

export default memo(function TvfSection() {
  const isLogin = useIsLogin()
  const [isLoading, setIsLoading] = useState(false)
  const { strategyId } = useParsedQueryString()
  const { isFollowedStrategy } = useIsFollowedStrategy({ strategyId: strategyId || '' })
  const { strategyInfo } = useStrategyInfo({ strategyId: strategyId || '' })
  const followStrategy = useFollowStrategy()
  const unfollowStrategy = useUnfollowStrategy()
  const toggleShareStrategyModal = useShareStrategyModalToggle()
  const [, setCurrentShareStrategyData] = useCurrentShareStrategyData()
  const tvf = useMemo(() => strategyInfo?.tvf || 0, [strategyInfo?.tvf])
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
      }
    } catch (err) {
      console.error('Follow strategy failed:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, strategyId, isFollowedStrategy, isLogin, unfollowStrategy, followStrategy])
  return (
    <TvfSectionWrapper>
      <TopContent>
        <span>TVF:</span>
        <span>{tvf ? formatKMBNumber(tvf, 2, { showDollar: true }) : '0'}</span>
      </TopContent>
      <BottomContent>
        <BottomLeft $isFollowedStrategy={isFollowedStrategy} $disabled={isLoading || !isLogin}>
          <BottomLeftContent onClick={handleFollowClick}>
            {isLoading ? (
              <Pending />
            ) : (
              <>
                <IconBase className='icon-boost' />
                <span>{isFollowedStrategy ? <Trans>Followed</Trans> : <Trans>Follow</Trans>}</span>
              </>
            )}
          </BottomLeftContent>
        </BottomLeft>
        <ShareButton onClick={shareStrategy}>
          <IconBase className='icon-share' />
        </ShareButton>
      </BottomContent>
    </TvfSectionWrapper>
  )
})
