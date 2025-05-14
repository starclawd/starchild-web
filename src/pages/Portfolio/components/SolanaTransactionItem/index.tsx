import { IconBase } from 'components/Icons'
import { useCallback } from 'react'
import { SolanaWalletHistoryDataType, SolanaWalletOriginalHistoryDataType, WalletHistoryDataType } from 'store/portfolio/portfolio.d'
import styled from 'styled-components'
import { format } from 'date-fns'
import Pending from 'components/Pending'
import { CHAIN_INFO } from 'constants/chainInfo'

const TransactionItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 44px;
  cursor: pointer;
`

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bgL2};
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
`

const TypeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  .type-info-top {
    display: flex;
    align-items: center;
    gap: 2px;
    > span:first-child {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      span:first-child {
        text-transform: capitalize;
        color: ${({ theme }) => theme.textL3}
      }
      span:last-child {
        color: ${({ theme }) => theme.textL1}
      }
    }
    > span:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 18px;
      border-radius: 4px;
      padding: 0 6px;
      font-size: 10px;
      font-weight: 500;
      line-height: 14px; 
      color: ${({ theme }) => theme.textL2};
      background-color: ${({ theme }) => theme.textL6};
    }
    
  }
  .status-info {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
`

const ItemRight = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 2px;
  .tx-amount {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    span:first-child {
      color: ${({ theme }) => theme.textL1}
    }
    span:last-child {
      color: ${({ theme }) => theme.textL3}
    }
  }
  .tx-time {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    text-align: right;
    color: ${({ theme }) => theme.textL4}
  }
`

// 获取交易类型和相关信息
const getTransactionTypeInfo = (data: SolanaWalletOriginalHistoryDataType) => {
  // 初始化变量存储最终返回的数据
  let type = '';
  let symbol = '';
  let amount = '';
  let prefix = '';
  let icon = 'send'; // 默认图标

  // 根据 Solana 交易类型判断
  if (data.transactionType) {
    const txType = data.transactionType.toLowerCase();
    
    // 根据交易类型设置 icon 和 type
    if (txType === 'swap') {
      icon = 'chat-switch';
      type = 'Swap';
    } else if (txType === 'transfer') {
      // 根据是买入还是卖出来确定是收款还是发送
      if (data.bought && data.bought.amount) {
        icon = 'receive';
        type = 'Receive';
        prefix = '+';
      } else if (data.sold && data.sold.amount) {
        icon = 'send';
        type = 'Send';
        prefix = '-';
      }
    } else if (txType === 'liquidity') {
      icon = 'liquidity';
      type = data.subCategory && data.subCategory.includes('remove') ? 'Remove Liquidity' : 'Add Liquidity';
    } else if (txType === 'stake' || txType === 'unstake') {
      icon = 'stake';
      type = txType === 'stake' ? 'Stake' : 'Unstake';
    } else if (txType === 'airdrop') {
      icon = 'receive';
      type = 'Airdrop';
      prefix = '+';
    } else {
      // 默认使用交易类型
      type = data.transactionType;
    }
  }

  // 处理代币信息
  if (data.bought && data.bought.symbol) {
    symbol = data.bought.symbol;
    amount = data.bought.amount || '';
    if (!prefix) prefix = '+';
  } else if (data.sold && data.sold.symbol) {
    symbol = data.sold.symbol;
    amount = data.sold.amount || '';
    if (!prefix) prefix = '-';
  }

  // 如果没有得到合适的类型
  if (!type) {
    type = 'Transaction';
  }

  // 如果没有得到金额信息
  if (!amount) {
    amount = '--';
  }

  return { type, symbol, amount, prefix, icon };
};

// 格式化地址，显示前4位和后4位
const formatAddress = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// 格式化代币符号，超过8个字符时显示前两位和后三位
const formatSymbol = (symbol: string) => {
  if (!symbol || symbol.length <= 8) return symbol;
  return `${symbol.substring(0, 2)}...${symbol.substring(symbol.length - 3)}`;
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

export default function SolanaTransactionItem({
  data,
  onClick
}: {
  data: SolanaWalletHistoryDataType
  onClick: (data: SolanaWalletHistoryDataType) => void
}) {
  const { chain, blockTimestamp, originalResult } = data
  const handleClick = useCallback(() => {
    onClick(data)
  }, [onClick, data])
  
  const { type, symbol, amount, prefix, icon } = getTransactionTypeInfo(originalResult);
  
  // 确定交易状态 - Solana 没有 receipt_status，所以只检查是否已经确认
  let status;
  let showPending = false;
  
  if (originalResult.blockNumber) {
    status = 'Confirmed';
  } else {
    status = 'Pending';
    showPending = true;
  }
  
  const timestamp = formatTimestamp(originalResult.blockTimestamp);
  
  // 格式化符号显示
  const displaySymbol = formatSymbol(symbol);
  
  return <TransactionItemWrapper
    key={originalResult.transactionHash}
    onClick={handleClick}
  >
    <ItemLeft>
      <IconWrapper>
        <IconBase className={`icon-${icon}`} />
      </IconWrapper>
      <TypeInfo>
        <span className="type-info-top">
          <span>
            <span>{type}</span>
            {displaySymbol && <span>{displaySymbol}</span>}
          </span>
          <span>{CHAIN_INFO[data.chain].chainName}</span>
        </span>
        <span className="status-info">
          {showPending ? <Pending /> : status}
        </span>
      </TypeInfo>
    </ItemLeft>
    <ItemRight>
      {amount !== '--' && <span className="tx-amount">
        <span>{prefix}{amount}</span>
        {displaySymbol && <span>{displaySymbol}</span>}
      </span>}
      <span className="tx-time">{timestamp}</span>
    </ItemRight>
  </TransactionItemWrapper>
}
