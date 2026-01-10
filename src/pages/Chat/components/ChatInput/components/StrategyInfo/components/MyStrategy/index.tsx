import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { IconBase, IconChatStrategyBg } from 'components/Icons'
import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import Pagination from '../Pagination'
import { formatPercent } from 'utils/format'
import { useTheme } from 'store/themecache/hooks'
import { useIsLogin } from 'store/login/hooks'
import Pending from 'components/Pending'

const MyStrategyWrapper = styled.div<{ $isShowDefaultStyle: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: calc((100% - 12px) / 2);
  height: 100%;
  padding: 16px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  border: 1px solid ${({ theme }) => theme.black800};
  background-color: ${({ theme }) => theme.black1000};
  cursor: ${({ $isShowDefaultStyle }) => ($isShowDefaultStyle ? 'default' : 'pointer')};
  overflow: hidden;
  .icon-chat-strategy-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  &:hover {
    border-color: ${({ theme }) => theme.black600};
    .title-arrow .icon-arrow {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const Title = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  .title-text {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.black0};
  }
  .title-arrow {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
    .icon-arrow {
      font-size: 18px;
      transition: all ${ANI_DURATION}s;
      color: ${({ theme }) => theme.black200};
      transform: rotate(90deg);
    }
  }
`

const MyStrategyList = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  width: 366px;
  height: 88px;
  z-index: 2;
`

const PendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const ListWrapper = styled.div<{ $translateX: number }>`
  display: flex;
  width: auto;
  height: 100%;
  transform: translateX(${({ $translateX }) => $translateX}px);
  transition: transform ${ANI_DURATION}s ease-in-out;
  .leaderboard-item {
    width: 366px;
  }
`

const StrategyItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 366px;
  height: 100%;
  padding-bottom: 16px;
`

const StrategyName = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const AprItem = styled.div<{ $emptyVaule: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  span:first-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.black300};
  }
  span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.brand100};
  }
  ${({ $emptyVaule, theme }) =>
    $emptyVaule &&
    css`
      span:last-child {
        color: ${theme.black300};
      }
    `}
`

const DefaultContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  z-index: 2;
`

const ButtonPlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.black600};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  .icon-play {
    font-size: 24px;
    color: ${({ theme }) => theme.black0};
  }
  &:hover {
    opacity: 0.7;
  }
`

export default memo(function MyStrategy() {
  const theme = useTheme()
  const isLogin = useIsLogin()
  const setCurrentRouter = useSetCurrentRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { myStrategies, isLoadingMyStrategies } = useMyStrategies()

  const isShowDefaultStyle = useMemo(() => {
    return (myStrategies.length === 0 && !isLoadingMyStrategies) || !isLogin
  }, [myStrategies, isLogin, isLoadingMyStrategies])

  const goCreateStrategyPage = useCallback(
    (strategyId: string) => {
      return () => {
        if (isShowDefaultStyle) {
          return
        }
        setCurrentRouter(`${ROUTER.CREATE_STRATEGY}?strategyId=${strategyId}`)
      }
    },
    [isShowDefaultStyle, setCurrentRouter],
  )
  return (
    <MyStrategyWrapper
      $isShowDefaultStyle={isShowDefaultStyle}
      onClick={goCreateStrategyPage(myStrategies[currentIndex]?.strategy_id || '')}
    >
      <IconChatStrategyBg color={isShowDefaultStyle ? 'rgba(248, 70, 0, 0.2)' : theme.black900} />
      <Title>
        <span className='title-text'>
          {!isShowDefaultStyle ? <Trans>My strategies</Trans> : <Trans>How to create a strategy</Trans>}
        </span>
        {!isShowDefaultStyle && (
          <span className='title-arrow'>
            <Trans>Continue</Trans>
            <IconBase className='icon-arrow' />
          </span>
        )}
      </Title>
      {!isShowDefaultStyle && (
        <MyStrategyList>
          {isLoadingMyStrategies ? (
            <PendingWrapper>
              <Pending />
            </PendingWrapper>
          ) : (
            <ListWrapper $translateX={-currentIndex * 366}>
              {myStrategies.map((strategy, index) => (
                <StrategyItem key={strategy.strategy_id}>
                  <StrategyName>{strategy.strategy_name}</StrategyName>
                  <AprItem $emptyVaule={!strategy.all_time_apr}>
                    <span>All-time APR:</span>
                    <span>{strategy.all_time_apr ? formatPercent({ value: strategy.all_time_apr }) : '--'}</span>
                  </AprItem>
                </StrategyItem>
              ))}
            </ListWrapper>
          )}
        </MyStrategyList>
      )}
      {!isShowDefaultStyle && (
        <Pagination currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} total={myStrategies.length} />
      )}
      {isShowDefaultStyle && <DefaultContent></DefaultContent>}
    </MyStrategyWrapper>
  )
})
