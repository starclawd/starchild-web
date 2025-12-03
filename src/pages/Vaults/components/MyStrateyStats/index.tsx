import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { useAppKitAccount } from '@reown/appkit/react'
import strategyBg1 from 'assets/vaults/strategy-bg1.png'
import strategyBg2 from 'assets/vaults/strategy-bg2.png'
import createAgentBg from 'assets/vaults/create-agent-bg.png'
import { ANI_DURATION } from 'constants/index'

const MyStrateyStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  gap: 20px;
`

const TopSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  position: relative;
  background: url(${strategyBg1}) right center/auto 140px no-repeat;
  border-radius: 12px;
  min-height: 140px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(20)};
      padding: ${vm(16)};
      border-radius: ${vm(8)};
      background-size: auto ${vm(120)};
      min-height: ${vm(120)};
    `}
`

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  line-height: 34px;
  margin: 0;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(28)};
      line-height: ${vm(36)};
    `}
`

const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL4};
  margin: 0;
  max-width: 600px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
      max-width: 100%;
    `}
`

const CommissionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      align-self: flex-end;
    `}
`

const CommissionValue = styled.div`
  display: flex;
  align-items: baseline;
  color: ${({ theme }) => theme.brand100};
  margin: 0;
`

const CommissionNumber = styled.span`
  font-size: 56px;
  line-height: 64px;
  font-weight: 700;
  font-style: italic;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.48rem;
    `}
`

// 已连接钱包状态的Commission数字样式
const ConnectedCommissionNumber = styled.span`
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  font-style: italic;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const CommissionPercent = styled.span`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  font-style: italic;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.18rem;
    `}
`

const CommissionLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.brand100};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.16rem;
    `}
`

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: ${vm(16)};
    `}
`

const HelpLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL4};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.textL3};
  }

  .icon-chat-arrow-long {
    font-size: 18px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
      gap: ${vm(8)};

      .icon-chat-arrow-long {
        font-size: 0.18rem;
      }
    `}
`

const CreateAgentButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: url(${createAgentBg}) center/cover no-repeat;
  color: ${({ theme }) => theme.brand100};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;
  border: none;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(10)} ${vm(20)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      gap: ${vm(6)};
      border-radius: ${vm(2)};
    `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  font-size: 18px;
  background: ${({ theme }) => theme.brand100};
  border-radius: 2px;
  padding: 3px;

  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.black};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-chat-upload {
        font-size: 0.18rem;
      }
    `}
`

// 已连接钱包状态的样式组件
const ConnectedWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  gap: 20px;
`

const ConnectedTopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  background: url(${strategyBg2}) right center/auto 140px no-repeat;
  border-radius: 12px;
  min-height: 140px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: ${vm(16)};
      border-radius: ${vm(8)};
      background-size: auto ${vm(120)};
      min-height: ${vm(120)};
    `}
`

// 顶部标题和Commission的容器
const TitleCommissionRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      align-items: flex-start;
      flex-direction: column;
      gap: ${vm(20)};
    `}
`

const ConnectedMainContent = styled.div`
  display: flex;
  align-items: flex-start;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      align-items: center;
    `}
`

const ConnectedTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  margin: 0;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.28rem;
      line-height: 0.36rem;
    `}
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 32px;
  width: 100%;

  /* 第三个子元素右对齐 */
  & > :nth-child(3) {
    justify-self: end;
    text-align: right;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      grid-template-columns: 1fr;
      gap: ${vm(16)};
    `}
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
    `}
`

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.textL4};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.11rem;
      line-height: 0.16rem;
    `}
`

const StatValue = styled.div<{ $isPositive?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme, $isPositive }) =>
    $isPositive === undefined ? theme.textL1 : $isPositive ? theme.green100 : theme.red100};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      line-height: 0.24rem;
    `}
`

const ConnectedCommissionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      align-self: flex-end;
    `}
`

const MyStrateyStats = memo(() => {
  const { address } = useAppKitAccount()

  const handleHelpClick = useCallback(() => {
    // TODO: 实现跳转到帮助页面
    console.log('跳转到如何创建Agent的帮助页面')
  }, [])

  const handleCreateAgent = useCallback(() => {
    // TODO: 实现创建Agent的逻辑
    console.log('创建Strategy Agent')
  }, [])

  // 如果已连接钱包，显示策略统计UI
  if (address) {
    return (
      <ConnectedWalletContainer>
        <ConnectedTopSection>
          <TitleCommissionRow>
            <ConnectedMainContent>
              <ConnectedTitle>
                <Trans>My Strategies</Trans>
              </ConnectedTitle>
            </ConnectedMainContent>

            <ConnectedCommissionSection>
              <CommissionValue>
                <ConnectedCommissionNumber>$8,245.98</ConnectedCommissionNumber>
              </CommissionValue>
              <CommissionLabel>
                <Trans>Commission</Trans>
              </CommissionLabel>
            </ConnectedCommissionSection>
          </TitleCommissionRow>

          <StatsGrid>
            <StatItem>
              <StatLabel>
                <Trans>Total vaults TVL</Trans>
              </StatLabel>
              <StatValue>$8,245.98</StatValue>
            </StatItem>

            <StatItem>
              <StatLabel>
                <Trans>Total PnL</Trans>
              </StatLabel>
              <StatValue $isPositive={undefined}>$2,245.98</StatValue>
            </StatItem>

            <StatItem>
              <StatLabel>
                <Trans>Depositors</Trans>
              </StatLabel>
              <StatValue>783</StatValue>
            </StatItem>
          </StatsGrid>
        </ConnectedTopSection>

        <ActionsSection>
          <HelpLink onClick={handleHelpClick}>
            <span>
              <Trans>How to create an Agent</Trans>
            </span>
            <IconBase className='icon-chat-arrow-long' />
          </HelpLink>

          <CreateAgentButton onClick={handleCreateAgent}>
            <IconWrapper>
              <IconBase className='icon-chat-upload' />
            </IconWrapper>
            <span>
              <Trans>Create strategies</Trans>
            </span>
          </CreateAgentButton>
        </ActionsSection>
      </ConnectedWalletContainer>
    )
  }

  return (
    <MyStrateyStatsContainer>
      <TopSection>
        <MainContent>
          <Title>
            <Trans>Launch your Strategy Agent</Trans>
          </Title>

          <Description>
            <Trans>
              Create a custom strategy vault with AI and earn 10% creator share from all fees generated by your pool.
            </Trans>
          </Description>
        </MainContent>

        <CommissionSection>
          <CommissionValue>
            <CommissionNumber>10</CommissionNumber>
            <CommissionPercent>%</CommissionPercent>
          </CommissionValue>
          <CommissionLabel>
            <Trans>Commission</Trans>
          </CommissionLabel>
        </CommissionSection>
      </TopSection>

      <ActionsSection>
        <HelpLink onClick={handleHelpClick}>
          <span>
            <Trans>How to create an Agent</Trans>
          </span>
          <IconBase className='icon-chat-arrow-long' />
        </HelpLink>

        <CreateAgentButton onClick={handleCreateAgent}>
          <IconWrapper>
            <IconBase className='icon-chat-upload' />
          </IconWrapper>
          <span>
            <Trans>Create strategies</Trans>
          </span>
        </CreateAgentButton>
      </ActionsSection>
    </MyStrateyStatsContainer>
  )
})

MyStrateyStats.displayName = 'MyStrateyStats'

export default MyStrateyStats
