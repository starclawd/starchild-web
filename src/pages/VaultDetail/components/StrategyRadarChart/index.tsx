import { memo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import PureRadarChart from './components/RadarChart'

const StrategyRadarChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  height: 200px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      padding: ${vm(20)};
      gap: ${vm(24)};
      min-height: ${vm(300)};
    `}
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-width: 150px;
  height: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-width: auto;
      width: 100%;
      text-align: center;
      height: auto;
      gap: ${vm(24)};
    `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      justify-content: center;
    `}
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const RiskIcon = styled(IconBase)`
  font-size: 24px;
  color: ${({ theme }) => theme.black100};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(24)};
    `}
`

const TitleText = styled.div`
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.black200};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(13)};
    `}
`

const SubtitleText = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  color: ${({ theme }) => theme.black0};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
    `}
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 150px;
  height: 200px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-width: auto;
      width: 100%;
      height: ${vm(200)};
    `}
`

interface StrategyRadarChartProps {
  /** 风险偏好类型，如 "Aggressive Scalping" */
  riskAppetite: string
  /** 雷达图数据 */
  radarData: Array<{ label: string; value: number }>
}

/**
 * 策略雷达图组件
 * 展示策略的风险偏好和各维度评分
 */
const StrategyRadarChart = memo<StrategyRadarChartProps>(({ riskAppetite, radarData }) => {
  return (
    <StrategyRadarChartWrapper>
      <LeftSection>
        <IconWrapper>
          <RiskIcon className='icon-risk-appetite' />
        </IconWrapper>

        <TextWrapper>
          <TitleText>Risk appetite:</TitleText>
          <SubtitleText>{riskAppetite}</SubtitleText>
        </TextWrapper>
      </LeftSection>

      <RightSection>
        <PureRadarChart data={radarData} />
      </RightSection>
    </StrategyRadarChartWrapper>
  )
})

StrategyRadarChart.displayName = 'StrategyRadarChart'

export default StrategyRadarChart
