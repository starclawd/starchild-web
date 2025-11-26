import { Trans, useLingui } from '@lingui/react/macro'
import { msg } from '@lingui/core/macro'
import { IconBase } from 'components/Icons'
import { useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { ROUTER } from 'pages/router'
import { useCurrentRouter } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { isMatchCurrentRouter } from 'utils'
import useParsedQueryString from 'hooks/useParsedQueryString'

const VaultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
`

const Item = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  gap: 6px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  transition: background-color ${ANI_DURATION}s;

  &:hover {
    background-color: ${({ theme }) => theme.bgT20};
  }

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
    text-transform: capitalize;
  }
  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      background-color: ${theme.bgT20};
    `}
`

const CreateAgentButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  margin-top: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  position: relative;
  overflow: hidden;

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: ${({ theme }) => theme.brand100};
    border-radius: 4px;

    i {
      font-size: 18px;
      color: ${({ theme }) => theme.black700};
    }
  }

  span {
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.brand100};
    z-index: 1;
  }
`

interface VaultItem {
  id: string
  titleKey: any
  icon: string
  route: string
}

const VAULT_ITEMS: VaultItem[] = [
  {
    id: 'all-vaults',
    titleKey: msg`All vaults`,
    icon: 'icon-wallet',
    route: ROUTER.VAULTS,
  },
  {
    id: 'my-portfolio',
    titleKey: msg`My portfolio`,
    icon: 'icon-portfolio',
    route: ROUTER.MY_PORTFOLIO,
  },
  {
    id: 'my-fund-agent',
    titleKey: msg`My fund agent`,
    icon: 'icon-agent',
    route: ROUTER.MY_FUND_AGENT,
  },
]

export default function Vaults() {
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const { from } = useParsedQueryString()
  const { t } = useLingui()

  const handleItemClick = useCallback(
    (route: string) => {
      setCurrentRouter(route)
    },
    [setCurrentRouter],
  )

  const handleCreateAgent = useCallback(() => {
    // TODO: 实现创建 agent 的逻辑
    console.log('Create agent clicked')
  }, [])

  const list = useMemo(() => {
    return VAULT_ITEMS.map((item) => ({
      key: item.id,
      title: t(item.titleKey),
      icon: item.icon,
      route: item.route,
    }))
  }, [t])

  return (
    <VaultsWrapper>
      {list.map((item) => {
        const { key, title, icon, route } = item
        const isActive = isMatchCurrentRouter(currentRouter, route) || from === route
        return (
          <Item key={key} onClick={() => handleItemClick(route)} $isActive={isActive}>
            <IconBase className={icon} />
            <span>{title}</span>
          </Item>
        )
      })}
      <CreateAgentButton onClick={handleCreateAgent}>
        <div className='icon-wrapper'>
          <IconBase className='icon-chat-upload' />
        </div>
        <span>
          <Trans>Create agent</Trans>
        </span>
      </CreateAgentButton>
    </VaultsWrapper>
  )
}
