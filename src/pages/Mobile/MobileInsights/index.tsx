import { Trans } from '@lingui/react/macro'
import styled, { css } from 'styled-components'
import PullDownRefresh from 'components/PullDownRefresh'
import { useCallback, useState } from 'react'
import InsightsList from 'pages/Insights/components/InsightsList'
import Header from './components/Header'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { IconBase } from 'components/Icons'
import { getTokenImg } from 'utils'
import BottomSheet from 'components/BottomSheet'
const MobileInsightsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-grow: 1;
`

const ContentWrapper = styled.div`
  position: relative;
  padding: 8px 12px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(8)} ${vm(12)};
  `}
`

const TokenSwitch = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(8)};
    background-color: ${theme.bgL1};
  `}
`

const LeftWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    span {
      position: relative;
      left: ${vm(-12)};
      margin-left: ${vm(8)};
      font-size: .16rem;
      font-weight: 500;
      line-height: .24rem;
      color: ${theme.textL1};
    }
  `}
`

const ImgWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(32)};
    height: ${vm(32)};
    border-radius: 50%;
    border: 2px solid ${theme.bgL1};
    img {
      width: 100%;
      height: 100%;
    }
  `}
`

const MoreTokenWrapper = styled(ImgWrapper)`
  ${({ theme }) => theme.isMobile && css`
    background-color: ${theme.sfC2};
    left: ${vm(-12)};
    .icon-chat-more {
      font-size: .24rem;
      color: ${theme.jade10};
    }
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

export default function MobileInsights() {
  const theme = useTheme()
  const [isShowTokenSwitch, setIsShowTokenSwitch] = useState(false)
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setIsPullDownRefreshing(true)
    setTimeout(() => {
      setIsPullDownRefreshing(false)
    }, 1000)
  }, [])

  const showTokenSwitch = useCallback(() => {
    setIsShowTokenSwitch(!isShowTokenSwitch)
  }, [isShowTokenSwitch])
  return <MobileInsightsWrapper>
    <PullDownRefresh
        onRefresh={onRefresh}
        isRefreshing={isPullDownRefreshing}
        setIsRefreshing={setIsPullDownRefreshing}
      >
        <Header />
        <ContentWrapper>
          <TokenSwitch
            $borderColor={theme.jade10}
            $borderRadius={36}
          >
            <LeftWrapper>
              <ImgWrapper>
                <img src={getTokenImg('BTC')} alt="btc" />
              </ImgWrapper>
              <MoreTokenWrapper>
                <IconBase className="icon-chat-more" />
              </MoreTokenWrapper>
              <span><Trans>ALL Token</Trans></span>
            </LeftWrapper>
            <RightWrapper>
              <UnReadAccount>
                17
              </UnReadAccount>
              <SwitchWrapper
                $borderColor={theme.bgT30}
                $borderRadius="50%"
                onClick={showTokenSwitch}
              >
                <IconBase className="icon-chat-switch" />
              </SwitchWrapper>
            </RightWrapper>
          </TokenSwitch>
          <InsightsList />
          <BottomSheet
            showFromBottom
            rootStyle={{
              height: `calc(100vh - ${vm(68)})`,
              backgroundColor: theme.bgL1
            }}
            isOpen={isShowTokenSwitch} 
            onClose={showTokenSwitch}
          >
            1
          </BottomSheet>
        </ContentWrapper>
      </PullDownRefresh>
  </MobileInsightsWrapper>
}
