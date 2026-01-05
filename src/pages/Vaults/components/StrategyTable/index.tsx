import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Divider from 'components/Divider'
import Input, { InputType } from 'components/Input'
import { ChangeEvent, useCallback, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import Strategies from './components/Strategies'

const StrategyTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  margin-bottom: 12px;
  > span {
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px;
    color: ${({ theme }) => theme.black0};
  }
`

const InputWrapper = styled.div`
  width: 500px;
  height: 100%;
`

const TableContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function StrategyTable() {
  const theme = useTheme()
  const [searchValue, setSearchValue] = useState('')
  const changeSearchValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
  }, [])
  return (
    <StrategyTableWrapper>
      <Title>
        <span>
          <Trans>Strategy hub</Trans>
        </span>
        <InputWrapper>
          <Input
            inputValue={searchValue}
            onChange={changeSearchValue}
            placeholder={t`Search by vault address, name or leader...`}
            inputType={InputType.SEARCH}
          />
        </InputWrapper>
      </Title>
      <Divider height={1} color={theme.black600} paddingVertical={0} />
      <TableContent>
        <Strategies searchValue={searchValue} />
      </TableContent>
    </StrategyTableWrapper>
  )
}
