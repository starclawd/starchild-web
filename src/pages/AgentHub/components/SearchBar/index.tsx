import styled, { css } from 'styled-components'
import { memo, useState } from 'react'
import Input, { InputType } from 'components/Input'
import { t } from '@lingui/core/macro'
import { useIsMobile } from 'store/application/hooks'
import { vm } from 'pages/helper'

const SearchBarWrapper = styled.div<{ $isFocus: boolean }>`
  width: 100%;

  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: calc(100% - ${vm(53)});
          .input-wrapper {
            border-radius: ${vm(12)};
            .icon-search {
              color: ${({ theme }) => theme.textL3};
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
              color: ${({ theme }) => theme.textL3};
            }
            input {
              padding: 0 46px;
              font-size: 16px;
              font-weight: 400;
              line-height: 24px;
            }
          }
        `}
  ${({ $isFocus }) =>
    $isFocus &&
    css`
      .input-wrapper {
        border-color: ${({ theme }) => theme.textL3};
      }
    `}
`

interface SearchBarProps {
  onChange: (value: string) => void
  value?: string
}

export default memo(function SearchBar({ onChange, value }: SearchBarProps) {
  const [isFocus, setIsFocus] = useState(false)
  return (
    <SearchBarWrapper $isFocus={isFocus}>
      <Input
        placeholder={t`Search agents`}
        inputType={InputType.SEARCH}
        onChange={(e) => onChange(e.target.value)}
        inputValue={value}
        onResetValue={() => onChange('')}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </SearchBarWrapper>
  )
})
