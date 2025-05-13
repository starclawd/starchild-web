import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useMemo } from 'react'
import { WalletHistoryDataType } from 'store/portfolio/portfolio.d'
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

export default function TransactionDetail({
  hideTxDetail,
  data
}: {
  hideTxDetail: () => void
  data: WalletHistoryDataType
}) {
  const { originalResult } = data
  const theme = useTheme()
  const handleClose = useCallback(() => {
    hideTxDetail()
  }, [hideTxDetail])

  // 获取交易类型和状态信息
  const txInfo = useMemo(() => {
    // 初始化默认值
    let txType = 'Transaction';
    let txStatus = 'Completed';
    let txStatusClass = ''; // 状态CSS类名
    let txIcon = 'chat-complete'; // 成功图标
    let txAmount = '0';
    let txSymbol = 'ETH';
    let txPrefix = '';
    let hasValidAmount = true; // 是否有有效的金额

    // 判断交易状态
    if (originalResult.receipt_status === '1') {
      txStatus = 'Successful';
    } else if (originalResult.receipt_status === '0') {
      txStatus = 'Failed';
      txStatusClass = 'failed';
      txIcon = 'chat-close';
    } else {
      txStatus = 'Pending';
      txStatusClass = 'pending';
      txIcon = 'loading';
    }

    // 处理特殊摘要信息
    if (originalResult.summary === 'Signed a transaction') {
      txType = 'Signed a transaction';
      txIcon = 'chat-complete'; // 使用approve图标表示签名操作
      // 签名交易通常不涉及具体金额和代币
      txAmount = '--';
      txSymbol = '';
      txPrefix = '';
      hasValidAmount = false;
      
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
    }
    
    // 判断交易类型和金额
    if (originalResult.method_label) {
      txType = originalResult.method_label;
    }

    // 失败交易特殊处理
    if (originalResult.receipt_status === '0') {
      // 如果是失败的交易，但有具体转账信息，会走到下面的判断中
      // 如果是失败交易且没有具体转账信息，则使用默认值
      if ((!originalResult.erc20_transfers || originalResult.erc20_transfers.length === 0) && 
          (!originalResult.nft_transfers || originalResult.nft_transfers.length === 0) && 
          (!originalResult.native_transfers || originalResult.native_transfers.length === 0)) {
        
        txAmount = '--';
        txSymbol = '';
        txPrefix = '';
        hasValidAmount = false;
      }
    }

    // 判断ERC20代币转账
    if (originalResult.erc20_transfers && originalResult.erc20_transfers.length > 0) {
      const transfer = originalResult.erc20_transfers[0];
      txSymbol = transfer.token_symbol;
      txAmount = transfer.value_formatted;
      txPrefix = transfer.direction === 'receive' ? '+' : '-';
      if (!txType || txType === 'Transaction') {
        txType = transfer.direction === 'receive' ? 'Receive' : 'Send';
      }
    }
    // 判断NFT转账
    else if (originalResult.nft_transfers && originalResult.nft_transfers.length > 0) {
      const transfer = originalResult.nft_transfers[0];
      txSymbol = 'NFT';
      txAmount = transfer.amount || '1';
      txPrefix = transfer.direction === 'receive' ? '+' : '-';
      if (!txType || txType === 'Transaction') {
        txType = transfer.direction === 'receive' ? 'Receive NFT' : 'Send NFT';
      }
    }
    // 判断原生代币转账
    else if (originalResult.native_transfers && originalResult.native_transfers.length > 0) {
      const transfer = originalResult.native_transfers[0];
      txSymbol = transfer.token_symbol || 'ETH';
      txAmount = transfer.value_formatted;
      txPrefix = transfer.direction === 'in' || transfer.direction === 'receive' ? '+' : '-';
      if (!txType || txType === 'Transaction') {
        txType = transfer.direction === 'in' || transfer.direction === 'receive' ? 'Receive' : 'Send';
      }
    }
    // 处理合约交互类型
    else if (originalResult.category === 'contract interaction') {
      if (!txType || txType === 'Transaction') {
        txType = 'Contract';
      }
      txIcon = 'approve'; // 使用approve图标表示合约交互
      // 合约交互如果没有转账信息，通常不显示具体金额
      txAmount = '--';
      txSymbol = '';
      txPrefix = '';
      hasValidAmount = false;
    }
    // 其他情况
    else if (originalResult.category === 'airdrop') {
      txType = 'Airdrop';
      txPrefix = '+';
    } else if (hasValidAmount) { // 仅在有有效金额时尝试解析
      // 默认使用交易值
      txAmount = originalResult.value;
      // 尝试从summary提取信息
      if (originalResult.summary && originalResult.summary !== 'Signed a transaction') {
        const parts = originalResult.summary.split(' ');
        if (parts.length >= 2) {
          txAmount = parts[1];
          if (parts.length >= 3) {
            txSymbol = parts[2];
          }
        }
      }
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
    const hashLink = getExplorerLink(data.chain, originalResult.block_hash)
    return [
      {
        key: 'fee',
        list: [
          {
            key: 'Miner Fee',
            title: <Trans>Miner Fee</Trans>,
            value: <FeeValue>
              <span>-{originalResult.transaction_fee || '0'}</span>
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
            value: formatAddress(originalResult.from_address),
          },
          {
            key: 'To',
            title: <Trans>To</Trans>,
            value: formatAddress(originalResult.to_address),
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
                <span>{originalResult.block_hash}</span>
                <DetailButton onClick={goHashPage(hashLink)}><Trans>See details</Trans></DetailButton>
              </Left>
              <QRCodeSVG size={60} value={hashLink} bgColor={theme.bgL1} fgColor={theme.white} />
            </HashWrapper>,
          },
          {
            key: 'Time',
            title: <Trans>Time</Trans>,
            value: <TimeWrapper>
              {formatTimestamp(originalResult.block_timestamp)}
            </TimeWrapper>,
          }
        ]
      }
    ]
  }, [data, goHashPage, theme, originalResult.block_hash, originalResult.block_timestamp, originalResult.transaction_fee, originalResult.from_address, originalResult.to_address]);

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
        <Trans>{txInfo.txType} {txInfo.txStatus}</Trans>
      </span>
      <span className="tx-amount">
        {txInfo.txAmount !== '--' && <span>{txInfo.txPrefix}{txInfo.txAmount}</span>}
        {txInfo.txSymbol && <span>{txInfo.txSymbol}</span>}
      </span>
      <span className="tx-chain">{CHAIN_INFO[data.chain]?.chainName || 'Ethereum'}</span>
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
