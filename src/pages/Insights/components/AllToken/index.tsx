import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useGetTokenImg } from 'store/application/hooks'
import { useInsightsList, useTokenList } from 'store/insights/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const AllTokenWrapper = styled(BorderAllSide1PxBox)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 64px;
  padding: 16px;
  transition: border-color ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.bgL0};
  ${({ theme, $isActive }) => theme.isMobile
  ? css`
    height: ${vm(48)};
    padding: ${vm(8)};
    background-color: ${theme.bgL1};
  ` : css`
    ${!$isActive && css`
      &:hover {
        border: 1px solid ${theme.textL6};
      }
    `}
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  left: ${({ $index }) => $index * 20}px;
  border: 2px solid ${({ theme }) => theme.bgL1};
  &:first-child {
    border: none;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  ${({ theme, $index }) => theme.isMobile && css`
    width: ${vm(32)};
    height: ${vm(32)};
    left: ${vm($index * 20)};
  `}
`

const MoreTokenWrapper = styled(ImgWrapper)<{ $index: number }>`
  left: ${({ $index }) => $index * 20}px;
  background-color: ${({ theme }) => theme.sfC2};
  .icon-chat-more {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme, $index }) => theme.isMobile && css`
    left: ${vm($index * 20)};
    .icon-chat-more {
      font-size: .24rem;
      color: ${theme.jade10};
    }
  `}
`

const AllTokenText = styled.span<{ $index: number }>`
  position: absolute;
  left: ${({ $index }) => $index * 20}px;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL1};
  white-space: nowrap;
  ${({ theme, $index }) => theme.isMobile && css`
    margin-left: ${vm(20)};
    font-size: .16rem;
    font-weight: 500;
    line-height: .24rem;
    left: ${vm($index * 20)};
  `}
`
const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const UnReadAccount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.jade10};
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(24)};
    height: ${vm(24)};
    font-size: .12rem;
    font-weight: 500;
    line-height: .18rem;
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
  const getTokenImg = useGetTokenImg()
  const [insightsList] = useInsightsList()
  const tokenList = useTokenList().slice(0, 5)
  const unReadCount = insightsList.filter(insight => !insight.isRead).length
  return <AllTokenWrapper
    $hideBorder={!isActive}
    $borderColor={theme.jade10}
    $borderRadius={36}
    $isActive={isActive}
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
      {unReadCount > 0 && <UnReadAccount>
        {unReadCount}
      </UnReadAccount>}
      {isSwitchFunc && <SwitchWrapper
        $borderColor={theme.bgT30}
        $borderRadius={16}
      >
        <IconBase className="icon-chat-switch" />
      </SwitchWrapper>}
    </RightWrapper>
  </AllTokenWrapper>
}
