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
    height: 80px;
    max-height: 80px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
    background-color: transparent;
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.textL4};
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

export default function WalletManagement({
  walletManagementText,
  setWalletManagementText,
}: {
  walletManagementText: string
  setWalletManagementText: (value: string) => void
}) {
  const theme = useTheme()
  return (
    <InputWrapper $borderRadius={12} $borderColor={theme.text10}>
      <InputArea
        disabledUpdateHeight
        placeholder={t`Enter your wallet addresses (comma-separated): \nExample: 0x123478293892302839827hgsdbh, 0x7e3gqhdbyukeahbuildheli`}
        value={walletManagementText}
        setValue={setWalletManagementText}
      />
    </InputWrapper>
  )
}
