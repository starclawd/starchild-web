import { Trans } from '@lingui/react/macro'
import { CommonModalHeader } from 'components/Modal'
import MoveTabList from 'components/MoveTabList'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import styled, { css } from 'styled-components'

const TitleWrapper = styled(CommonModalHeader)<{ $depositDisabled: boolean }>`
  padding-left: 20px;
  justify-content: flex-start;
  .move-tab-item {
    padding: 0;
  }
  .move-tab-item,
  .active-indicator {
    height: 42px;
  }
  ${({ $depositDisabled }) =>
    $depositDisabled &&
    css`
      .move-tab-item:nth-child(2) {
        opacity: 0.7;
        cursor: not-allowed;
      }
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(20)} ${vm(8)};
      .move-tab-item,
      .active-indicator {
        height: ${vm(42)};
      }
    `}
`

export default function Title({ depositDisabled }: { depositDisabled: boolean }) {
  const [depositAndWithdrawTabIndex, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Deposit</Trans>,
        clickCallback: () => {
          if (depositDisabled) return
          setDepositAndWithdrawTabIndex(0)
        },
        value: 'deposit',
      },
      {
        key: 1,
        text: <Trans>Withdraw</Trans>,
        clickCallback: () => setDepositAndWithdrawTabIndex(1),
        value: 'withdraw',
      },
    ]
  }, [setDepositAndWithdrawTabIndex, depositDisabled])
  return (
    <TitleWrapper $depositDisabled={depositDisabled}>
      <MoveTabList gap={20} tabKey={depositAndWithdrawTabIndex} tabList={tabList} />
    </TitleWrapper>
  )
}
