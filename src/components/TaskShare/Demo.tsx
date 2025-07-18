import React, { RefObject, useRef, useState } from 'react'
import styled from 'styled-components'
import TaskShare, { useCopyImgAndText } from './index'
import { GENERATION_STATUS, TASK_TYPE, TaskDetailType } from 'store/backtest/backtest'
import { TASK_STATUS } from 'store/backtest/backtest.d'
import { ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'

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

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  position: relative;

  .share-info {
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

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  }

  .share-preview {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    border: 1px solid ${({ theme }) => theme.lineDark8};
    border-radius: 8px;
    background: ${({ theme }) => theme.bgL0};
    overflow: hidden;
    position: relative;

    .preview-note {
      position: absolute;
      top: 10px;
      right: 10px;
      background: ${({ theme }) => theme.bgL2};
      color: ${({ theme }) => theme.textL3};
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10;
    }
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

const ShareButton = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-share {
    font-size: 16px;
    color: ${({ theme }) => theme.textL1};
  }
`

const TaskShareDemo = () => {
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const shareDomRef = useRef<HTMLDivElement>(null)
  const copyImgAndText = useCopyImgAndText()

  // 模拟任务详情数据
  const mockTaskDetail: TaskDetailType = {
    task_id: 'demo-task-001',
    description: '这是一个用于演示的任务分享组件，展示了如何使用 TaskShare 组件来分享任务信息。',
    user_name: 'Demo User',
    created_at: 1715769600000,
    status: TASK_STATUS.COMPLETED,
    trigger_history: [
      {
        trigger_time: 1715769600000,
        message:
          '任务分析完成\n\n根据当前市场数据分析，建议关注以下几个关键指标：\n\n1. 成交量变化趋势\n2. 价格支撑位和阻力位\n3. 技术指标背离情况\n\n请注意风险控制，合理配置仓位。',
        error: '',
      },
      {
        trigger_time: 1715769600000,
        message:
          '市场信号更新\n\n检测到重要的价格突破信号：\n\n- 突破关键阻力位\n- 成交量明显放大\n- 技术指标发出买入信号\n\n建议密切关注后续走势。',
        error: '',
      },
    ],
    user_id: 'demo-user-001',
    task_type: TASK_TYPE.AI_TASK,
    code: 'demo-code-001',
    trigger_time: 1715769600000,
    updated_at: 1715769600000,
    interval: 1000,
    last_checked_at: 1715769600000,
    trigger_type: 'manual',
    subscription_user_count: 100,
    condition_mode: 'and',
    tokens: '100',
    title: '任务分享',
    user_avatar: 'https://storage.googleapis.com/holomind-img-holomind-2025/1752388008_avatar_5735426832_bz12k5w8.jpg',
    id: 0,
    tags: '',
    category: '',
    display_user_name: '',
    display_user_avatar: '',
    code_description: '',
    generation_msg: '',
    generation_status: GENERATION_STATUS.PENDING,
    workflow: '',
  }

  const shareUrl = `${window.location.origin}/taskdetail?taskId=${mockTaskDetail.task_id}`

  const handleShare = () => {
    copyImgAndText({
      shareUrl,
      shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
      setIsCopyLoading,
    })
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>TaskShare 任务分享组件示例</h2>
        <p>
          TaskShare 组件用于生成任务分享的预览图，包含任务描述、用户信息、历史聊天记录和二维码等信息。
          主要用于将任务信息以图片形式分享到社交平台或其他应用。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基本用法</h3>
        <p>传入任务详情数据和分享链接，生成分享预览图</p>

        <DemoRow>
          <div className='share-info'>
            <div className='label'>任务分享预览</div>
            <div className='description'>展示了包含任务描述、用户信息、历史聊天记录和二维码的分享卡片</div>
            <div className='actions'>
              <ShareButton onClick={handleShare}>
                {isCopyLoading ? (
                  <Pending />
                ) : (
                  <>
                    <IconBase className='icon-chat-share' />
                    分享图片
                  </>
                )}
              </ShareButton>
            </div>
          </div>
          <div className='share-preview'>
            <div className='preview-note'>分享预览</div>
            <TaskShare taskDetail={mockTaskDetail} ref={shareDomRef} shareUrl={shareUrl} />
          </div>
        </DemoRow>

        <CodeBlock>
          {`import TaskShare, { useCopyImgAndText } from 'components/TaskShare'

const [isCopyLoading, setIsCopyLoading] = useState(false)
const shareDomRef = useRef<HTMLDivElement>(null)
const copyImgAndText = useCopyImgAndText()

const handleShare = () => {
  copyImgAndText({
    shareUrl,
    shareDomRef,
    setIsCopyLoading,
  })
}

<TaskShare
  taskDetail={taskDetail}
  ref={shareDomRef}
  shareUrl={shareUrl}
/>
<button onClick={handleShare}>分享图片</button>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>数据结构</h3>
        <p>TaskShare 组件需要的数据结构说明</p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ marginBottom: '15px', color: '#4ecdc4' }}>TaskDetailType</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 1fr', gap: '10px', fontSize: '14px' }}>
            <div style={{ fontWeight: 'bold' }}>属性</div>
            <div style={{ fontWeight: 'bold' }}>类型</div>
            <div style={{ fontWeight: 'bold' }}>描述</div>

            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>task_id</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>string</div>
            <div>任务唯一标识</div>

            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>description</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>string</div>
            <div>任务描述</div>

            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>user_name</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>string</div>
            <div>用户名</div>

            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>created_at</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>string</div>
            <div>创建时间</div>

            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>status</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>enum</div>
            <div>任务状态</div>

            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>trigger_history</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>array</div>
            <div>触发历史记录</div>
          </div>
        </div>

        <CodeBlock>
          {`interface TaskDetailType {
  task_id: string
  description: string
  user_name: string
  created_at: string
  status: TASK_STATUS
  trigger_history: Array<{
    trigger_time: string
    message?: string
    error?: string
  }>
}

// 使用示例
const taskDetail: TaskDetailType = {
  task_id: 'demo-task-001',
  description: '任务描述',
  user_name: 'Demo User',
  created_at: '2024-01-15T10:30:00.000Z',
  status: TASK_STATUS.COMPLETED,
  trigger_history: [
    {
      trigger_time: '2024-01-15T10:35:00.000Z',
      message: '任务分析完成\\n\\n详细分析内容...',
    }
  ]
}`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>使用场景</h3>
        <p>TaskShare 组件的典型使用场景</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div
            style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ marginBottom: '10px', color: '#4ecdc4' }}>1. 任务详情页分享</h4>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
              在任务详情页面中，用户可以点击分享按钮，生成包含任务信息的分享图片
            </p>
          </div>

          <div
            style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ marginBottom: '10px', color: '#4ecdc4' }}>2. 社交媒体分享</h4>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
              生成的分享图片可以直接复制到剪贴板，方便在社交媒体平台上分享
            </p>
          </div>

          <div
            style={{
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ marginBottom: '10px', color: '#4ecdc4' }}>3. 任务推广</h4>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
              通过分享任务信息，吸引更多用户了解和使用 AI 信号服务
            </p>
          </div>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>功能特性</h3>
        <p>TaskShare 组件的主要功能特性</p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>自动截图：</strong>使用 html2canvas 自动生成分享图片
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>剪贴板复制：</strong>支持同时复制图片和文本到剪贴板
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>响应式设计：</strong>自动适配桌面端和移动端不同尺寸
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>主题适配：</strong>自动适配当前主题的颜色方案
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>二维码生成：</strong>自动生成分享链接的二维码
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Markdown 支持：</strong>支持 Markdown 格式的内容展示
            </li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>Props 参数</h3>
        <p>TaskShare 组件支持的所有属性参数</p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 2fr',
              gap: '15px',
              fontWeight: 600,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '10px',
              marginBottom: '15px',
            }}
          >
            <div>属性</div>
            <div>类型</div>
            <div>描述</div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 2fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>taskDetail</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>TaskDetailType</div>
            <div>任务详情数据</div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 2fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>shareUrl</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>string</div>
            <div>分享链接，用于生成二维码和复制到剪贴板</div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 2fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
            }}
          >
            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>ref</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>Ref&lt;HTMLDivElement&gt;</div>
            <div>DOM 引用，用于截图功能</div>
          </div>
        </div>

        <CodeBlock>
          {`interface TaskShareProps {
  taskDetail: TaskDetailType  // 必填：任务详情数据
  shareUrl: string           // 必填：分享链接
  ref: Ref<HTMLDivElement>   // 必填：DOM 引用
}`}
        </CodeBlock>
      </DemoSection>
    </DemoContainer>
  )
}

export default TaskShareDemo
