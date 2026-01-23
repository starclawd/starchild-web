import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'
import InputArea from 'components/InputArea'
import { msg, t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react/macro'

const InputWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  padding: 12px;
  transition: all ${ANI_DURATION}s;
  background: ${({ theme }) => theme.black700};
  backdrop-filter: blur(8px);
  textarea {
    height: 96px;
    max-height: 96px;
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
        height: ${vm(80)};
        max-height: ${vm(80)};
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
  const { t } = useLingui()
  return (
    <InputWrapper $borderRadius={4} $borderColor={theme.black600}>
      <InputArea
        disabledUpdateHeight
        placeholder={t(msg`Ready to learn about you! Add some details to help me assist you better.`)}
        value={personalProfileText}
        setValue={setPersonalProfileText}
      />
    </InputWrapper>
  )
}
