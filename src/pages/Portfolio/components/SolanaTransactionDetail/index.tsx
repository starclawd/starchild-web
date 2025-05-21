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
    let txStatus = 'Completed';
    let txStatusClass = ''; // 状态CSS类名
    let txIcon = 'chat-complete'; // 成功图标
    let txAmount = '0';
    let txSymbol = 'SOL';
    let txPrefix = '';
    let hasValidAmount = true; // 是否有有效的金额

    if (!solanaTransactionDetail) return {
      txType,
      txStatus,
      txStatusClass,
      txIcon,
      txAmount,
      txSymbol,
      txPrefix,
      hasValidAmount
    }
    const { data: detailData, metadata } = solanaTransactionDetail

    // 判断交易状态 - 使用solanaTransactionDetail中的tx_status
    if (detailData.tx_status === 'success') {
      txStatus = 'Successful';
    } else if (detailData.tx_status === 'pending') {
      txStatus = 'Pending';
      txStatusClass = 'pending';
      txIcon = 'loading';
    } else if (detailData.tx_status === 'failed') {
      txStatus = 'Failed';
      txStatusClass = 'failed';
      txIcon = 'chat-close';
    }

    // 从parsed_instructions中提取交易类型
    const programTypes = detailData.parsed_instructions.map(
      instruction => instruction.parsed_type.toLowerCase()
    );

    // 根据交易信息确定类型
    if (programTypes.includes('swap')) {
      txType = 'Swap';
    } else if (programTypes.includes('transfer')) {
      // 检查是转入还是转出
      const isIncoming = detailData.sol_bal_change.some(
        change => parseFloat(change.change_amount) > 0
      );
      txType = isIncoming ? 'Receive' : 'Send';
    } else if (programTypes.includes('liquidity')) {
      // 检查是添加还是移除流动性
      const isRemove = programTypes.some(type => type.includes('remove'));
      txType = isRemove ? 'Remove Liquidity' : 'Add Liquidity';
    } else {
      // 默认使用第一个指令类型
      txType = detailData.parsed_instructions[0]?.parsed_type || 'Transaction';
    }

    // 处理代币金额信息，从sol_bal_change和token_bal_change中提取
    const solChange = detailData.sol_bal_change.find(
      change => Math.abs(parseFloat(change.change_amount)) > 0
    );
    
    const tokenChange = detailData.token_bal_change[0];
    
    if (solChange) {
      txAmount = Math.abs(parseFloat(solChange.change_amount)).toString();
      txSymbol = 'SOL';
      txPrefix = parseFloat(solChange.change_amount) > 0 ? '+' : '-';
    } else if (tokenChange) {
      const amount = typeof tokenChange.change_amount === 'string' 
        ? parseFloat(tokenChange.change_amount) 
        : tokenChange.change_amount;
      
      txAmount = Math.abs(amount).toString();
      
      // 获取代币符号，简化处理
      const tokenSymbol = 'TOKEN'; // 实际环境中应从token_address或其他数据获取
      txSymbol = tokenSymbol;
      
      txPrefix = amount > 0 ? '+' : '-';
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
  }, [solanaTransactionDetail]);

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
    
    // 从原始交易记录中获取哈希值
    const hash = tx_hash; // 使用传入的原始交易记录中的tx_hash
    const hashLink = getExplorerLink(chain, hash)
    
    // 找出交易涉及的地址
    let fromAddress = '';
    let toAddress = '';
    
    // 分析交易指令以确定发送方和接收方
    const transferInstructions = solanaTransactionDetail.data.parsed_instructions.filter(
      instruction => instruction.parsed_type.toLowerCase() === 'transfer'
    );
    
    if (transferInstructions.length > 0) {
      // 对于转账交易，通常第一个账户是发送方，第二个账户是接收方
      const transferInstruction = transferInstructions[0];
      
      // 如果用户地址是发送方
      if (transferInstruction.accounts[0] === solanaAddress) {
        fromAddress = solanaAddress;
        toAddress = transferInstruction.accounts[1] || '';
      } 
      // 如果用户地址是接收方
      else if (transferInstruction.accounts[1] === solanaAddress) {
        fromAddress = transferInstruction.accounts[0] || '';
        toAddress = solanaAddress;
      }
      // 如果用户地址不直接参与，使用默认的发送方和接收方
      else {
        fromAddress = transferInstruction.accounts[0] || '';
        toAddress = transferInstruction.accounts[1] || '';
      }
    } 
    // 如果没有找到转账指令，尝试查找任何包含用户地址的指令
    else {
      const userInstruction = solanaTransactionDetail.data.parsed_instructions.find(
        instruction => instruction.accounts.includes(solanaAddress)
      );
      
      if (userInstruction) {
        // 找到包含用户地址的指令中的其他地址作为交互方
        const accountIndex = userInstruction.accounts.indexOf(solanaAddress);
        if (accountIndex === 0 && userInstruction.accounts.length > 1) {
          fromAddress = solanaAddress;
          toAddress = userInstruction.accounts[1];
        } else if (accountIndex > 0) {
          fromAddress = userInstruction.accounts[0];
          toAddress = solanaAddress;
        } else {
          // 只有用户一个地址的情况
          fromAddress = solanaAddress;
          toAddress = '自身交易';
        }
      } else {
        // 回退到默认行为：使用第一条指令的前两个账户
        fromAddress = solanaTransactionDetail.data.parsed_instructions[0]?.accounts[0] || '';
        toAddress = solanaTransactionDetail.data.parsed_instructions[0]?.accounts[1] || '';
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
              <span>-{solanaTransactionDetail.data.fee}</span>
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
              {formatTimestamp(originalResult.block_time ? originalResult.block_time * 1000 : originalResult.time)}
            </TimeWrapper>,
          }
        ]
      }
    ]
  }, [solanaTransactionDetail, chain, theme, originalResult.block_time, originalResult.time, tx_hash, solanaAddress, goHashPage]);

  useEffect(() => {
    triggerGetSolanaTransactionDetail({
      txHash: tx_hash
    }).then((res: any) => {
      const result = JSON.parse(res.data)
      setSolanaTransactionDetail(result)
    }).catch((err: any) => {
      console.log('err', err)
    })
  }, [tx_hash, triggerGetSolanaTransactionDetail])

  if (!solanaTransactionDetail) {
    return <TransactionDetailWrapper className="scroll-style">
      <Pending isFetching />
    </TransactionDetailWrapper>
  }

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
