import { Trans } from '@lingui/react/macro'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useDepositAndWithdrawTabIndex } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import styled, { css } from 'styled-components'

const TitleWrapper = styled.div`
  padding: 20px 20px 8px;
  .move-tab-item,
  .active-indicator {
    height: 42px;
  }
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

export default function Title() {
  const [depositAndWithdrawTabIndex, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Deposit</Trans>,
        clickCallback: () => setDepositAndWithdrawTabIndex(0),
        value: 'deposit',
      },
      {
        key: 1,
        text: <Trans>Withdraw</Trans>,
        clickCallback: () => setDepositAndWithdrawTabIndex(1),
        value: 'withdraw',
      },
    ]
  }, [setDepositAndWithdrawTabIndex])
  return (
    <TitleWrapper>
      <MoveTabList tabKey={depositAndWithdrawTabIndex} moveType={MoveType.LINE} tabList={tabList} />
    </TitleWrapper>
  )
}
