import styled from 'styled-components'
import { AllStrategiesOverview } from 'store/vaults/vaults'
import { IconBase } from 'components/Icons'
import { useGetStrategyIconName, useVaultByVaultId } from 'store/vaults/hooks'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import VaultData from '../VaultData'
import Signal from '../Signal'
import ConfigInfo from '../ConfigInfo'
import { ANI_DURATION } from 'constants/index'

const VaultCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc((100% - 24px) / 3);
  height: 100%;
  gap: 2px;
  cursor: pointer;
  &:hover {
    .top-content::before {
      opacity: 1;
    }
    .bottom-content {
      background-color: ${({ theme }) => theme.brand100};
      i {
        color: ${({ theme }) => theme.black700};
      }
      .config-info-item {
        span {
          color: ${({ theme }) => theme.black1000};
        }
        .network-icon {
          border-color: ${({ theme }) => theme.brand100};
        }
      }
    }
  }
`

const TopContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 310px;
  padding: 16px;
  border-radius: 8px 8px 0 0;
  background-color: ${({ theme }) => theme.black700};
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, #3c3e41 0%, #232527 100%);
    opacity: 0;
    transition: opacity ${ANI_DURATION}s;
    pointer-events: none;
  }
  & > * {
    position: relative;
    z-index: 1;
  }
  .icon-strategy1,
  .icon-strategy2,
  .icon-strategy3 {
    position: absolute;
    font-size: 80px;
    top: 8px;
    right: 8px;
    color: ${({ theme }) => theme.text10};
  }
`

const VaultBaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 82px;
  gap: 8px;
`

const VaultName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textDark98};
`

const VaultBuilder = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textDark54};
  img {
    width: 18px;
    height: 18px;
  }
`

const BottomContent = styled.div`
  display: flex;
  width: 100%;
  height: 34px;
  padding: 8px 12px;
  border-radius: 0 0 8px 8px;
  transition: background-color ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.black800};
  i {
    transition: color ${ANI_DURATION}s;
  }
`

export default function VaultCard({ strategy }: { strategy: AllStrategiesOverview }) {
  const { strategyId, vaultId, strategyName, userInfo } = strategy
  const vaultData = useVaultByVaultId(vaultId)
  const strategyIconNameMapping = useGetStrategyIconName()
  const [, setCurrentRouter] = useCurrentRouter()
  const handleViewVault = (vaultId: string) => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vaultId}`)
  }
  return (
    <VaultCardWrapper key={strategyId} onClick={() => handleViewVault(vaultId)}>
      <TopContent className='top-content'>
        <IconBase className={strategyIconNameMapping[vaultId]} />
        <VaultBaseInfo>
          <VaultName>{strategyName || '--'}</VaultName>
          <VaultBuilder>
            {userInfo?.userAvatar && <img src={userInfo?.userAvatar || ''} alt='' />}
            <span>{userInfo?.userName || '--'}</span>
          </VaultBuilder>
        </VaultBaseInfo>
        <VaultData strategy={strategy} />
        <Signal />
      </TopContent>
      <BottomContent className='bottom-content'>{vaultData && <ConfigInfo vaultData={vaultData} />}</BottomContent>
    </VaultCardWrapper>
  )
}
