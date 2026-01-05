import styled, { css } from 'styled-components'
import { memo, useState } from 'react'
import Input, { InputType } from 'components/Input'
import { t } from '@lingui/core/macro'
import { vm } from 'pages/helper'

const SearchBarWrapper = styled.div`
  width: 100%;

  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: calc(100% - ${vm(53)});
          .input-wrapper {
            border-radius: ${vm(12)};
            .icon-search {
              color: ${({ theme }) => theme.black200};
            }
            input {
              padding: 0 ${vm(40)};
            }
          }
        `
      : css`
          .input-wrapper {
            height: 60px;
            border-radius: 16px;
            .icon-search {
              font-size: 24px;
              color: ${({ theme }) => theme.black200};
            }
            input {
              padding: 0 46px;
              font-size: 16px;
              font-weight: 400;
              line-height: 24px;
            }
          }
        `}
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
