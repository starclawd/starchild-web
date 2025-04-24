import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useTokenList } from 'store/insights/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { getTokenImg } from 'utils'

const AllTokenWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(48)};
    padding: ${vm(8)};
    background-color: ${theme.bgL1};
  `}
`

const LeftWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ImgWrapper = styled.div<{ $index: number }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme, $index }) => theme.isMobile && css`
    width: ${vm(32)};
    height: ${vm(32)};
    border-radius: 50%;
    border: 2px solid ${theme.bgL1};
    left: ${vm($index * 20)};
    &:first-child {
      border: none;
    }
    img {
      width: 100%;
      height: 100%;
    }
  `}
`

const MoreTokenWrapper = styled(ImgWrapper)<{ $index: number }>`
  ${({ theme, $index }) => theme.isMobile && css`
    background-color: ${theme.sfC2};
    left: ${vm($index * 20)};
    .icon-chat-more {
      font-size: .24rem;
      color: ${theme.jade10};
    }
  `}
`

const AllTokenText = styled.span<{ $index: number }>`
  white-space: nowrap;
  ${({ theme, $index }) => theme.isMobile && css`
    position: absolute;
    left: ${vm(-12)};
    margin-left: ${vm(20)};
    font-size: .16rem;
    font-weight: 500;
    line-height: .24rem;
    color: ${theme.textL1};
    left: ${vm($index * 20)};
  `}
`
const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const UnReadAccount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(24)};
    height: ${vm(24)};
    border-radius: 50%;
    font-size: .12rem;
    font-weight: 500;
    line-height: .18rem;
    color: #000;
    background-color: ${theme.jade10};
  `}
`

const SwitchWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(32)};
    height: ${vm(32)};
    .icon-chat-switch {
      font-size: .18rem;
      color: ${theme.textL2};
    }
  `}
`

export default function AllToken({
  isActive,
  isSwitchFunc,
  clickCallback
}: {
  isActive: boolean
  isSwitchFunc: boolean
  clickCallback: () => void
}) {
  const theme = useTheme()
  const tokenList = useTokenList()
  return <AllTokenWrapper
    $hideBorder={!isActive}
    $borderColor={theme.jade10}
    $borderRadius={36}
    onClick={clickCallback}
  >
    <LeftWrapper>
      {tokenList.map((tokenData, index) => {
        const { symbol } = tokenData
        return <ImgWrapper key={symbol} $index={index}>
          <img src={getTokenImg(symbol)} alt={symbol} />
        </ImgWrapper>
      })}
      <MoreTokenWrapper $index={tokenList.length}>
        <IconBase className="icon-chat-more" />
      </MoreTokenWrapper>
      <AllTokenText $index={tokenList.length + 1}><Trans>ALL Token</Trans></AllTokenText>
    </LeftWrapper>
    <RightWrapper>
      <UnReadAccount>
        17
      </UnReadAccount>
      {isSwitchFunc && <SwitchWrapper
        $borderColor={theme.bgT30}
        $borderRadius="50%"
      >
        <IconBase className="icon-chat-switch" />
      </SwitchWrapper>}
    </RightWrapper>
  </AllTokenWrapper>
}
