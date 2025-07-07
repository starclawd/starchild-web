import styled from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import Input, { InputType } from 'components/Input'

const SearchBarWrapper = styled.div`
  margin-top: 40px;
  width: 100%;
`

export default memo(function SearchBar({
  onChange
}: {
  onChange: (value: string) => void
}) {
  return (
    <SearchBarWrapper
    >
     <Input 
        placeholder="Search agents"
        inputType={InputType.SEARCH}
        onChange={(e) => onChange(e.target.value)}
      />
    </SearchBarWrapper>
  )
}) 