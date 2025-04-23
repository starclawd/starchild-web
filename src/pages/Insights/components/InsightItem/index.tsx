import styled, { css } from 'styled-components'
import { useTheme } from 'store/theme/hooks'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import btc from 'assets/coin/btc.png'
import TransitionWrapper from 'components/TransitionWrapper'
import { useCallback, useMemo, useState } from 'react'
import { ANI_DURATION } from 'constants/index'
import { Border1PxBox } from 'styles/theme'
import ArcBg from '../ArcBg'

const InsightItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    gap: ${vm(16)};
    padding: ${vm(20)} 0;
    border-radius: ${vm(36)};
    background-color: ${({ theme }) => theme.bgL1};
  `}
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    height: ${vm(24)};
    padding: 0 ${vm(20)};
  `}
`

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(20)};
    padding: ${vm(2)} ${vm(6)};
    border-radius: ${vm(4)};
    background-color: ${theme.bgT20};
    font-size: .11rem;
    font-weight: 500;
    line-height: .16rem;
    color: ${theme.textL2};
  `}
`

const PredictionWrapper = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  ${({ theme, $isLong }) => theme.isMobile && css`
    gap: ${vm(4)};
    span {
      font-size: .16rem;
      font-weight: 500;
      line-height: .24rem;
    }
    .icon-chat-arrow-long {
      font-size: .24rem;
      color: ${theme.jade10};
    }
    .icon-chat-arrow-short {
      font-size: .24rem;
      color: ${theme.ruby50};
    }
    ${$isLong
      ? css`
        span {
          color: ${theme.jade10};
        }
      `
      : css`
        span {
          color: ${theme.ruby50};
        }
      `
    }
  `}
`

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    gap: ${vm(12)};
    padding: 0 ${vm(20)};
  `}
`

const TopContent = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  ${({ theme, $isLong }) => theme.isMobile && css`
    gap: ${vm(6)};
    img {
      width: ${vm(32)};
      height: ${vm(32)};
    }
    > span {
      font-size: .18rem;
      font-weight: 500;
      line-height: .26rem;
      color: ${theme.textL1};
      ${$isLong
        ? css`
          span {
            color: ${theme.jade10};
          }
        `
        : css`
          span {
            color: ${theme.ruby50};
          }
        `
      }
    }
  `}
`

const TimeWrapper = styled.div<{ $showDetailCoin: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ theme, $showDetailCoin }) => theme.isMobile && css`
    gap: ${vm(12)};
    > span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: .11rem;
      font-weight: 400;
      line-height: .16rem;
      color: ${theme.textL3};
      .icon-chat-expand-down {
        font-size: .14rem;
        color: ${theme.textL1};
        transition: transform ${ANI_DURATION}s;
      }
      ${$showDetailCoin && css`
        .icon-chat-expand-down {
          transform: rotate(180deg);
        }
      `}
    }
  `}
`

const CoinDetail = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    gap: ${vm(4)};
    padding: ${vm(8)} ${vm(12)};
    border-radius: ${vm(16)};
    background-color: ${theme.bgT20};
  `}
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(2)};
    font-size: .11rem;
    font-weight: 500;
    line-height: .16rem;
    span:first-child {
      color: ${theme.textL1};
    }
    span:last-child {
      color: ${theme.textL3};
    }
  `}
`

const CoinItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    .title {
      font-size: .11rem;
      font-weight: 500;
      line-height: .16rem;
      color: ${theme.textL3};
    }
  `}
`

const AnalysisWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    .analysis-title {
      display: flex;
      align-items: center;
      gap: ${vm(2)};
      font-size: .11rem;
      font-weight: 400;
      line-height: .16rem; 
      color: ${theme.textL1};
      .icon-chat-analyze-agent {
        font-size: .14rem;
        color: ${theme.jade10};
      }
    }
    .analysis-content {
      font-size: .14rem;
      font-weight: 400;
      line-height: .2rem; 
      color: ${theme.textL3};
    }
  `}
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.isMobile && css`
    padding: 0 ${vm(20)};
  `}
`

const ShareWrapper = styled(Border1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(44)};
    height: ${vm(44)};
    border-radius: 50%;
    .icon-chat-share {
      font-size: .24rem;
      color: ${theme.textL2};
    }
  `}
`

const ButtonAgent = styled(Border1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(44)};
    padding: 0 ${vm(18)};
    gap: ${vm(8)};
    font-size: .13rem;
    font-weight: 400;
    line-height: .2rem;
    color: ${theme.textL1};
    .icon-chat-robot {
      font-size: .24rem;
      color: ${theme.jade10};
    }
  `}
`


export default function InsightItem({
  index,
}: {
  index: number
}) {
  const isLong = false
  const theme = useTheme()
  const [showDetailCoin, setShowDetailCoin] = useState(false)
  const detailList = useMemo(() => {
    return [
      {
        key: 'price',
        title: <Trans>Price</Trans>,
        value: <ValueWrapper>
          <span>85,532</span>
          <span>USDC</span>
        </ValueWrapper>,
      },
      {
        key: 'Open',
        title: <Trans>Open</Trans>,
        value: <ValueWrapper>
          <span>85,532</span>
          <span>USDC</span>
        </ValueWrapper>,
      },
      {
        key: 'Price change %',
        title: <Trans>Price change %</Trans>,
        value: <ValueWrapper>
          <span>3.39%</span>
        </ValueWrapper>,
      },
      
    ]
  }, [])
  const toggleShowDetailCoin = useCallback(() => {
    setShowDetailCoin(!showDetailCoin)
  }, [showDetailCoin])
  return <InsightItemWrapper>
    <HeaderWrapper>
      <ActionWrapper><Trans>Price action</Trans></ActionWrapper>
      <PredictionWrapper $isLong={isLong}>
        <span>
          {
            isLong ? <Trans>Long</Trans> : <Trans>Short</Trans>
          }
        </span>
        <IconBase className={isLong ? 'icon-chat-arrow-long' : 'icon-chat-arrow-short'} />
      </PredictionWrapper>
    </HeaderWrapper>
    <CenterWrapper>
      <TopContent $isLong={isLong}>
        <img src={btc} alt="btc" />
        <span>BTC price <span>decreased</span> by 1.2% in 10m</span>
      </TopContent>
      <TimeWrapper $showDetailCoin={showDetailCoin} onClick={toggleShowDetailCoin}>
        <span>
          <span><Trans>1 hours ago</Trans></span>
          <IconBase className="icon-chat-expand-down" />
        </span>
        <TransitionWrapper visible={showDetailCoin}>
          <CoinDetail>
            {detailList.map((item) => {
              const { key, title, value } = item
              return <CoinItem key={key}>
                <span className="title">{title}</span>
                <span className="value">{value}</span>
              </CoinItem>
            })}
          </CoinDetail>
        </TransitionWrapper>
      </TimeWrapper>
      <AnalysisWrapper>
        <span className="analysis-title">
          <IconBase className="icon-chat-analyze-agent" />
          <Trans>Analysis</Trans>
        </span>
        <span className="analysis-content">
          Ethereum dropped following the delay announcement of the network's scaling upgrade. On-chain metrics show increased outflows from major exchanges, suggesting potential sell pressure continuing in the short term.
        </span>
      </AnalysisWrapper>
    </CenterWrapper>
    <BottomContent>
      <ShareWrapper
        $borderBottom
        $borderLeft
        $borderRight
        $borderTop
        $borderColor={theme.bgT30}
      >
        <IconBase className="icon-chat-share" />
      </ShareWrapper>
      <ButtonAgent
        $borderBottom
        $borderLeft
        $borderRight
        $borderTop
        $borderColor={theme.bgT30}
        $borderRadius={44}
      >
        <IconBase className="icon-chat-robot" />
        <Trans>AI Agent</Trans>
      </ButtonAgent>
    </BottomContent>
    <ArcBg isLong={isLong} />
  </InsightItemWrapper>
}
