  import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useCallback } from 'react'
import { useAuthToken } from 'store/logincache/hooks'
import styled from 'styled-components'
import { fadeInDown } from 'styles/animationStyled'

  const DisconnectWalletWrapper = styled.div`
    position: absolute;
    top: 44px;
    right: 0;
    display: none;
    align-items: center;
    justify-content: center;
    padding-top: 12px;
    animation: ${fadeInDown} ${ANI_DURATION}s;
    z-index: 2;
  `

  const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    height: 60px;
    border-radius: 24px;
    white-space: nowrap;
    border: 1px solid ${({ theme }) => theme.bgT30};
    background-color: ${({ theme }) => theme.bgL0};
    cursor: pointer;
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      height: 36px;
      padding: 6px 12px;
      gap: 6px;
      border-radius: 12px;
      background-color: transparent;
      transition: background-color ${ANI_DURATION}s;
      cursor: pointer;
      .icon-disconnect {
        font-size: 24px;
        color: ${({ theme }) => theme.ruby50};
      }
      span {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px; 
        color: ${({ theme }) => theme.ruby50};
      }
    }

    &:hover {
       > span {
        background-color: ${({ theme }) => theme.bgL2};
       }
    }
  `

  export default function DisconnectWallet() {
    const [, setAuthToken] = useAuthToken()
    const disconnectWallet = useCallback(() => {
      setAuthToken('')
    }, [setAuthToken])
    return <DisconnectWalletWrapper className="disconnect-wallet-wrapper">
      <Content onClick={disconnectWallet}>
        <span>
          <IconBase className="icon-disconnect" />
          <span><Trans>Disconnect wallet</Trans></span>
        </span>
      </Content>
    </DisconnectWalletWrapper>
  }
  
  