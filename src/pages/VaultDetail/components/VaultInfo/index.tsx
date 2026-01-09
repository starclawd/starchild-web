import { memo, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useCurrentVaultId, useActiveTab, useStrategyInfo } from 'store/vaultsdetail/hooks'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import { useAppKitAccount } from '@reown/appkit/react'
import StrategyStatus from './components/StrategyStatus'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'
import PixelCanvas from 'pages/Chat/components/PixelCanvas'
import useParsedQueryString from 'hooks/useParsedQueryString'
import VibeItem from 'pages/VaultDetail/components/VaultInfo/components/VibeItem'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import DepositSection from './components/DepositSection'
import TvfSection from './components/TvfSection'

const VaultInfoContainer = styled.div<{ $vaultId: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-shrink: 0;
  height: 200px;
  ${({ $vaultId }) =>
    $vaultId &&
    css`
      height: 280px;
    `}
`

const InnerContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 100%;
  gap: 40px;
  padding: 40px 40px 20px;
  z-index: 2;
`

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
`

const VaultHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  gap: 20px;
`

const VaultTitle = styled.div`
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 44px;
  color: ${({ theme }) => theme.black0};
`

const ProvideInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black0};
  img {
    width: 18px;
    height: 18px;
    border-radius: 3px;
  }
`

const TabsWrapper = styled.div`
  .tab-list-wrapper {
    height: 48px;
    .move-tab-item {
      padding: 0;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      i {
        font-size: 24px;
      }
    }
  }
`

export default memo(function VaultInfo() {
  const { address } = useAppKitAccount()
  const { strategyId } = useParsedQueryString()
  const [activeTab, setActiveTab] = useActiveTab()
  const vaultId = useCurrentVaultId()
  const { strategyInfo } = useStrategyInfo({ strategyId: strategyId || null })
  const { paperTradingPublicData } = usePaperTradingPublic({ strategyId: strategyId || '' })
  const [vibe, strategyName, userName, userAvatar] = useMemo(() => {
    return [
      strategyInfo?.vibe || '',
      strategyInfo?.strategy_name || '--',
      strategyInfo?.user_info?.user_name || '',
      strategyInfo?.user_info?.user_avatar || '',
    ]
  }, [strategyInfo])
  const tabList = useMemo(
    () => [
      {
        key: DETAIL_TYPE.STRATEGY,
        text: <Trans>Strategy</Trans>,
        icon: <IconBase className='icon-my-strategy' />,
        clickCallback: () => setActiveTab(DETAIL_TYPE.STRATEGY),
      },
      {
        key: DETAIL_TYPE.VAULT,
        text: <Trans>Vaults</Trans>,
        icon: <IconBase className='icon-my-vault' />,
        clickCallback: () => setActiveTab(DETAIL_TYPE.VAULT),
      },
    ],
    [setActiveTab],
  )

  useEffect(() => {
    if (!vaultId) {
      setActiveTab(DETAIL_TYPE.STRATEGY)
    }
  }, [vaultId, setActiveTab])

  return (
    <VaultInfoContainer $vaultId={!!vaultId}>
      <PixelCanvas />
      <InnerContent>
        <LeftWrapper>
          <VaultHeader>
            <HeaderTop>
              <VaultTitle>{strategyName}</VaultTitle>
              <ProvideInfo>
                {userAvatar && <img src={userAvatar} alt='userAvatar' />}
                {userName && <span>{userName}</span>}
              </ProvideInfo>
              <StrategyStatus status={paperTradingPublicData?.status} />
            </HeaderTop>
            <VibeItem vibe={vibe} />
          </VaultHeader>
          {/* 只有当vaultId存在时才显示Tabs */}
          {vaultId && (
            <TabsWrapper>
              <MoveTabList gap={20} tabKey={activeTab} tabList={tabList} moveType={MoveType.LINE} />
            </TabsWrapper>
          )}
        </LeftWrapper>
        {activeTab === DETAIL_TYPE.STRATEGY && <TvfSection />}
        {activeTab === DETAIL_TYPE.VAULT && vaultId && address && <DepositSection />}
      </InnerContent>
    </VaultInfoContainer>
  )
})
