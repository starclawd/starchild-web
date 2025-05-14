import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { IconBase } from 'components/Icons'
import Table from 'components/Table'
import { ANI_DURATION } from 'constants/index'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Chain, CHAIN_INFO } from 'constants/chainInfo'
import styled from 'styled-components'
import { useAllNetworkWalletTokens, useGetAllNetworkWalletTokens, useGetWalletNetWorth, useNetWorthList } from 'store/portfolio/hooks'
import TransitionWrapper from 'components/TransitionWrapper'
import TabList from 'components/TabList'
import NoData from 'components/NoData'
import { useIsLogout, useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'
import copy from 'copy-to-clipboard'
import { useTheme } from 'store/themecache/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'

const WalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0 0;
  gap: 8px;
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 190px;
  padding: 20px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.jade10};
  
`

const WalletTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    span {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: ${({ theme }) => theme.black};
    }
  }
  > span:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.lineLight8};
    cursor: pointer;
    .icon-chat-copy {
      font-size: 24px;
      color: ${({ theme }) => theme.black};
    }
  }
` 

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  > span:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    span {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.54);
    }
    .icon-eye {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.54);
    }
  }
  > span:last-child {
    display: flex;
    align-items: flex-start;
    span:first-child {
      padding-top: 7px;
      font-size: 26px;
      font-weight: 700;
      line-height: 34px;
      color: rgba(0, 0, 0, 0.36);
    }
    span:last-child {
      font-size: 48px;
      font-weight: 700;
      line-height: 58px;
      color: ${({ theme }) => theme.black};
    }
  }
`

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow: hidden;
`

const TableWrapper = styled.div<{ $isShowPanel: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 20px 20px 0;
  gap: 20px;
  ${({ $isShowPanel }) => !$isShowPanel && `
    gap: 0;
  `}
`

const BalancePanel = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`

const BalanceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 50%;
  height: 62px;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgT20};
  .title {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  .value {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
`

const BalanceValue = styled.div`
  display: flex;
  align-items: center;
  span:first-child {
    color: ${({ theme }) => theme.textL4};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL1};
  }
`

const ProportionValue = styled.div`
  display: flex;
  align-items: center;
  span:first-child {
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL4};
  }
`

const AssetsWrapper = styled.div`
  display: flex;
  align-items: center;
  > span:first-child {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    margin-right: 8px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  > span:nth-child(2) {
    margin-right: 4px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    padding: 0 6px;
    font-size: 10px;
    font-weight: 500;
    line-height: 14px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.textL6};
    color: ${({ theme }) => theme.textL2};
  }
`

const ChainIcon = styled.div`
  position: absolute;
  bottom: 0;
  right: -3px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.bgL0};
`

export default function Wallet() {
  const theme = useTheme()
  const toast = useToast()
  const isLogout = useIsLogout()
  const [{ evmAddress }] = useUserInfo()
  const [netWorthList] = useNetWorthList()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [allNetworkWalletTokens, setAllNetworkWalletTokens] = useAllNetworkWalletTokens()
  const triggerGetWalletNetWorth = useGetWalletNetWorth()
  const triggerGetAllNetworkWalletTokens = useGetAllNetworkWalletTokens()
  const [currentChain, setCurrentChain] = useState<Chain | string>(Chain.ETHEREUM)
  
  // 计算总余额
  const totalNetWorth = useMemo(() => {
    if (!netWorthList || netWorthList.length === 0) return 0
    return netWorthList.reduce((acc, item) => acc + Number(item.networth_usd), 0)
  }, [netWorthList])
  
  const tabList = useMemo(() => [
    {
      key: 'ALL',
      text: 'All networks',
      value: 'ALL',
      isActive: currentChain === 'ALL',
      clickCallback: () => setCurrentChain('ALL'),
    },
    {
      key: Chain.ETHEREUM,
      text: 'Ethereum',
      value: Chain.ETHEREUM,
      isActive: currentChain === Chain.ETHEREUM,
      clickCallback: () => setCurrentChain(Chain.ETHEREUM),
    },
    {
      key: Chain.SOLANA,
      text: 'Solana',
      value: Chain.SOLANA,
      isActive: currentChain === Chain.SOLANA,
      clickCallback: () => setCurrentChain(Chain.SOLANA),
    },
    {
      key: Chain.ARBITRUM,
      text: 'Arbitrum',
      value: Chain.ARBITRUM,
      isActive: currentChain === Chain.ARBITRUM,
      clickCallback: () => setCurrentChain(Chain.ARBITRUM),
    },
    {
      key: Chain.BASE,
      text: 'Base',
      value: Chain.BASE,
      isActive: currentChain === Chain.BASE,
      clickCallback: () => setCurrentChain(Chain.BASE),
    },
    {
      key: Chain.BSC,
      text: 'BSC',
      value: Chain.BSC,
      isActive: currentChain === Chain.BSC,
      clickCallback: () => setCurrentChain(Chain.BSC),
    },
  ], [currentChain])
  
  // 根据currentChain动态计算balance和proportion
  const panelList = useMemo(() => {
    let balance = 0
    let proportion = 0
    
    if (currentChain === 'ALL') {
      balance = totalNetWorth
      proportion = 100
    } else {
      const chainData = netWorthList?.find(item => item.chain === currentChain.toLowerCase())
      if (chainData) {
        balance = Number(chainData.networth_usd)
        proportion = totalNetWorth > 0 ? (balance / totalNetWorth) * 100 : 0
      }
    }
    
    return [
      {
        key: 'Balance',
        text: <Trans>Balance</Trans>,
        value: <BalanceValue>
          <span>$</span>
          <span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </BalanceValue>
      },
      {
        key: 'Proportion',
        text: <Trans>Proportion</Trans>,
        value: <ProportionValue>
          <span>{proportion.toFixed(2)}</span>
          <span>%</span>
        </ProportionValue>
      },
    ]
  }, [currentChain, netWorthList, totalNetWorth])
  
  const columns = useMemo(() => [
    {
      key: 'assets',
      title: <Trans>Assets</Trans>,
      width: '200px',
      render: (record: any) => {
        // 获取对应的chain值
        const chain = record.chain;
        
        return <AssetsWrapper>
          <span>
            <img src={record.logo} alt="" />
            <ChainIcon>
              <img src={CHAIN_INFO[chain as keyof typeof CHAIN_INFO]?.icon} alt="" />
            </ChainIcon>
          </span>
          <span>{record.symbol}</span>
          <span>{CHAIN_INFO[chain as keyof typeof CHAIN_INFO]?.chainName}</span>
        </AssetsWrapper>
      }
    },
    {
      key: 'price',
      title: <Trans>Price</Trans>,
      render: (record: any) => {
        // 判断数据类型
        const isSolana = record.chain === Chain.SOLANA;
        // 获取价格
        const price = isSolana ? record.tokenDetail?.usdPrice : record.usd_price;
        
        return `$${Number(price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    },
    {
      key: 'amount',
      title: <Trans>Amount</Trans>,
      render: (record: any) => {
        // 判断数据类型
        const isSolana = record.chain === Chain.SOLANA;
        // 获取余额
        const balance = isSolana ? record.amount : record.balance_formatted;
        
        return Number(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })
      }
    },
    {
      key: 'usd_value',
      title: <Trans>USD Value</Trans>,
      render: (record: any) => {
        // 判断数据类型
        const isSolana = record.chain === Chain.SOLANA;
        // 计算USD价值
        let usdValue = 0;
        if (isSolana) {
          // Solana tokens
          const price = record.tokenDetail?.usdPrice || 0;
          const amount = Number(record.amount || 0);
          usdValue = price * amount;
        } else {
          // EVM tokens
          usdValue = Number(record.usd_value || 0);
        }
        
        return `$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    },
    {
      key: '24h_change',
      title: <Trans>24h change</Trans>,
      width: '80px',
      render: (record: any) => {
        // 判断数据类型
        const isSolana = record.chain === Chain.SOLANA;
        // 获取24小时变化百分比
        const change = isSolana 
          ? record.tokenDetail?.usdPrice24hrPercentChange || 0
          : record.usd_price_24hr_percent_change || 0;
        
        const isPositive = change >= 0;
        return <span style={{ color: isPositive ? '#00C087' : '#FF5252' }}>
          {isPositive ? '+' : ''}{Number(change).toFixed(2)}%
        </span>
      }
    },
  ], [])
  
  const tokenData = useMemo(() => {
    if (!allNetworkWalletTokens || !allNetworkWalletTokens.length) {
      return []
    }

    // 如果选择了特定链，则过滤数据
    if (currentChain !== 'ALL') {
      return allNetworkWalletTokens.filter(token => {
        return token.chain.toLowerCase() === currentChain.toString().toLowerCase();
      });
    }
    
    // 返回所有链的数据
    return allNetworkWalletTokens;
  }, [allNetworkWalletTokens, currentChain])

  const getAllNetworkWalletTokens = useCallback(async () => {
    if (evmAddress) {
      try {
        setIsLoading(true)
        await triggerGetAllNetworkWalletTokens({
          evmAddress,
        })
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }
  }, [triggerGetAllNetworkWalletTokens, evmAddress])

  const copyWalletAddress = useCallback(() => {
    copy(evmAddress)
    toast({
      title: <Trans>Copied</Trans>,
      description: evmAddress,
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-copy',
      iconTheme: theme.textL1,
    })
  }, [evmAddress, toast, theme])

  useEffect(() => {
    if (isLogout) {
      setIsLoading(false)
      setAllNetworkWalletTokens([])
    }
  }, [isLogout, setAllNetworkWalletTokens])
  
  useEffect(() => {
    if (evmAddress) {
      triggerGetWalletNetWorth({
        evmAddress,
        chains: [Chain.ETHEREUM, Chain.ARBITRUM, Chain.BASE, Chain.SOLANA, Chain.BSC],
      })
    }
  }, [triggerGetWalletNetWorth, evmAddress])

  useEffect(() => {
    getAllNetworkWalletTokens()
  }, [getAllNetworkWalletTokens])

  return <WalletWrapper>
    <TopContent>
      <WalletTitle>
        <span>
          <Avatar name={evmAddress} size={44} />
          <span><Trans>My wallet</Trans></span>
        </span>
        <span onClick={copyWalletAddress}>
          <IconBase className="icon-chat-copy" />
        </span>
      </WalletTitle>
      <BalanceWrapper>
        <span>
          <span><Trans>Balance</Trans></span>
          <IconBase className="icon-eye" />
        </span>
        <span>
          <span>$</span>
          <span>{totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </span>
      </BalanceWrapper>
    </TopContent>
    <BottomContent>
      <TabList tabList={tabList} />
      <TableWrapper $isShowPanel={currentChain !== 'ALL'}>
        <TransitionWrapper
          transitionType='height'
          visible={currentChain !== 'ALL'}
        >
          <BalancePanel>
            {panelList.map((item) => {
              const { key, text, value } = item
              return <BalanceItem key={key}>
                <span className="title">{text}</span>
                <span className="value">{value}</span>
              </BalanceItem>
            })}
          </BalancePanel>
        </TransitionWrapper>
        {tokenData.length > 0
          ? <Table
            data={tokenData}
            columns={columns}
            emptyText=""
          />
          : isLoading
            ? <Pending isFetching={true} />
            : <NoData />
        }
      </TableWrapper>
    </BottomContent>
  </WalletWrapper>
}
