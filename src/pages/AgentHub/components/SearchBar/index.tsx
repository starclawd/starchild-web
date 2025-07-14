import styled from 'styled-components'
import { memo } from 'react'
import Input, { InputType } from 'components/Input'
import { t } from '@lingui/core/macro'

const SearchBarWrapper = styled.div`
  margin-top: 40px;
  width: 100%;
`

interface SearchBarProps {
  onChange: (value: string) => void
  value?: string
}

export default memo(function SearchBar({ onChange, value }: SearchBarProps) {
  return (
    <SearchBarWrapper>
      <Input
        placeholder={t`Search agents`}
        inputType={InputType.SEARCH}
        onChange={(e) => onChange(e.target.value)}
        inputValue={value}
        onResetValue={() => onChange('')}
      />
    </SearchBarWrapper>
  )
})
