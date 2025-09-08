import { useState, useCallback } from 'react'
import styled, { css, useTheme } from 'styled-components'
import AgentActions from './index'
import { ActionType } from './types'
import { AGENT_STATUS, AGENT_TYPE, AgentDetailDataType, GENERATION_STATUS } from 'store/agentdetail/agentdetail'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import Popover from 'components/Popover'
import { IconBase } from 'components/Icons'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;
`

const DemoSection = styled.div`
  margin-bottom: 40px;

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }

  h4 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 10px;
    font-size: 16px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  position: relative;

  .demo-info {
    flex: 1;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.textL1};
      margin-bottom: 5px;
    }

    .description {
      color: ${({ theme }) => theme.textL3};
      font-size: 14px;
      margin-bottom: 10px;
    }
  }

  .demo-preview {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL2};
  color: ${({ theme }) => theme.textL1};
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
`

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`

const FeatureCard = styled.div`
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  h4 {
    margin-bottom: 10px;
    color: ${({ theme }) => theme.brand100};
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }
`

const PropsTable = styled.div`
  display: grid;
  grid-template-columns: 150px 150px 1fr 100px;
  gap: 15px;
  font-size: 14px;

  .header {
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .prop-name {
    font-family: monospace;
    color: ${({ theme }) => theme.ruby50};
  }

  .prop-type {
    font-family: monospace;
    color: ${({ theme }) => theme.brand100};
  }

  .prop-required {
    color: ${({ theme }) => theme.yellow100};
  }
`

const IconWrapper = styled.div<{ $showHover?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 18px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textDark54};
  ${({ theme, $showHover }) =>
    theme.isMobile
      ? css`
          width: ${vm(24)};
          height: ${vm(24)};
          font-size: 0.18rem;
        `
      : css`
          cursor: pointer;
          ${$showHover &&
          css`
            &:hover {
              background-color: ${({ theme }) => theme.bgT20};
            }
          `}
        `}
`

const TriggerTimes = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 14px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  color: ${({ theme }) => theme.brand100};
`

const TopRight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
`

const ActionLog = styled.div`
  background: ${({ theme }) => theme.black700};
  border-radius: 8px;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;

  .log-item {
    color: ${({ theme }) => theme.green100};
    margin-bottom: 4px;
    font-family: monospace;
    font-size: 13px;
  }

  .empty-log {
    color: ${({ theme }) => theme.textL3};
    font-size: 14px;
  }
`

// 模拟数据
const mockAgentData: AgentDetailDataType = {
  id: 293,
  task_id: 'cf74949b-dbb6-42a6-b025-f28acfba95eb',
  title: '回测WOO代币的量化交易策略',
  description: '回测过去一年WOO代币的量化交易策略，包含具体的进出场规则',
  user_id: '5386184059',
  user_name: 'jojo_0xJotaro',
  kol_name: '',
  subscription_user_count: 1,
  user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
  kol_avatar: '',
  categories: [AGENT_HUB_TYPE.SIGNAL_SCANNER],
  image_url: 'https://storage.googleapis.com/holomind-img-holomind-2025/1754450554_tmp_g01hkcx.png_compressed.jpg',
  tags: 'Custom Backtest',
  trigger_history: [
    {
      message:
        '*WOO Token Backtest Results: 1-Year Quantitative Strategy*\n\n📊 *Overall Performance*\n- *Trading period*: 2024-08-07 ~ 2025-08-06 (369 days)\n- *Trades executed*: 58 (29 buy/sell pairs)\n- *Total return*: -2.01% (*final equity*: $9,799.24 from $10,000)\n- *Annualized return*: -1.99%\n- *Sharpe ratio*: -1.68\n- *Maximum drawdown*: 2.74% ($273.96)\n- *Profit factor*: 0.68\n- *Average winning trade*: $36.06, *average losing trade*: $37.26\n- *Win rate*: 41.4% (12 winners)\n- *Avg trades per day*: 0.16\n\n⚙️ *Strategy Breakdown*\n- *Entry*: Go long when EMA-10 crosses above EMA-50 or EMA-10 > EMA-50, price breaks above previous high (0.5%) or near upper Bollinger Band, with 5-min volume ≥ 1.2× 20-bar average.\n- *Exit*: +2% take profit, -1% stop loss, ATR(14)×1.2 trailing stop, EMA death cross, max 30-day hold, or mean reversion to BB middle.\n- *Position size*: 7.5% of equity per trade\n- *Max account drawdown*: 12%\n\n📈 *Performance Analysis*\n- The strategy triggered frequent trades, but overall market conditions for WOO token led to slightly negative returns. Most losses were kept small due to *risk management* and *drawdown controls*. The win rate and profit factor suggest the setup was moderately effective but struggled in a choppy or downtrending environment.\n\n🛡️ *Risk & Suggestions*\n- *Drawdowns* remained controlled, never breaching the 12% cap.\n- *Improvements*: Consider optimizing entry thresholds, increasing position selectivity, or combining with trend filters to reduce losses in sideways markets.\n- *Backtest limitations*: Results are based on historical, simulated data. Real trading may differ due to slippage, liquidity, and order execution.\n\nFor more details, copy this summary: `WOO Token EMA-10/50 BB strategy: 58 trades, -2.01% 1y return, win rate 41.4%, Sharpe -1.68, max DD 2.74%`',
      trigger_time: Date.now(),
    },
  ],
  task_type: AGENT_TYPE.BACKTEST_TASK,
  check_log: [],
  code: '',
  trigger_time: 0,
  status: AGENT_STATUS.COMPLETED,
  created_at: Date.now(),
  updated_at: Date.now(),
  interval: 3600,
  last_checked_at: Date.now(),
  trigger_type: 'condition',
  condition_mode: 'all',
  tokens: 'WOO',
  code_description: '',
  generation_msg: '',
  generation_status: GENERATION_STATUS.SUCCESS,
  workflow: '',
}

const AgentActionsDemo = () => {
  const [actionLog, setActionLog] = useState<string[]>([])
  const [showDropdown1, setShowDropdown1] = useState(false)
  const [showDropdown2, setShowDropdown2] = useState(false)
  const [showDropdown3, setShowDropdown3] = useState(false)
  const theme = useTheme()

  const logAction = (action: string) => {
    setActionLog((prev) => [`${new Date().toLocaleTimeString()}: ${action}`, ...prev.slice(0, 4)])
  }

  const commonHandlers = {
    onEdit: () => logAction('Edit clicked'),
    onPause: () => logAction('Pause clicked'),
    onDelete: () => logAction('Delete clicked'),
    onSubscribe: () => logAction('Subscribe clicked'),
    onShare: () => logAction('Share clicked'),
  }

  const handleDropdownClick1 = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setShowDropdown1(!showDropdown1)
    },
    [showDropdown1],
  )

  const handleDropdownClick2 = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setShowDropdown2(!showDropdown2)
    },
    [showDropdown2],
  )

  const handleDropdownClick3 = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setShowDropdown3(!showDropdown3)
    },
    [showDropdown3],
  )

  return (
    <DemoContainer>
      <DemoSection>
        <h2>AgentActions 组件示例</h2>
        <p>
          AgentActions 是一个通用的 Agent 操作组件，支持两种展示模式：dropdown（下拉菜单）和 toolbar（工具栏）。
          它统一了整个应用中 Agent 相关的操作逻辑，提供了一致的用户体验。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基本用法</h3>
        <p>AgentActions 组件支持两种展示模式，适用于不同的使用场景</p>

        <h4>Dropdown 模式</h4>
        <p>适用于列表、卡片等紧凑空间，只渲染操作列表内容，父组件负责管理 Popover 和其他元素（如未读计数）</p>

        <DemoRow>
          <div className='demo-info'>
            <div className='label'>完整操作菜单（带未读计数）</div>
            <div className='description'>未读计数由父组件管理，AgentActions 只负责渲染操作列表</div>
          </div>
          <div className='demo-preview'>
            <TopRight>
              {/* 未读计数由父组件控制，不是 AgentActions 的功能 */}
              <TriggerTimes $borderRadius={44} $borderColor={theme.bgT20}>
                3
              </TriggerTimes>
              <Popover
                placement='bottom-end'
                show={showDropdown1}
                onClickOutside={() => setShowDropdown1(false)}
                content={
                  <AgentActions
                    data={mockAgentData}
                    mode='dropdown'
                    actions={[ActionType.EDIT, ActionType.PAUSE, ActionType.SHARE, ActionType.DELETE]}
                    {...commonHandlers}
                    onClose={() => setShowDropdown1(false)}
                  />
                }
              >
                <IconWrapper $showHover={true} onClick={handleDropdownClick1}>
                  <IconBase className='icon-chat-more' />
                </IconWrapper>
              </Popover>
            </TopRight>
          </div>
        </DemoRow>

        <DemoRow>
          <div className='demo-info'>
            <div className='label'>基础操作菜单</div>
            <div className='description'>仅包含暂停和删除操作</div>
          </div>
          <div className='demo-preview'>
            <Popover
              placement='bottom-end'
              show={showDropdown2}
              onClickOutside={() => setShowDropdown2(false)}
              content={
                <AgentActions
                  data={mockAgentData}
                  mode='dropdown'
                  actions={[ActionType.PAUSE, ActionType.DELETE]}
                  {...commonHandlers}
                  onClose={() => setShowDropdown2(false)}
                />
              }
            >
              <IconWrapper $showHover={true} onClick={handleDropdownClick2}>
                <IconBase className='icon-chat-more' />
              </IconWrapper>
            </Popover>
          </div>
        </DemoRow>

        <DemoRow>
          <div className='demo-info'>
            <div className='label'>订阅状态菜单</div>
            <div className='description'>非自己的 Agent，显示订阅相关操作</div>
          </div>
          <div className='demo-preview'>
            <Popover
              placement='bottom-end'
              show={showDropdown3}
              onClickOutside={() => setShowDropdown3(false)}
              content={
                <AgentActions
                  data={{ ...mockAgentData, user_id: 'other-user' }}
                  mode='dropdown'
                  actions={[ActionType.PAUSE, ActionType.SHARE, ActionType.DELETE]}
                  {...commonHandlers}
                  onClose={() => setShowDropdown3(false)}
                />
              }
            >
              <IconWrapper $showHover={true} onClick={handleDropdownClick3}>
                <IconBase className='icon-chat-more' />
              </IconWrapper>
            </Popover>
          </div>
        </DemoRow>

        <CodeBlock>
          {`// Dropdown 模式使用示例
import AgentActions, { ActionType } from 'components/AgentActions'

<Popover
  placement='bottom-end'
  show={isShowDropdown}
  onClickOutside={() => setIsShowDropdown(false)}
  content={
    <AgentActions
      data={agentData}
      mode='dropdown'
      actions={[ActionType.EDIT, ActionType.PAUSE, ActionType.SHARE, ActionType.DELETE]}
      onEdit={handleEdit}
      onPause={handlePause}
      onDelete={handleDelete}
      onShare={handleShare}
      onClose={() => setIsShowDropdown(false)}
    />
  }
>
  <IconWrapper onClick={handleClick}>
    <IconBase className='icon-chat-more' />
  </IconWrapper>
</Popover>`}
        </CodeBlock>

        <h4>Toolbar 模式</h4>
        <p>适用于详情页等宽敞空间，横向展示所有操作按钮</p>

        <DemoRow>
          <div className='demo-info'>
            <div className='label'>完整工具栏</div>
            <div className='description'>包含删除、暂停、分享和订阅按钮</div>
          </div>
          <div className='demo-preview'>
            <AgentActions
              data={mockAgentData}
              mode='toolbar'
              actions={[ActionType.DELETE, ActionType.PAUSE, ActionType.SHARE, ActionType.SUBSCRIBE]}
              {...commonHandlers}
            />
          </div>
        </DemoRow>

        <DemoRow>
          <div className='demo-info'>
            <div className='label'>精简工具栏</div>
            <div className='description'>仅显示核心操作</div>
          </div>
          <div className='demo-preview'>
            <AgentActions
              data={mockAgentData}
              mode='toolbar'
              actions={[ActionType.PAUSE, ActionType.SHARE]}
              {...commonHandlers}
            />
          </div>
        </DemoRow>

        <CodeBlock>
          {`// Toolbar 模式使用示例
import AgentActions, { ActionType } from 'components/AgentActions'

<AgentActions
  data={agentDetailData}
  mode='toolbar'
  actions={[ActionType.DELETE, ActionType.PAUSE, ActionType.SHARE, ActionType.SUBSCRIBE]}
  onPause={handlePause}
  onDelete={handleDelete}
  onSubscribe={handleSubscribe}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>数据结构</h3>
        <InfoBox>
          <h4>ActionType Enum</h4>
          <p style={{ marginBottom: '15px' }}>定义了所有可用的操作类型：</p>
          <CodeBlock>
            {`enum ActionType {
  EDIT = 'edit',       // 编辑
  PAUSE = 'pause',     // 暂停
  DELETE = 'delete',   // 删除
  SUBSCRIBE = 'subscribe', // 订阅
  SHARE = 'share',     // 分享
}`}
          </CodeBlock>
        </InfoBox>

        <InfoBox style={{ marginTop: '20px' }}>
          <h4>AgentDetailDataType</h4>
          <PropsTable>
            <div className='header'>属性</div>
            <div className='header'>类型</div>
            <div className='header'>描述</div>
            <div className='header'>必填</div>

            <div className='prop-name'>task_id</div>
            <div className='prop-type'>string</div>
            <div>任务唯一标识</div>
            <div className='prop-required'>✓</div>

            <div className='prop-name'>id</div>
            <div className='prop-type'>number</div>
            <div>Agent ID</div>
            <div className='prop-required'>✓</div>

            <div className='prop-name'>user_id</div>
            <div className='prop-type'>string</div>
            <div>创建者用户ID</div>
            <div className='prop-required'>✓</div>

            <div className='prop-name'>trigger_history</div>
            <div className='prop-type'>Array</div>
            <div>触发历史记录</div>
            <div className='prop-required'>-</div>
          </PropsTable>
        </InfoBox>
      </DemoSection>

      <DemoSection>
        <h3>功能特性</h3>
        <FeatureGrid>
          <FeatureCard>
            <h4>1. 双模式支持</h4>
            <p>支持 dropdown 和 toolbar 两种展示模式，适应不同场景需求</p>
          </FeatureCard>

          <FeatureCard>
            <h4>2. 智能权限控制</h4>
            <p>根据 isSelfAgent 自动判断显示编辑、删除等操作权限</p>
          </FeatureCard>

          <FeatureCard>
            <h4>3. 职责分离</h4>
            <p>dropdown 模式只渲染操作列表，由父组件管理 Popover 和触发器</p>
          </FeatureCard>

          <FeatureCard>
            <h4>4. 灵活配置</h4>
            <p>通过 actions 数组灵活控制显示哪些操作按钮</p>
          </FeatureCard>

          <FeatureCard>
            <h4>5. 主题适配</h4>
            <p>自动适配系统主题，支持深色和浅色模式</p>
          </FeatureCard>

          <FeatureCard>
            <h4>6. 响应式设计</h4>
            <p>完美适配桌面端和移动端不同尺寸屏幕</p>
          </FeatureCard>
        </FeatureGrid>
      </DemoSection>

      <DemoSection>
        <h3>Props 参数</h3>
        <InfoBox>
          <PropsTable>
            <div className='header'>属性</div>
            <div className='header'>类型</div>
            <div className='header'>描述</div>
            <div className='header'>必填</div>

            <div className='prop-name'>data</div>
            <div className='prop-type'>AgentDetailDataType</div>
            <div>Agent 详情数据</div>
            <div className='prop-required'>✓</div>

            <div className='prop-name'>mode</div>
            <div className='prop-type'>{"'dropdown' | 'toolbar'"}</div>
            <div>展示模式，默认 'dropdown'</div>
            <div>-</div>

            <div className='prop-name'>actions</div>
            <div className='prop-type'>ActionType[]</div>
            <div>要显示的操作类型数组（使用 ActionType enum）</div>
            <div>-</div>

            <div className='prop-name'>onEdit</div>
            <div className='prop-type'>{'() => void'}</div>
            <div>编辑操作回调</div>
            <div>-</div>

            <div className='prop-name'>onPause</div>
            <div className='prop-type'>{'() => void'}</div>
            <div>暂停操作回调</div>
            <div>-</div>

            <div className='prop-name'>onDelete</div>
            <div className='prop-type'>{'() => void'}</div>
            <div>删除操作回调</div>
            <div>-</div>

            <div className='prop-name'>onSubscribe</div>
            <div className='prop-type'>{'() => void'}</div>
            <div>订阅操作回调</div>
            <div>-</div>

            <div className='prop-name'>onShare</div>
            <div className='prop-type'>{'() => void'}</div>
            <div>分享操作回调</div>
            <div>-</div>

            <div className='prop-name'>onClose</div>
            <div className='prop-type'>{'() => void'}</div>
            <div>关闭菜单回调（dropdown 模式）</div>
            <div>-</div>

            <div className='prop-name'>className</div>
            <div className='prop-type'>string</div>
            <div>自定义样式类名</div>
            <div>-</div>
          </PropsTable>
        </InfoBox>
      </DemoSection>

      <DemoSection>
        <h3>操作日志</h3>
        <p>点击上面的操作按钮查看交互日志</p>
        <ActionLog>
          {actionLog.length > 0 ? (
            actionLog.map((log, index) => (
              <div key={index} className='log-item'>
                {log}
              </div>
            ))
          ) : (
            <div className='empty-log'>暂无操作日志，点击上面的按钮试试...</div>
          )}
        </ActionLog>
      </DemoSection>

      <DemoSection>
        <h3>使用场景</h3>
        <FeatureGrid>
          <FeatureCard>
            <h4>MyAgent 页面</h4>
            <p>在我的 Agent 列表中，使用 dropdown 模式显示操作菜单，支持编辑、暂停、删除等操作</p>
          </FeatureCard>

          <FeatureCard>
            <h4>AgentDetail 页面</h4>
            <p>在 Agent 详情页中，使用 toolbar 模式横向展示所有操作按钮，提供更直观的操作体验</p>
          </FeatureCard>
        </FeatureGrid>
      </DemoSection>
    </DemoContainer>
  )
}

export default AgentActionsDemo
