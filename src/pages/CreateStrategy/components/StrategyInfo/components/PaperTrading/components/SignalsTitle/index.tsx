import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { memo } from 'react'
import { useIsShowSignals } from 'store/createstrategy/hooks/usePaperTrading'
import styled, { css } from 'styled-components'

const SignalsTitleWrapper = styled.div<{ $isShowSignals: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
  width: fit-content;
  height: 36px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.black200};
    border-radius: 4px;
    background: ${({ theme }) => theme.black800};
    .icon-arrow-bar {
      font-size: 18px;
      color: ${({ theme }) => theme.black200};
    }
  }
  &:hover {
    opacity: 0.7;
  }
  ${({ $isShowSignals }) =>
    !$isShowSignals &&
    css`
      margin-left: 12px;
      span:first-child {
        .icon-arrow-bar {
          transform: rotate(180deg);
        }
      }
    `}
`

export default memo(function SignalsTitle() {
  const [isShowSignals, setIsShowSignals] = useIsShowSignals()
  return (
    <SignalsTitleWrapper $isShowSignals={isShowSignals} onClick={() => setIsShowSignals(!isShowSignals)}>
      <span>
        <IconBase className='icon-arrow-bar' />
      </span>
      <span>
        <Trans>Signals</Trans>
      </span>
    </SignalsTitleWrapper>
  )
})
