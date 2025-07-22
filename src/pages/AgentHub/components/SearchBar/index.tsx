import styled, { css } from 'styled-components'
import { memo } from 'react'
import Input, { InputType } from 'components/Input'
import { t } from '@lingui/core/macro'
import { useIsMobile } from 'store/application/hooks'
import { vm } from 'pages/helper'

const SearchBarWrapper = styled.div`
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: calc(100vw - ${vm(93)});
    `}
`

interface SearchBarProps {
  onChange: (value: string) => void
  value?: string
}

export default memo(function SearchBar({ onChange, value }: SearchBarProps) {
  const isMobile = useIsMobile()
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
