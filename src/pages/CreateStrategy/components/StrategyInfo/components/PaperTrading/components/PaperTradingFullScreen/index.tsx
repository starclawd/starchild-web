import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import { IconBase } from 'components/Icons'
import useParsedQueryString from 'hooks/useParsedQueryString'
import VaultContentTabs from 'pages/VaultDetail/components/VaultContentTabs'
import VaultChatArea from 'pages/VaultDetail/components/VaultChatArea'
import PaperTradingButtonWrapper from '../PaperTradingButtonWrapper'

const FullScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #151110;
`

const FullScreenHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.black800};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
`

const PaperTradingIcon = styled(IconBase)`
  font-size: 18px;
  color: ${({ theme }) => theme.black0};
`

const PaperTradingText = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
`

const FullScreenContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100% - 40px);
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100% - 300px);
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.black800};
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  flex-shrink: 0;
  height: 100%;
`

export default memo(function PaperTradingFullScreen() {
  const { strategyId } = useParsedQueryString()

  return (
    <FullScreenWrapper>
      <FullScreenHeader>
        <HeaderLeft>
          <PaperTradingIcon className='icon-paper-trading' />
          <PaperTradingText>
            <Trans>Paper Trading</Trans>
          </PaperTradingText>
        </HeaderLeft>
        <PaperTradingButtonWrapper />
      </FullScreenHeader>

      <FullScreenContent>
        <LeftContent>
          <VaultContentTabs />
        </LeftContent>

        <RightContent>
          <VaultChatArea strategyId={strategyId || ''} />
        </RightContent>
      </FullScreenContent>
    </FullScreenWrapper>
  )
})
