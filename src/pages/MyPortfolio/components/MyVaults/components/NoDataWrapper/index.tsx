import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import NoData from 'components/NoData'
import { ROUTER } from 'pages/router'
import { useCallback } from 'react'
import { useSetCurrentRouter } from 'store/application/hooks'
import styled from 'styled-components'

const NoDataWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  .no-data-wrapper {
    min-height: unset;
    height: auto;
  }
  .no-data-des {
    margin-top: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.black0};
  }
`

const ViewAllValut = styled(ButtonBorder)`
  width: fit-content;
  height: 32px;
  margin-top: 16px;
  padding: 8px 12px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.black100};
`

export default function NoDataWrapper() {
  const setCurrentRouter = useSetCurrentRouter()
  const goAllVaultsPage = useCallback(() => {
    setCurrentRouter(ROUTER.VAULTS)
  }, [setCurrentRouter])
  return (
    <NoDataWrapperStyled>
      <NoData text={<Trans>Your vaults are empty.</Trans>} />
      <span className='no-data-des'>
        <Trans>Explore all strategies and activate your first one.</Trans>
      </span>
      <ViewAllValut onClick={goAllVaultsPage}>
        <Trans>View all vaults</Trans>
      </ViewAllValut>
    </NoDataWrapperStyled>
  )
}
