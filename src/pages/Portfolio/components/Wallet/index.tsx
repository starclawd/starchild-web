import { Trans } from '@lingui/react/macro'
import Avatar from 'boring-avatars'
import { IconBase } from 'components/Icons'
import Table from 'components/Table'
import { ANI_DURATION } from 'constants/index'
import { useEffect, useMemo, useState } from 'react'
import { Chain } from 'constants/chainInfo'
import styled from 'styled-components'
import { getTokenImg } from 'utils'
import { useWindowSize } from 'hooks/useWindowSize'
import { useGetWalletNetWorth, useNetWorthList } from 'store/portfolio/hooks'
import TransitionWrapper from 'components/TransitionWrapper'

const WalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0;
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
      color: #000;
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
      color: #000;
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
      color: #000;
    }
  }
`

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`

const TabList = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 20px 8px;
  gap: 8px;
`

const TabItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 16px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ $active, theme }) => $active ? '#335FFC' : 'transparent'};
  cursor: pointer;
  transition: background-color ${ANI_DURATION}s;
`

const TableWrapper = styled.div<{ $isShowPanel: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 20px;
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

export default function Wallet() {
  const { width } = useWindowSize()
  const [netWorthList] = useNetWorthList()
  const triggerGetWalletNetWorth = useGetWalletNetWorth()
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
    },
    {
      key: Chain.ETHEREUM,
      text: 'Ethereum',
      value: Chain.ETHEREUM,
    },
    {
      key: Chain.SOLANA,
      text: 'Solana',
      value: Chain.SOLANA,
    },
    {
      key: Chain.ARBITRUM,
      text: 'Arbitrum',
      value: Chain.ARBITRUM,
    },
    {
      key: Chain.BASE,
      text: 'Base',
      value: Chain.BASE,
    },
  ], [])
  
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
        return <AssetsWrapper>
          <span>
            <img src={getTokenImg('ETH')} alt="" />
          </span>
          <span>ETH</span>
          <span>Ethereum</span>
        </AssetsWrapper>
      }
    },
    {
      key: 'price',
      title: <Trans>Price</Trans>,
    },
    {
      key: 'amount',
      title: <Trans>Amount</Trans>,
    },
    {
      key: 'usd_value',
      title: <Trans>USD Value</Trans>,
    },
    {
      key: '24h_change',
      title: <Trans>24h change</Trans>,
      width: '80px',
    },
  ], [])
  
  const tokenData = useMemo(() => {
    return [
      {
        assets: '',
        price: '$1,820.30',
        amount: '65',
        usd_value: '65',
        '24h_change': '+5.27%',
      },
    ]
  }, [])
  
  useEffect(() => {
    triggerGetWalletNetWorth({
      evmAddress: '0x59bB31474352724583bEB030210c7B96E9D0d8e9',
      chains: [Chain.ETHEREUM, Chain.BSC, Chain.ARBITRUM, Chain.BASE],
    })
  }, [triggerGetWalletNetWorth])
  
  return <WalletWrapper>
    <TopContent>
      <WalletTitle>
        <span>
          <Avatar name="John Doe" size={44} />
          <span><Trans>My wallet</Trans></span>
        </span>
        <span>
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
      <TabList>
        {tabList.map((item) => {
          const { key, text, value } = item
          return <TabItem
            key={key}
            $active={currentChain === value}
            onClick={() => setCurrentChain(value)}
          >
            <span>{text}</span>
          </TabItem>
        })}
      </TabList>
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
        <Table
          key={width}
          data={tokenData}
          columns={columns}
          emptyText=""
        />
      </TableWrapper>
    </BottomContent>
  </WalletWrapper>
}
