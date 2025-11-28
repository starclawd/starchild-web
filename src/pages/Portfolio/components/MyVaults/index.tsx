import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'

const MyVaultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

export default function MyVaults() {
  return (
    <MyVaultsWrapper>
      <Title>
        <Trans>My vaults</Trans>
      </Title>
    </MyVaultsWrapper>
  )
}
