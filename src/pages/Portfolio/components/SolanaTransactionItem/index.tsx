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
  let icon = 'send'; // 默认图标

  // 从 parsed_instructions 中获取类型信息
  if (data.parsed_instructions && data.parsed_instructions.length > 0) {
    const instruction = data.parsed_instructions[0];
    type = instruction.type || 'Transaction';
    
    // 根据交易类型设置图标
    if (type.toLowerCase() === 'transfer') {
      icon = 'send';
    } else if (type.toLowerCase() === 'swap') {
      icon = 'chat-switch';
    } else if (type.toLowerCase().includes('liquidity')) {
      icon = 'liquidity';
    } else if (type.toLowerCase().includes('stake')) {
      icon = 'stake';
    } else if (type.toLowerCase() === 'airdrop') {
      icon = 'receive';
    }
  } else if (data.transactionType) {
    // 兼容旧数据结构
    const txType = data.transactionType.toLowerCase();
    
    if (txType === 'swap') {
      icon = 'chat-switch';
      type = 'Swap';
    } else if (txType === 'transfer') {
      icon = 'send';
      type = 'Transfer';
    } else if (txType === 'liquidity') {
      icon = 'liquidity';
      type = data.subCategory && data.subCategory.includes('remove') ? 'Remove Liquidity' : 'Add Liquidity';
    } else if (txType === 'stake' || txType === 'unstake') {
      icon = 'stake';
      type = txType === 'stake' ? 'Stake' : 'Unstake';
    } else if (txType === 'airdrop') {
      icon = 'receive';
      type = 'Airdrop';
    } else {
      type = data.transactionType;
    }
  }

  // 如果没有得到合适的类型
  if (!type) {
    type = 'Transaction';
  }

  return { type, icon };
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
  const { chain, originalResult } = data
  const handleClick = useCallback(() => {
    onClick(data)
  }, [onClick, data])
  
  const { type, icon } = getTransactionTypeInfo(originalResult);
  
  // 确定交易状态
  let status;
  let showPending = false;
  
  if (originalResult.status && originalResult.status.toLowerCase() === 'success') {
    status = 'Confirmed';
  } else {
    status = 'Pending';
    showPending = true;
  }
  
  // 使用新的时间属性
  const timestamp = originalResult.time 
    ? formatTimestamp(originalResult.time)
    : '';
  
  // 首字母大写显示类型
  const displayType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  
  return <TransactionItemWrapper
    key={originalResult.tx_hash || ''}
    onClick={handleClick}
  >
    <ItemLeft>
      <IconWrapper>
        <IconBase className={`icon-${icon}`} />
      </IconWrapper>
      <TypeInfo>
        <span className="type-info-top">
          <span>
            <span>{displayType}</span>
          </span>
          <span>{CHAIN_INFO[data.chain].chainName}</span>
        </span>
        <span className="status-info">
          {showPending ? <Pending /> : status}
        </span>
      </TypeInfo>
    </ItemLeft>
    <ItemRight>
      <span className="tx-time">{timestamp}</span>
    </ItemRight>
  </TransactionItemWrapper>
}
