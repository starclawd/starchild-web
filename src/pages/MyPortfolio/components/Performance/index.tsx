import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import TabList, { TAB_TYPE } from 'components/TabList'

const PerformanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 26px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.black0};
  cursor: pointer;
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.black200};
  }
`

const InfoContent = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  gap: 20px;
  width: 100%;
  height: 88px;
  transition: all ${ANI_DURATION}s;
  ${({ $isExpanded }) =>
    $isExpanded &&
    css`
      height: 200px;
    `}
`

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc((100% - 20px) / 2);
  height: 100%;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.black800};
`

const BalanceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black200};
  }
  > span:last-child {
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
    color: ${({ theme }) => theme.black0};
  }
`

const PnlWrapper = styled(BalanceWrapper)``

const PnlInfo = styled(BalanceInfo)`
  .tab-list-wrapper {
    height: 24px;
  }
  .tab-item {
    padding: 0 12px;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
  }
`

enum PERFORMANCE_DATE_KEY {
  ONE_DAY = '1D',
  ONE_WEEK = '7D',
  ONE_MONTH = '1M',
  THREE_MONTHS = '3M',
}
export default memo(function Performance() {
  const [currentDate, setCurrentDate] = useState(PERFORMANCE_DATE_KEY.ONE_WEEK)
  const [isExpanded, setIsExpanded] = useState(false)
  const dateList = useMemo(() => {
    return [
      {
        key: PERFORMANCE_DATE_KEY.ONE_DAY,
        text: '1D',
        clickCallback: () => setCurrentDate(PERFORMANCE_DATE_KEY.ONE_DAY),
      },
      {
        key: PERFORMANCE_DATE_KEY.ONE_WEEK,
        text: '7D',
        clickCallback: () => setCurrentDate(PERFORMANCE_DATE_KEY.ONE_WEEK),
      },
      {
        key: PERFORMANCE_DATE_KEY.ONE_MONTH,
        text: '1M',
        clickCallback: () => setCurrentDate(PERFORMANCE_DATE_KEY.ONE_MONTH),
      },
      {
        key: PERFORMANCE_DATE_KEY.THREE_MONTHS,
        text: '3M',
        clickCallback: () => setCurrentDate(PERFORMANCE_DATE_KEY.THREE_MONTHS),
      },
    ]
  }, [])
  return (
    <PerformanceWrapper>
      <Title>
        <span>
          <Trans>Performance</Trans>
        </span>
        <IconBase
          onClick={() => setIsExpanded(!isExpanded)}
          className={isExpanded ? 'icon-zoom-out' : 'icon-zoom-in'}
        />
      </Title>
      <InfoContent $isExpanded={isExpanded}>
        <BalanceWrapper>
          <BalanceInfo>
            <span>
              <Trans>Total balance</Trans>
            </span>
            <span>--</span>
          </BalanceInfo>
        </BalanceWrapper>
        <PnlWrapper>
          <PnlInfo>
            <span>
              <Trans>{currentDate} PnL</Trans>
              <TabList tabKey={currentDate} tabList={dateList} tabType={TAB_TYPE.SIMPLE} />
            </span>
            <span>--</span>
          </PnlInfo>
        </PnlWrapper>
      </InfoContent>
    </PerformanceWrapper>
  )
})
