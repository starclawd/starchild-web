import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useMemo } from 'react'
import { SolanaWalletHistoryDataType, SolanaWalletOriginalHistoryDataType } from 'store/portfolio/portfolio.d'
import styled from 'styled-components'
import { format } from 'date-fns'
import { getExplorerLink } from 'utils'
import { goOutPageDirect } from 'utils/url'
import { CHAIN_INFO } from 'constants/chainInfo'
import { rotate } from 'styles/animationStyled'
import { useTheme } from 'store/themecache/hooks'

const TransactionDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 8px;
  padding: 20px 16px 20px 20px;
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
  .icon-chat-complete, .icon-chat-close, .icon-loading {
    font-size: 60px;
    color: ${({ theme }) => theme.jade10};
    margin-bottom: 12px;
  }
  .icon-chat-close {
    color: ${({ theme }) => theme.ruby50};
  }
  .icon-loading {
    color: ${({ theme }) => theme.brand6};
    animation: ${rotate} 1s linear infinite;
  }
  .tx-status {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px; 
    color: ${({ theme }) => theme.jade10};
    margin-bottom: 12px;
    
    &.failed {
      color: ${({ theme }) => theme.ruby50};
    }
    
    &.pending {
      color: ${({ theme }) => theme.brand6};
    }
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

export default function SolanaTransactionDetail({
  hideTxDetail,
  data
}: {
  hideTxDetail: () => void
  data: SolanaWalletHistoryDataType
}) {
  const theme = useTheme()
  const handleClose = useCallback(() => {
    hideTxDetail()
  }, [hideTxDetail])

  const { chain, blockTimestamp, originalResult } = data

  // 获取交易类型和状态信息
  const txInfo = useMemo(() => {
    // 初始化默认值
    let txType = 'Transaction';
    let txStatus = 'Completed';
    let txStatusClass = ''; // 状态CSS类名
    let txIcon = 'chat-complete'; // 成功图标
    let txAmount = '0';
    let txSymbol = 'SOL';
    let txPrefix = '';
    let hasValidAmount = true; // 是否有有效的金额

    // 判断交易状态 - Solana 没有 receipt_status，根据 blockNumber 判断
    if (originalResult.blockNumber) {
      txStatus = 'Successful';
    } else {
      txStatus = 'Pending';
      txStatusClass = 'pending';
      txIcon = 'loading';
    }

    // 根据交易类型设置图标和类型
    if (originalResult.transactionType) {
      const txType2 = originalResult.transactionType.toLowerCase();
      
      if (txType2 === 'swap') {
        txType = 'Swap';
      } else if (txType2 === 'transfer') {
        txType = originalResult.bought ? 'Receive' : 'Send';
      } else if (txType2 === 'liquidity') {
        txType = originalResult.subCategory && originalResult.subCategory.includes('remove') 
          ? 'Remove Liquidity' 
          : 'Add Liquidity';
      } else {
        // 默认使用交易类型
        txType = originalResult.transactionType;
      }
    }

    // 处理代币金额信息
    if (originalResult.bought && originalResult.bought.symbol) {
      txSymbol = originalResult.bought.symbol;
      txAmount = originalResult.bought.amount || '0';
      txPrefix = '+';
    } else if (originalResult.sold && originalResult.sold.symbol) {
      txSymbol = originalResult.sold.symbol;
      txAmount = originalResult.sold.amount || '0';
      txPrefix = '-';
    } else {
      hasValidAmount = false;
      txAmount = '--';
      txSymbol = '';
    }

    return {
      txType,
      txStatus,
      txStatusClass,
      txIcon,
      txAmount,
      txSymbol,
      txPrefix,
      hasValidAmount
    };
  }, [originalResult]);

  // 格式化地址
  const formatAddress = (address: string) => {
    if (!address) return '';
    return address;
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return timestamp;
    }
  };

  const goHashPage = useCallback((hashLink: string) => {
    return () => {
      goOutPageDirect(hashLink)
    }
  }, [])

  // 构建交易详情数据列表
  const dataList = useMemo(() => {
    const hashLink = getExplorerLink(chain, originalResult.transactionHash)
    
    // 计算费用 - Solana 没有直接的 transaction_fee 字段
    const fee = '0.000005'; // Solana 交易的默认费用，实际应从 API 获取
    
    return [
      {
        key: 'fee',
        list: [
          {
            key: 'Miner Fee',
            title: <Trans>Network Fee</Trans>,
            value: <FeeValue>
              <span>-{fee}</span>
              <span>SOL</span>
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
            value: formatAddress(originalResult.walletAddress || ''),
          },
          {
            key: 'To',
            title: <Trans>To</Trans>,
            value: formatAddress(originalResult.exchangeAddress || ''),
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
                <span>{originalResult.transactionHash}</span>
                <DetailButton onClick={goHashPage(hashLink)}><Trans>See details</Trans></DetailButton>
              </Left>
              <QRCodeSVG size={60} value={hashLink} bgColor={theme.bgL1} fgColor={theme.white} />
            </HashWrapper>,
          },
          {
            key: 'Time',
            title: <Trans>Time</Trans>,
            value: <TimeWrapper>
              {formatTimestamp(originalResult.blockTimestamp)}
            </TimeWrapper>,
          }
        ]
      }
    ]
  }, [originalResult, chain, theme, goHashPage]);

  return <TransactionDetailWrapper className="scroll-style">
    <TopContent>
      <span onClick={handleClose}>
        <IconBase className="icon-chat-back" />
      </span>
      <span><Trans>Back</Trans></span>
    </TopContent>
    <CenterContent>
      <IconBase className={`icon-${txInfo.txIcon}`} />
      <span className={`tx-status ${txInfo.txStatusClass}`}>
        {txInfo.txType} {txInfo.txStatus}
      </span>
      <span className="tx-amount">
        {txInfo.txAmount !== '--' && <span>{txInfo.txPrefix}{txInfo.txAmount}</span>}
        {txInfo.txSymbol && <span>{txInfo.txSymbol}</span>}
      </span>
      <span className="tx-chain">{CHAIN_INFO[chain]?.chainName || 'Solana'}</span>
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
