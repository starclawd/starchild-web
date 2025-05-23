import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SolanaWalletHistoryDataType, SolanaWalletOriginalHistoryDataType, SolanaWalletTransactionDetailDataType } from 'store/portfolio/portfolio.d'
import styled from 'styled-components'
import { format } from 'date-fns'
import { getExplorerLink } from 'utils'
import { goOutPageDirect } from 'utils/url'
import { CHAIN_INFO } from 'constants/chainInfo'
import { rotate } from 'styles/animationStyled'
import { useTheme } from 'store/themecache/hooks'
import { useGetSolanaTransactionDetail } from 'store/portfolio/hooks'
import Pending from 'components/Pending'
import { useUserInfo } from 'store/login/hooks'
import { add, div } from 'utils/calc'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

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
  background-color: ${({ theme }) => theme.text20};
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
  const [{ solanaAddress }] = useUserInfo()
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const [solanaTransactionDetail, setSolanaTransactionDetail] = useState<SolanaWalletTransactionDetailDataType | null>(null)
  const triggerGetSolanaTransactionDetail = useGetSolanaTransactionDetail()
  const theme = useTheme()
  const handleClose = useCallback(() => {
    hideTxDetail()
  }, [hideTxDetail])

  const { chain, originalResult } = data
  const { tx_hash } = originalResult

  // 获取交易类型和状态信息
  const txInfo = useMemo(() => {
    // 初始化默认值
    let txType = 'Transaction';
    const txStatus = 'Completed';
    const txStatusClass = ''; // 状态CSS类名
    const txIcon = 'chat-complete'; // 成功图标
    let txAmount = '0';
    let txSymbol = 'SOL';
    let txPrefix = '';
    const hasValidAmount = true; // 是否有有效的金额
    // Swap交易相关
    let sourceSymbol = '';
    let targetSymbol = '';

    if (!solanaTransactionDetail) return {
      txType,
      txStatus,
      txStatusClass,
      txIcon,
      txAmount,
      txSymbol,
      txPrefix,
      hasValidAmount,
      sourceSymbol,
      targetSymbol
    }
    const { data: detailData, metadata } = solanaTransactionDetail

    // 首先检查是否有聚合Swap操作（AGG_TOKEN_SWAP活动）
    const hasAggTokenSwap = detailData.activities && detailData.activities.some(
      activity => activity.activity_type === 'ACTIVITY_AGG_TOKEN_SWAP'
    );

    if (hasAggTokenSwap && detailData.summaries && detailData.summaries.length > 0) {
      // 对于聚合Swap，我们应该直接从summaries获取源代币和目标代币信息
      const swapSummary = detailData.summaries.find(summary => 
        summary.title && summary.title.activity_type === 'ACTIVITY_AGG_TOKEN_SWAP'
      );
      
      if (swapSummary && swapSummary.title && swapSummary.title.data) {
        txType = 'Swap';
        const swapData = swapSummary.title.data;
        
        // 获取源代币信息（token_1）
        if (swapData.token_1 === 'So11111111111111111111111111111111111111112') {
          sourceSymbol = 'SOL';
        } else if (metadata && metadata.tokens && metadata.tokens[swapData.token_1]) {
          sourceSymbol = metadata.tokens[swapData.token_1].token_symbol;
        } else {
          sourceSymbol = 'Unknown';
        }
        
        // 获取目标代币信息（token_2）
        if (swapData.token_2 === 'So11111111111111111111111111111111111111112') {
          targetSymbol = 'SOL';
        } else if (metadata && metadata.tokens && metadata.tokens[swapData.token_2]) {
          targetSymbol = metadata.tokens[swapData.token_2].token_symbol;
        } else {
          targetSymbol = 'Unknown';
        }
        
        // 设置金额为源代币的金额
        if (swapData.amount_1 && swapData.token_decimal_1) {
          txAmount = div(swapData.amount_1, Math.pow(10, swapData.token_decimal_1));
        }
        
        // 设置显示的symbol格式为 sourceSymbol → targetSymbol
        txSymbol = sourceSymbol && targetSymbol ? `${sourceSymbol} → ${targetSymbol}` : 'Swap';
        
        return {
          txType,
          txStatus,
          txStatusClass,
          txIcon,
          txAmount,
          txSymbol,
          txPrefix,
          hasValidAmount,
          sourceSymbol,
          targetSymbol
        };
      }
    }

    // 分析交易类型
    if (detailData.transfers && detailData.transfers.length > 0) {
      // 判断是否为转账交易
      const transfers = detailData.transfers;
      
      // 计算总转出金额
      const totalOutgoing = transfers
        .filter(transfer => transfer.source_owner === solanaAddress)
        .reduce((sum, transfer) => add(sum, div(transfer.amount_str, Math.pow(10, transfer.decimals))), 0);
      
      // 计算总转入金额
      const totalIncoming = transfers
        .filter(transfer => transfer.destination_owner === solanaAddress)
        .reduce((sum, transfer) => add(sum, div(transfer.amount_str, Math.pow(10, transfer.decimals))), 0);
      
      // 判断交易类型
      if (totalOutgoing > 0 && totalIncoming > 0) {
        txType = 'Swap';
        // 获取Swap的转出代币信息
        const outgoingTransfers = transfers.filter(transfer => transfer.source_owner === solanaAddress);
        if (outgoingTransfers.length > 0) {
          const outTransfer = outgoingTransfers[0];
          // 检查是否为SOL
          if (outTransfer.token_address === 'So11111111111111111111111111111111111111111') {
            sourceSymbol = 'SOL';
          } else if (metadata && metadata.tokens && metadata.tokens[outTransfer.token_address]) {
            // 通过metadata获取symbol
            sourceSymbol = metadata.tokens[outTransfer.token_address].token_symbol;
          } else {
            sourceSymbol = 'Unknown';
          }
          txAmount = div(outTransfer.amount_str, Math.pow(10, outTransfer.decimals));
        }
        
        // 获取Swap的转入代币信息
        const incomingTransfers = transfers.filter(transfer => transfer.destination_owner === solanaAddress);
        if (incomingTransfers.length > 0) {
          const inTransfer = incomingTransfers[0];
          // 检查是否为SOL
          if (inTransfer.token_address === 'So11111111111111111111111111111111111111111') {
            targetSymbol = 'SOL';
          } else if (metadata && metadata.tokens && metadata.tokens[inTransfer.token_address]) {
            // 通过metadata获取symbol
            targetSymbol = metadata.tokens[inTransfer.token_address].token_symbol;
          } else {
            targetSymbol = 'Unknown';
          }
        }
        
        // 设置显示的symbol格式为 sourceSymbol → targetSymbol
        txSymbol = sourceSymbol && targetSymbol ? `${sourceSymbol} → ${targetSymbol}` : 'Swap';
      } else if (totalOutgoing > 0) {
        txType = 'Send';
        txAmount = totalOutgoing.toString();
        txPrefix = '-';
        
        // 获取发送的代币符号
        const outgoingTransfers = transfers.filter(transfer => transfer.source_owner === solanaAddress);
        if (outgoingTransfers.length > 0) {
          const outTransfer = outgoingTransfers[0];
          // 检查是否为SOL
          if (outTransfer.token_address === 'So11111111111111111111111111111111111111111') {
            txSymbol = 'SOL';
          } else if (metadata && metadata.tokens && metadata.tokens[outTransfer.token_address]) {
            // 通过metadata获取symbol
            txSymbol = metadata.tokens[outTransfer.token_address].token_symbol;
          } else {
            txSymbol = 'TOKEN';
          }
        }
      } else if (totalIncoming > 0) {
        txType = 'Receive';
        txAmount = totalIncoming.toString();
        txPrefix = '+';
        
        // 获取接收的代币符号
        const incomingTransfers = transfers.filter(transfer => transfer.destination_owner === solanaAddress);
        if (incomingTransfers.length > 0) {
          const inTransfer = incomingTransfers[0];
          // 检查是否为SOL
          if (inTransfer.token_address === 'So11111111111111111111111111111111111111111') {
            txSymbol = 'SOL';
          } else if (metadata && metadata.tokens && metadata.tokens[inTransfer.token_address]) {
            // 通过metadata获取symbol
            txSymbol = metadata.tokens[inTransfer.token_address].token_symbol;
          } else {
            txSymbol = 'TOKEN';
          }
        }
      } else {
        // 如果没有明确的转入转出，则默认显示第一笔转账的金额
        const firstTransfer = transfers[0];
        txAmount = div(firstTransfer.amount_str, Math.pow(10, firstTransfer.decimals))
        
        // 检查代币类型
        if (firstTransfer.token_address && firstTransfer.token_address !== 'So11111111111111111111111111111111111111111') {
          // 从metadata获取symbol
          if (metadata && metadata.tokens && metadata.tokens[firstTransfer.token_address]) {
            txSymbol = metadata.tokens[firstTransfer.token_address].token_symbol;
          } else {
            txSymbol = 'TOKEN';
          }
        }
      }
    } else if (detailData.activities && detailData.activities.length > 0) {
      // 根据activities判断交易类型
      const activityTypes = detailData.activities.map(activity => activity.activity_type);
      
      if (activityTypes.some(type => type.includes('COMPUTE'))) {
        txType = 'Contract Interaction';
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
      hasValidAmount,
      sourceSymbol,
      targetSymbol
    };
  }, [solanaTransactionDetail, solanaAddress]);

  // 格式化地址
  const formatAddress = (address: string) => {
    if (!address) return '';
    return address;
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: string | number) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      return String(timestamp);
    }
  };

  const goHashPage = useCallback((hashLink: string) => {
    return () => {
      goOutPageDirect(hashLink)
    }
  }, [])

  // 构建交易详情数据列表
  const dataList = useMemo(() => {
    if (!solanaTransactionDetail) return [];
    const { data: detailData } = solanaTransactionDetail
    // 从原始交易记录中获取哈希值
    const hash = tx_hash;
    const hashLink = getExplorerLink(chain, hash);
    
    // 找出交易涉及的地址
    let fromAddress = '';
    let toAddress = '';
    
    if (detailData.transfers && detailData.transfers.length > 0) {
      const firstTransfer = detailData.transfers[0];
      
      // 对于转账交易，识别发送方和接收方
      if (firstTransfer.source_owner === solanaAddress) {
        // 用户是发送方
        fromAddress = solanaAddress;
        toAddress = firstTransfer.destination_owner;
      } else if (firstTransfer.destination_owner === solanaAddress) {
        // 用户是接收方
        fromAddress = firstTransfer.source_owner;
        toAddress = solanaAddress;
      } else {
        // 用户不直接参与转账，使用默认的发送方和接收方
        fromAddress = firstTransfer.source_owner;
        toAddress = firstTransfer.destination_owner;
      }
    }

    return [
      {
        key: 'fee',
        list: [
          {
            key: 'Miner Fee',
            title: <Trans>Network Fee</Trans>,
            value: <FeeValue>
              <span>-{solanaTransactionDetail.data.fee / 1000000000}</span>
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
            value: formatAddress(fromAddress),
          },
          {
            key: 'To',
            title: <Trans>To</Trans>,
            value: formatAddress(toAddress),
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
                <span>{hash}</span>
                <DetailButton onClick={goHashPage(hashLink)}><Trans>See details</Trans></DetailButton>
              </Left>
              <QRCodeSVG size={60} value={hashLink} bgColor={theme.bgL1} fgColor={theme.white} />
            </HashWrapper>,
          },
          {
            key: 'Time',
            title: <Trans>Time</Trans>,
            value: <TimeWrapper>
              {formatTimestamp(solanaTransactionDetail.data.block_time ? solanaTransactionDetail.data.block_time * 1000 : solanaTransactionDetail.data.time)}
            </TimeWrapper>,
          }
        ]
      }
    ]
  }, [solanaTransactionDetail, chain, theme, tx_hash, solanaAddress, goHashPage]);

  useEffect(() => {
    triggerGetSolanaTransactionDetail({
      txHash: tx_hash
    }).then((res: any) => {
      setSolanaTransactionDetail(res.data)
    }).catch((err: any) => {
      console.log('err', err)
    })
  }, [tx_hash, triggerGetSolanaTransactionDetail])

  if (!solanaTransactionDetail) {
    return <TransactionDetailWrapper ref={scrollRef} className="scroll-style">
      <Pending isFetching />
    </TransactionDetailWrapper>
  }

  return <TransactionDetailWrapper ref={scrollRef} className="scroll-style">
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
