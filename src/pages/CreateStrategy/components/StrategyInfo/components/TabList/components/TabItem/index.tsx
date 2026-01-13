import { memo, useState } from 'react'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import Tooltip from 'components/Tooltip'
import Step from '../../components/Step'
import { useTheme } from 'store/themecache/hooks'
import { useCurrentStrategyTabIndex } from 'store/createstrategy/hooks/useCreateStrategyDetail'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'
import Loading from '../Loading'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import useParsedQueryString from 'hooks/useParsedQueryString'
import StrategyStatus from 'pages/VaultDetail/components/VaultInfo/components/StrategyStatus'
import { useIsLogin } from 'store/login/hooks'

const TabItemWrapper = styled.div<{ $isActive: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  height: 80px;
  padding: 0 40px;
  transition: all ${ANI_DURATION}s;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  .tab-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    i {
      transition: all ${ANI_DURATION}s;
      font-size: 24px;
      color: ${({ theme }) => theme.black300};
    }
  }
  .tab-item-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
  }
  .tab-item-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black300};
    .tab-item-title-text {
      white-space: nowrap;
    }
  }
  .tab-item-description {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black200};
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      height: 160px;
      .tab-item-content {
        i {
          color: ${theme.black0};
        }
        .tab-item-text {
          .tab-item-title {
            color: ${theme.black0};
          }
        }
      }
    `}
  ${({ theme, $isActive }) => theme.mediaMaxWidth.width1560`
      height: 60px;
      padding: 0 20px;
      ${
        $isActive
          ? `
        height: 120px;
      `
          : ''
      }
      .tab-item-title {
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
      }
      .tab-item-text {
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
      }
    `}
`

export interface TabData {
  step: number
  key: STRATEGY_TAB_INDEX
  text: React.ReactNode
  icon: React.ReactNode
  isComplete: boolean
  disabled: boolean
  tooltipContent: React.ReactNode
  description: React.ReactNode
  showTooltip: boolean
  isLoading: boolean
  intervalDuration: number
  clickCallback: () => void
}

export default memo(function TabItem({ tab }: { tab: TabData }) {
  const isLogin = useIsLogin()
  const theme = useTheme()
  const { strategyId } = useParsedQueryString()
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [currentStrategyTabIndex] = useCurrentStrategyTabIndex()
  const { paperTradingPublicData } = usePaperTradingPublic({ strategyId: strategyId || '' })
  const {
    key,
    text,
    icon,
    isComplete,
    disabled,
    showTooltip,
    tooltipContent,
    step,
    clickCallback,
    description,
    isLoading,
    intervalDuration,
  } = tab
  const isActive = currentStrategyTabIndex === key

  return (
    <Tooltip key={key} placement='left' content={showTooltip ? tooltipContent : ''}>
      <TabItemWrapper $disabled={disabled} onClick={!disabled ? clickCallback : undefined} $isActive={isActive}>
        <span className='tab-item-content'>
          {icon}
          <span className='tab-item-text'>
            <span className='tab-item-title'>
              <span className='tab-item-title-text'>{text}</span>
              {key === STRATEGY_TAB_INDEX.PAPER_TRADING && paperTradingPublicData && isLogin && (
                <StrategyStatus status={paperTradingPublicData.status} />
              )}
            </span>
            {isActive && <span className='tab-item-description'>{description}</span>}
          </span>
        </span>
        <Step
          step={step}
          isActive={isActive}
          isLoading={isLoading}
          isComplete={isComplete}
          fillColor={theme.brand100}
          trackColor={theme.black900}
        />
        {isLoading && (
          <Loading
            intervalDuration={intervalDuration}
            loadingPercentProp={loadingPercent}
            setLoadingPercentProp={setLoadingPercent}
          />
        )}
      </TabItemWrapper>
    </Tooltip>
  )
})
