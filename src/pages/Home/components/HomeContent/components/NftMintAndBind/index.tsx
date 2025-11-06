import styled, { css } from 'styled-components'
import { ContentWrapper } from '../../styles'
import TgInfo from '../TgInfo'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import BindSuccess from './components/BindSuccess'
import WalletAddress from '../WalletAddress'
import GoogleInfo from '../Google'

const NftMintAndBindWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: fit-content;
  min-height: 272px;
  transition: height ${ANI_DURATION}s;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(335)};
      height: auto;
      flex-direction: column;
      gap: ${vm(16)};
      padding: ${vm(16)};
      border-radius: ${vm(16)};
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(6px);
    `}
`

const Left = styled(ContentWrapper)`
  width: 480px;
  height: 100%;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: auto;
      gap: ${vm(16)};
      padding: 0;
      border: none;
      background: none;
      backdrop-filter: none;
    `}
`

const LeftTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

const LeftBottom = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export default function NftMintAndBind() {
  return (
    <NftMintAndBindWrapper>
      <Left>
        <LeftTop>
          <TgInfo />
          <WalletAddress />
          <GoogleInfo />
        </LeftTop>
        <LeftBottom>
          <BindSuccess />
        </LeftBottom>
      </Left>
      {/* {isMobile && <Divider color={theme.text20} />} */}
    </NftMintAndBindWrapper>
  )
}
