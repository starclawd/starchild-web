import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'
import InputArea from 'components/InputArea'
import { t } from '@lingui/core/macro'

const InputWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  padding: 12px;
  transition: all ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.black700};
  textarea {
    height: 120px;
    max-height: 120px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
    background-color: transparent;
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.black300};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      textarea {
        height: ${vm(120)};
        max-height: ${vm(120)};
        font-size: 0.14rem;
        font-weight: 400;
        line-height: 0.2rem;
        &::placeholder {
          font-size: 0.14rem;
          font-weight: 400;
          line-height: 0.2rem;
        }
      }
    `}
`

export default function PersonalProfile({
  personalProfileText,
  setPersonalProfileText,
}: {
  personalProfileText: string
  setPersonalProfileText: (value: string) => void
}) {
  const theme = useTheme()
  return (
    <InputWrapper $borderRadius={12} $borderColor={theme.black600}>
      <InputArea
        disabledUpdateHeight
        placeholder={t`Ready to learn about you! Add some details to help me assist you better.`}
        value={personalProfileText}
        setValue={setPersonalProfileText}
      />
    </InputWrapper>
  )
}
