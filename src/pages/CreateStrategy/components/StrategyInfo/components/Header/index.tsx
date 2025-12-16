import { memo, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import MoveTabList from 'components/MoveTabList'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'store/themecache/hooks'
import { useDeployModalToggle } from 'store/application/hooks'
import ShinyButton from 'components/ShinyButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyCode } from 'store/createstrategy/hooks/useCode'
import { GENERATION_STATUS } from 'store/createstrategy/createstrategy'
import Tooltip from 'components/Tooltip'

const HeaderWrapper = styled.div<{ $codeGenerated: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
  width: 100%;
  height: 44px;
  .launch-button {
    width: 96px;
    height: 44px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    border-radius: 32px;
  }
  ${({ $codeGenerated }) =>
    !$codeGenerated &&
    css`
      .launch-button {
        cursor: not-allowed;
      }
    `}
`

const TabListWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
`

export default memo(function Header() {
  const theme = useTheme()
  const [strategyInfoTabIndex, setStrategyInfoTabIndex] = useStrategyInfoTabIndex()
  const { strategyId } = useParsedQueryString()
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const codeGenerated = strategyCode?.generation_status === GENERATION_STATUS.COMPLETED

  const toggleDeployModal = useDeployModalToggle()

  const handleTabClick = useCallback(
    (index: number) => {
      return () => {
        setStrategyInfoTabIndex(index)
      }
    },
    [setStrategyInfoTabIndex],
  )

  const handleDeployClick = useCallback(() => {
    if (!codeGenerated) return
    toggleDeployModal()
  }, [codeGenerated, toggleDeployModal])
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Create</Trans>,
        clickCallback: handleTabClick(0),
      },
      {
        key: 1,
        text: <Trans>Code</Trans>,
        clickCallback: handleTabClick(1),
      },
      {
        key: 2,
        text: <Trans>Backtest</Trans>,
        clickCallback: handleTabClick(2),
      },
      {
        key: 3,
        text: <Trans>Paper Trading</Trans>,
        clickCallback: handleTabClick(3),
      },
    ]
  }, [handleTabClick])
  return (
    <HeaderWrapper $codeGenerated={codeGenerated}>
      <TabListWrapper>
        <MoveTabList activeIndicatorBackground={theme.text20} tabIndex={strategyInfoTabIndex} tabList={tabList} />
      </TabListWrapper>
      <Tooltip content={!codeGenerated ? <Trans>Code not compiled. Please Generate Code first.</Trans> : ''}>
        <ShinyButton className='launch-button' onClick={handleDeployClick}>
          <Trans>Launch</Trans>
        </ShinyButton>
      </Tooltip>
    </HeaderWrapper>
  )
})
