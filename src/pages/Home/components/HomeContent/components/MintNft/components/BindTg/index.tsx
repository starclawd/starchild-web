import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import Pending from 'components/Pending'
import { useSleep } from 'hooks/useSleep'
import { vm } from 'pages/helper'
import { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
const BindTgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 32px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const BindTgInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  span:first-child {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      span:first-child {
        font-size: 0.18rem;
        line-height: 0.26rem;
      }
      span:last-child {
        font-size: 0.13rem;
        line-height: 0.2rem;
      }
    `}
`

const BindTgButton = styled(HomeButton)`
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(180)};
    `}
`

export default function BindTg({ setHasBingdTg }: { setHasBingdTg: (hasBingdTg: boolean) => void }) {
  const sleep = useSleep()
  const [isBindNftLoading, setIsBindNftLoading] = useState(false)
  const bindNft = useCallback(async () => {
    setIsBindNftLoading(true)
    await sleep(1000)
    setIsBindNftLoading(false)
    setHasBingdTg(true)
  }, [sleep, setHasBingdTg])
  return (
    <BindTgWrapper>
      <BindTgInfo>
        <span>
          <Trans>StarChild NFT detected</Trans>
          {/* <Trans>StarChild NFT mint successful</Trans> */}
        </span>
        <span>
          <Trans>You can proceed with authorization login</Trans>
        </span>
      </BindTgInfo>
      <BindTgButton onClick={bindNft}>{isBindNftLoading ? <Pending /> : <Trans>Bind Telegram</Trans>}</BindTgButton>
    </BindTgWrapper>
  )
}
