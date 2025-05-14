import { IconBase } from 'components/Icons'
import { useCallback } from 'react'
import { EvmWalletOriginalHistoryDataType, WalletHistoryDataType } from 'store/portfolio/portfolio.d'
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
const getTransactionTypeInfo = (data: EvmWalletOriginalHistoryDataType) => {
  // 初始化变量存储最终返回的数据
  let type = '';
  let symbol = '';
  let amount = '';
  let prefix = '';
  let icon = 'send'; // 默认图标

  // 根据method_label判断icon
  if (data.method_label) {
    const methodLabel = data.method_label.toLowerCase();
    
    // 根据method_label设置icon
    if (methodLabel === 'approve' || methodLabel === 'permit') {
      icon = 'approve';
    } else if (methodLabel === 'swap' || methodLabel === 'multi-hop swap' || methodLabel === 'limit order') {
      icon = 'chat-switch';
    } else if (methodLabel === 'add liquidity' || methodLabel === 'remove liquidity' || 
               methodLabel === 'zap in' || methodLabel === 'zap out') {
      icon = 'liquidity';
    } else if (methodLabel === 'stake' || methodLabel === 'unstake') {
      icon = 'stake';
    }
    
    // 使用method_label作为type
    type = data.method_label;
  }

  // 处理特殊摘要信息
  if (data.summary === 'Signed a transaction') {
    type = 'Signed a transaction';
    icon = 'approve'; // 使用approve图标表示签名操作
    // 签名交易通常不涉及具体金额和代币
    symbol = '';
    amount = '--';
    prefix = '';
    return { type, symbol, amount, prefix, icon };
  }

  // 失败交易特殊处理
  if (data.receipt_status === '0') {
    // 如果是失败的交易，但有具体转账信息，会走到下面的判断中
    // 如果是失败交易且没有具体转账信息，则使用默认值
    if ((!data.erc20_transfers || data.erc20_transfers.length === 0) && 
        (!data.nft_transfers || data.nft_transfers.length === 0) && 
        (!data.native_transfers || data.native_transfers.length === 0)) {
      
      if (!type) {
        type = data.category || 'Transaction';
      }
      
      // 失败交易没有明确金额和符号时，使用空值
      symbol = '';
      amount = '--';
      prefix = '';
      
      return { type, symbol, amount, prefix, icon };
    }
  }

  // 判断交易类型
  // 检查是否有ERC20代币转账
  if (data.erc20_transfers && data.erc20_transfers.length > 0) {
    const erc20Transfer = data.erc20_transfers[0];
    const isReceive = erc20Transfer.direction === 'receive';
    
    // 如果没有method_label才设置type
    if (!type) {
      type = isReceive ? 'Receive' : 'Send';
    }
    
    // 无论有没有method_label，都设置这些信息
    symbol = erc20Transfer.token_symbol;
    amount = erc20Transfer.value_formatted;
    prefix = isReceive ? '+' : '-';
    
    // 如果没有基于method_label设置icon，则基于direction设置
    if (icon === 'send' && !data.method_label) {
      icon = isReceive ? 'receive' : 'send';
    }
    
    return { type, symbol, amount, prefix, icon };
  }
  
  // 检查是否有NFT转账
  if (data.nft_transfers && data.nft_transfers.length > 0) {
    const nftTransfer = data.nft_transfers[0];
    const isReceive = nftTransfer.direction === 'receive';
    
    // 如果没有method_label才设置type
    if (!type) {
      type = isReceive ? 'Receive NFT' : 'Send NFT';
    }
    
    symbol = 'NFT';
    amount = nftTransfer.amount || '1';
    prefix = isReceive ? '+' : '-';
    
    // 如果没有基于method_label设置icon，则基于direction设置
    if (icon === 'send' && !data.method_label) {
      icon = isReceive ? 'receive' : 'send';
    }
    
    return { type, symbol, amount, prefix, icon };
  }
  
  // 检查是否有原生代币转账
  if (data.native_transfers && data.native_transfers.length > 0) {
    const nativeTransfer = data.native_transfers[0];
    const isReceive = nativeTransfer.direction === 'in' || nativeTransfer.direction === 'receive';
    
    // 如果没有method_label才设置type
    if (!type) {
      type = isReceive ? 'Receive' : 'Send';
    }
    
    symbol = nativeTransfer.token_symbol || 'ETH';
    amount = nativeTransfer.value_formatted;
    prefix = isReceive ? '+' : '-';
    
    // 如果没有基于method_label设置icon，则基于direction设置
    if (icon === 'send' && !data.method_label) {
      icon = isReceive ? 'receive' : 'send';
    }
    
    return { type, symbol, amount, prefix, icon };
  }
  
  // 根据category判断
  if (data.category === 'airdrop') {
    // 如果没有method_label才设置type
    if (!type) {
      type = 'Airdrop';
    }
    
    symbol = 'NFT';
    amount = '1';
    prefix = '+';
    
    // 如果没有基于method_label设置icon
    if (icon === 'send' && !data.method_label) {
      icon = 'receive';
    }
    
    return { type, symbol, amount, prefix, icon };
  }

  // 处理合约交互类型
  if (data.category === 'contract interaction') {
    if (!type) {
      type = 'Contract';
    }
    icon = 'approve'; // 使用approve图标表示合约交互
    // 合约交互如果没有转账信息，通常不显示具体金额
    symbol = '';
    amount = '--';
    prefix = '';
    
    return { type, symbol, amount, prefix, icon };
  }
  
  // 默认情况
  if (!type) {
    type = data.category || 'Transaction';
  }
  
  // 修改默认值获取逻辑，避免从 summary 中解析错误数据
  if (data.summary && data.summary.split(' ').length > 2 && data.summary !== 'Signed a transaction') {
    amount = data.summary.split(' ')[1] || '--';
    symbol = data.summary.split(' ')[2] || '';
  } else {
    amount = '--';
    symbol = '';
  }
  
  prefix = data.category?.includes('receive') ? '+' : '';
  
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

export default function TransactionItem({
  data,
  onClick
}: {
  data: WalletHistoryDataType
  onClick: (data: WalletHistoryDataType) => void
}) {
  const { originalResult } = data
  const handleClick = useCallback(() => {
    onClick(data)
  }, [onClick, data])
  
  const { type, symbol, amount, prefix, icon } = getTransactionTypeInfo(originalResult);
  
  // 确定交易状态
  let status;
  let showPending = false;
  
  if (originalResult.receipt_status === '1') {
    status = 'Confirmed';
  } else if (originalResult.receipt_status === '0') {
    status = 'Failed';
  } else {
    status = 'Pending';
    showPending = true;
  }
  
  const timestamp = formatTimestamp(originalResult.block_timestamp);
  
  // 获取交易对方地址
  // let counterpartyAddress = '';
  // if (data.category === 'token receive' || data.category === 'airdrop') {
  //   if (data.erc20_transfers && data.erc20_transfers.length > 0) {
  //     counterpartyAddress = formatAddress(data.erc20_transfers[0].from_address);
  //   } else if (data.nft_transfers && data.nft_transfers.length > 0) {
  //     counterpartyAddress = formatAddress(data.nft_transfers[0].from_address);
  //   } else {
  //     counterpartyAddress = formatAddress(data.from_address);
  //   }
  // } else {
  //   counterpartyAddress = formatAddress(data.to_address);
  // }
  
  // 格式化符号显示
  const displaySymbol = formatSymbol(symbol);
  
  return <TransactionItemWrapper
    key={originalResult.hash}
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
