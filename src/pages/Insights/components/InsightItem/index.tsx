import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import TransitionWrapper from 'components/TransitionWrapper'
import { useCallback, useMemo, useState } from 'react'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import ArcBg from '../ArcBg'
import { getTokenImg } from 'utils'
import { useIsMobile } from 'store/application/hooks'
import { NewsDataType } from 'store/tradeai/tradeai'

const InsightItemWrapper = styled.div<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  width: 100%;
  max-height: 600px;
  gap: 16px;
  padding: 20px 0;
  border-radius: 36px;
  transition: max-height ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.bgL1};
  ${({ theme, $isActive }) => theme.isMobile
  ? css`
    max-height: unset;
    gap: ${vm(16)};
    padding: ${vm(20)} 0;
    border-radius: ${vm(36)};
  ` : css`
    ${!$isActive && css`
      max-height: 64px;
      border: 1px solid ${theme.bgT30};
      background-color: transparent;
    `}
    cursor: pointer;
  `}
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  padding: 0 20px;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(24)};
    padding: 0 ${vm(20)};
  `}
`

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  > span:first-child {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.jade10};
    box-shadow: 0px 0px 8px ${({ theme }) => theme.jade10};
    
    @keyframes breathe {
      0% {
        box-shadow: 0px 0px 4px ${({ theme }) => theme.jade10};
      }
      50% {
        box-shadow: 0px 0px 15px ${({ theme }) => theme.jade10};
      }
      100% {
        box-shadow: 0px 0px 4px ${({ theme }) => theme.jade10};
      }
    }
    animation: breathe 5s infinite ease-in-out;
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    > span:first-child {
      width: ${vm(8)};
      height: ${vm(8)};
      box-shadow: 0px 0px ${vm(8)} ${theme.jade10};
      
      @keyframes mobileBreathe {
        0% {
          box-shadow: 0px 0px ${vm(4)} ${theme.jade10};
        }
        50% {
          box-shadow: 0px 0px ${vm(15)} ${theme.jade10};
        }
        100% {
          box-shadow: 0px 0px ${vm(4)} ${theme.jade10};
        }
      }
      animation: mobileBreathe 5s infinite ease-in-out;
    }
  `}
`

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.bgT20};
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(20)};
    padding: ${vm(2)} ${vm(6)};
    border-radius: ${vm(4)};
    font-size: .11rem;
    font-weight: 500;
    line-height: .16rem;
  `}
`

const PredictionWrapper = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
  .icon-chat-arrow-long {
    font-size: 24px;
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-arrow-short {
    font-size: 24px;
    color: ${({ theme }) => theme.ruby50};
  }
  ${({ theme, $isLong }) => $isLong
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
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    span {
      font-size: .16rem;
      font-weight: 500;
      line-height: .24rem;
    }
    .icon-chat-arrow-long {
      font-size: .24rem;
    }
    .icon-chat-arrow-short {
      font-size: .24rem;
    }
  `}
`

const CenterWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  padding: 0 20px;
  z-index: 1;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(12)};
    padding: 0 ${vm(20)};
  `}
`

const TopContent = styled.div<{ $isLong: boolean, $shortContent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  img {
    width: 32px;
    height: 32px;
  }
  .top-content-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .price-direction-text {
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.textL1};
    ${({ theme, $isLong }) => $isLong
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
  .time-text {
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ $shortContent }) => $shortContent && css`
    flex: 1;
    padding-right: 24px;
    .price-direction-text {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      margin-left: 6px;
    }
  `}
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(6)};
    justify-content: flex-start;
    img {
      width: ${vm(32)};
      height: ${vm(32)};
    }
    .price-direction-text {
      font-size: .18rem;
      font-weight: 500;
      line-height: .26rem;
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
  flex-direction: row;
  width: 100%;
  gap: 12px;
  ${({ theme }) => theme.isMobile && css`
    flex-direction: column;
    gap: ${vm(4)};
    padding: ${vm(8)} ${vm(12)};
    border-radius: ${vm(16)};
    background-color: ${theme.bgT20};
  `}
`

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  span:first-child {
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(2)};
    font-size: .11rem;
    font-weight: 500;
    line-height: .16rem;
  `}
`

const CoinItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(100% / 3);
  padding: 8px 12px;
  gap: 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgT20};
  .title {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    background-color: transparent;
    border-radius: 0;
    .title {
      font-size: .11rem;
      font-weight: 500;
      line-height: .16rem;
    }
  `}
`

const AnalysisWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  .analysis-title {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
    .icon-chat-analyze-agent {
      font-size: 18px;
      color: ${({ theme }) => theme.jade10};
    }
  } 
  .analysis-content {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
    .analysis-title {
      gap: ${vm(2)};
      font-size: .11rem;
      font-weight: 400;
      line-height: .16rem;
      .icon-chat-analyze-agent {
        font-size: .14rem;
      }
    }
    .analysis-content {
      font-size: .14rem;
      font-weight: 400;
      line-height: .2rem;
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

const ShareWrapper = styled(BorderAllSide1PxBox)`
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

const ButtonAgent = styled(BorderAllSide1PxBox)`
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
  data,
  isActive,
  currentShowId,
  setCurrentShowId,
}: {
  data: NewsDataType
  isActive: boolean
  currentShowId: string
  setCurrentShowId: (id: string) => void
}) {
  const { id, isLong, symbol } = data
  const isMobile = useIsMobile()
  const [showDetailCoin, setShowDetailCoin] = useState(false)
  const showShortContent = useMemo(() => {
    return !isActive && !isMobile
  }, [isActive, isMobile])
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
  return <InsightItemWrapper
    $isActive={isActive}
    onClick={() => setCurrentShowId(id)}
  >
    <HeaderWrapper>
      <Left>
        <span></span>
        <ActionWrapper><Trans>Price action</Trans></ActionWrapper>
      </Left>
      {showShortContent && <TopContent $shortContent={true} $isLong={isLong}>
        <span className="top-content-left">
          <span className="price-direction-text">{symbol} price <span>decreased</span> by 1.2% in 10m</span>
        </span>
        <span className="time-text"><Trans>1 hours ago</Trans></span>
      </TopContent>}
      <PredictionWrapper $isLong={isLong}>
        <span>
          {
            isLong ? <Trans>Long</Trans> : <Trans>Short</Trans>
          }
        </span>
        <IconBase className={isLong ? 'icon-chat-arrow-long' : 'icon-chat-arrow-short'} />
      </PredictionWrapper>
    </HeaderWrapper>
    {!showShortContent && <CenterWrapper>
      {isMobile ? <TopContent $isLong={isLong}>
        <img src={getTokenImg(symbol)} alt={symbol} />
        <span className="price-direction-text">{symbol} price <span>decreased</span> by 1.2% in 10m</span>
      </TopContent> : <TopContent $isLong={isLong}>
        <span className="top-content-left">
          <img src={getTokenImg(symbol)} alt={symbol} />
          <span className="price-direction-text">{symbol} price <span>decreased</span> by 1.2% in 10m</span>
        </span>
        <span className="time-text"><Trans>1 hours ago</Trans></span>
      </TopContent>}
      {isMobile ? <TimeWrapper $showDetailCoin={showDetailCoin} onClick={toggleShowDetailCoin}>
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
      </TimeWrapper> : <CoinDetail>
        {detailList.map((item) => {
          const { key, title, value } = item
          return <CoinItem key={key}>
            <span className="title">{title}</span>
            <span className="value">{value}</span>
          </CoinItem>
        })}
      </CoinDetail>}
      <AnalysisWrapper>
        <span className="analysis-title">
          <IconBase className="icon-chat-analyze-agent" />
          <Trans>Analysis</Trans>
        </span>
        <span className="analysis-content">
          Ethereum dropped following the delay announcement of the network's scaling upgrade. On-chain metrics show increased outflows from major exchanges, suggesting potential sell pressure continuing in the short term.
        </span>
      </AnalysisWrapper>
    </CenterWrapper>}
    {/* <BottomContent>
      <ShareWrapper
        $borderColor={theme.bgT30}
      >
        <IconBase className="icon-chat-share" />
      </ShareWrapper>
      <ButtonAgent
        $borderColor={theme.bgT30}
        $borderRadius={44}
      >
        <IconBase className="icon-chat-robot" />
        <Trans>AI Agent</Trans>
      </ButtonAgent>
    </BottomContent> */}
    {!showShortContent && <ArcBg isLong={isLong} />}
  </InsightItemWrapper>
}
