import { Trans } from '@lingui/react/macro'
import { t } from "@lingui/core/macro";
import ShareModal from 'components/ShareModal'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import CustomerImgItem from '../CustomerImgItem'
import { IconAssetsShare } from 'components/Icons'
import AiLoading from '../AiLoading'
import { useTheme } from 'store/theme/hooks'

const IdeaItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: calc((100% - 20px) / 2);
  height: fit-content;
  padding: 20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.isMobile ? theme.bg3 : theme.bg1};
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    padding: 14px;
    gap: 14px;
  `}
`

const Title = styled.div<{ isLong: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  gap: 4px;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
  color: ${({ theme }) => theme.text1};
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    padding: 0 6px;
    height: 20px;
    border-radius: 6px;
    color: ${({ theme, isLong }) => isLong ? theme.green : theme.red};
    background-color: ${({ theme, isLong }) => isLong ? theme.depthGreen : theme.depthRed};
  }
`

const Time = styled.div`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.text3};
`

const Content = styled.div`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.text1};
`

const ImgWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  img {
    width: 350px;
    height: auto;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
`

const ShareButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 32px;
  border-radius: 8px;
`

const AskAiButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 8px;
  flex: 1;
  width: auto;
  height: 32px;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  color: ${({ theme }) => theme.text1};
  .ai-loading-wrapper {
    gap: 2px;
    span {
      height: 10px;
      background-color: ${({ theme }) => theme.text1};
    }
  }
`

export default function IdeaItem({
  index,
}: {
  index: number
}) {
  const isLong = true
  const theme = useTheme()
  const [isShowShareModal, setIsShowShareModal] = useState(false)
  const imgList = useMemo(() => {
    const id = `ideaShareId${index}`
    return [
      {
        id,
        key: String(index),
        customerItem: <CustomerImgItem  id={id} imgSouce={''} />
      }
    ]
  }, [index])
  return <IdeaItemWrapper>
    <Title isLong={isLong}>
      Alex Satoshi
      <span>
        Long
      </span>
    </Title>
    <Time>
      2025-02-19 12:00:00
    </Time>
    <Content>
      Combining in-depth insights into historical data and key events with cutting-edge algorithms for precise forecasting, Mlion.ai anticipates that the price of BTC will reach 62306.8 in the next hour and is expected to hover around 63486.41397103162 over the following day.
    </Content>
    <ImgWrapper>
      <img src="" alt="" />
    </ImgWrapper>
    <ButtonWrapper>
      <ShareButton onClick={() => setIsShowShareModal(true)}>
        <IconAssetsShare color={theme.text1} />
      </ShareButton>
      <AskAiButton>
        <AiLoading isLoading={false} isRecording={false} />
        <span><Trans>Ask AI</Trans></span>
      </AskAiButton>
    </ButtonWrapper>
    {isShowShareModal && <ShareModal
      useOutShow
      outShow={isShowShareModal}
      outSetShow={setIsShowShareModal}
      imgList={imgList}
      headerTitle={t`JOJO Exchange Ideas`}
      shareText={t`xxxxxxx`}
    />}
  </IdeaItemWrapper>
}
