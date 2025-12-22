import { memo, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import MoveTabList from 'components/MoveTabList'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'store/themecache/hooks'
import { useCurrentRouter, useDeployModalToggle } from 'store/application/hooks'
import ShinyButton from 'components/ShinyButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyCode } from 'store/createstrategy/hooks/useCode'
import { GENERATION_STATUS, STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import Tooltip from 'components/Tooltip'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import { ButtonCommon } from 'components/Button'
import { ROUTER } from 'pages/router'
import { IconBase } from 'components/Icons'

const HeaderWrapper = styled.div<{ $codeGenerated: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  width: 100%;
  height: 36px;
  .launch-button {
    width: 96px;
    height: 36px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    border-radius: 32px;
  }
  .view-vault-button {
    width: 120px;
    height: 36px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    border-radius: 32px;
    background: ${({ theme }) => theme.brand100};
    gap: 6px;

    .icon-chat-back {
      font-size: 18px;
      transform: rotate(180deg);
    }
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
  height: 36px;
  .tab-list-wrapper {
    height: 36px;
    border-radius: 8px;
    padding: 2px;
    .move-tab-item {
      height: 32px;
      border-radius: 6px;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
    .active-indicator {
      top: 1px;
      left: 3px;
      height: 32px;
      border-radius: 6px !important;
    }
  }
`

export default memo(function Header() {
  const theme = useTheme()
  const [strategyInfoTabIndex, setStrategyInfoTabIndex] = useStrategyInfoTabIndex()
  const { strategyId } = useParsedQueryString()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const codeGenerated = strategyCode?.generation_status === GENERATION_STATUS.COMPLETED
  const [, setCurrentRouter] = useCurrentRouter()

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
        text: <Trans>Backtest</Trans>,
        clickCallback: handleTabClick(1),
      },
      {
        key: 2,
        text: <Trans>Code</Trans>,
        clickCallback: handleTabClick(2),
      },
      {
        key: 3,
        text: <Trans>Paper Trading</Trans>,
        clickCallback: handleTabClick(3),
      },
    ]
  }, [handleTabClick])

  const handleViewVaultClick = useCallback(() => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyId}`)
  }, [strategyId, setCurrentRouter])

  return (
    <HeaderWrapper $codeGenerated={codeGenerated}>
      <TabListWrapper>
        <MoveTabList activeIndicatorBackground={theme.text20} tabIndex={strategyInfoTabIndex} tabList={tabList} />
      </TabListWrapper>
      <Tooltip content={!codeGenerated ? <Trans>Code not compiled. Please Generate Code first.</Trans> : ''}>
        {strategyDetail && strategyDetail?.status === STRATEGY_STATUS.DEPLOYED ? (
          <ButtonCommon className='view-vault-button' onClick={handleViewVaultClick}>
            <Trans>View vault</Trans>
            <IconBase className='icon-chat-back' />
          </ButtonCommon>
        ) : (
          <ShinyButton className='launch-button' onClick={handleDeployClick}>
            <Trans>Launch</Trans>
          </ShinyButton>
        )}
      </Tooltip>
    </HeaderWrapper>
  )
})
