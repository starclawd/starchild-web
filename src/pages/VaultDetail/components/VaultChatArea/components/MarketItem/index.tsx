import styled from 'styled-components'
import { StrategyDecisionType } from 'api/strategy'
import { useTimezone } from 'store/timezonecache/hooks'
import { useMemo } from 'react'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'

const MarketItemWrapper = styled.div`
  display: flex;
  gap: 4px;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Decision = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
`

const Des = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black0};
`

export default function MarketItem({ decision }: { decision: StrategyDecisionType }) {
  const { description } = decision || { description: '' }
  return (
    <MarketItemWrapper>
      <IconBase className='icon-decision' />
      <Right>
        <Decision>
          <Trans>Decision</Trans>
        </Decision>
        <Des>{description}</Des>
      </Right>
    </MarketItemWrapper>
  )
}
