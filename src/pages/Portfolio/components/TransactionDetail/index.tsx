import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import QrCode from 'components/ShareModal/components/QrCode'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

const TransactionDetailWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
  padding: 20px;
  background-color: ${({ theme }) => theme.bgL0};
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  gap: 8px;
  margin-bottom: 12px;
  > span:first-child {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon-chat-back {
      font-size: 28px;
      color: ${({ theme }) => theme.textL1};
    }
  }
  > span:last-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
`

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  .icon-chat-complete {
    font-size: 60px;
    color: ${({ theme }) => theme.jade10};
    margin-bottom: 12px;
  }
  .tx-status {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px; 
    color: ${({ theme }) => theme.jade10};
    margin-bottom: 12px;
  }
  .tx-amount {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-bottom: 4px;
    font-size: 36px;
    font-weight: 700;
    line-height: 44px;
    span:first-child {
      color: ${({ theme }) => theme.textL1};
    }
    span:last-child {
      color: ${({ theme }) => theme.textL3};
    }
  }
  .tx-chain {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
`

const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 36px;
  background: ${({ theme }) => theme.bgL1};
`

const FeeValue = styled.div`
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
`

const DataItem = styled.div`
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
  gap: 12px;
  padding: 20px;
  .title {
    flex-shrink: 0;
    width: 80px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  .value {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px; 
    word-break: break-all;
    color: ${({ theme }) => theme.textL1};
  }
`

const HashWrapper = styled.div`
  display: flex;
  gap: 12px;
  svg {
    flex-shrink: 0;
    border: 1px solid #FFF;
  }
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > span:first-child {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  
`

const DetailButton = styled(ButtonCommon)`
  width: 85px;
  height: 28px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  border-radius: 60px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.textL6};
`

const TimeWrapper = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};
`

export default function TransactionDetail({
  hideTxDetail
}: {
  hideTxDetail: () => void
}) {
  const handleClose = useCallback(() => {
    hideTxDetail()
  }, [hideTxDetail])
  const dataList = useMemo(() => {
    return [
      {
        key: 'fee',
        list: [
          {
            key: 'Miner Fee',
            title: <Trans>Miner Fee</Trans>,
            value: <FeeValue>
              <span>-0.000843</span>
              <span>ETH</span>
            </FeeValue>,
          }
        ]
      },
      {
        key: 'address',
        list: [
          {
            key: 'From',
            title: <Trans>From</Trans>,
            value: '0x1234567890123456789012345678901234567890',
          },
          {
            key: 'To',
            title: <Trans>To</Trans>,
            value: '0x1234567890123456789012345678901234567890',
          }
        ]
      },
      {
        key: 'hash',
        list: [
          {
            key: 'TxID',
            title: <Trans>Hash</Trans>,
            value: <HashWrapper>
              <Left>
                <span>0x7C3C74e51E252F6Bf6500FcB891286Df180617F62F6Bf6500FcB89174e51E252F6Bf</span>
                <DetailButton><Trans>See details</Trans></DetailButton>
              </Left>
              <QRCodeSVG size={60} value={'0x7C3C74e51E252F6Bf6500FcB891286Df180617F62F6Bf6500FcB89174e51E252F6Bf'} />
            </HashWrapper>,
          },
          {
            key: 'Time',
            title: <Trans>Time</Trans>,
            value: <TimeWrapper>
              2025-04-03 12:43:59
            </TimeWrapper>,
          }
        ]
      }
    ]
  }, [])
  return <TransactionDetailWrapper className="scroll-style">
    <TopContent>
      <span onClick={handleClose}>
        <IconBase className="icon-chat-back" />
      </span>
      <span><Trans>Back</Trans></span>
    </TopContent>
    <CenterContent>
      <IconBase className="icon-chat-complete" />
      <span className="tx-status"><Trans>Send Successful</Trans></span>
      <span className="tx-amount">
        <span>-1.08</span>
        <span>ETH</span>
      </span>
      <span className="tx-chain">Ethereum</span>
    </CenterContent>
    {
      dataList.map((item) => {
        const { key, list } = item
        return <DataWrapper key={key}>
          {list.map((item) => {
            const { key, title, value } = item
            return <DataItem key={key}>
              <span className="title">{title}</span>
              <span className="value">{value}</span>
            </DataItem>
          })}
        </DataWrapper>
      })
    }
  </TransactionDetailWrapper>
}
