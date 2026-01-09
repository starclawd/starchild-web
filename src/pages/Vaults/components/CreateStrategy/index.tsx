import { Trans } from '@lingui/react/macro'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import createStrategyBg from 'assets/vaults/create-strategy-bg.svg'
import { useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

const CreateStrategyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;
  gap: 20px;
  padding: 16px;
  width: 400px;
  height: fit-content;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.black800};
  background: ${({ theme }) => theme.black700};
  img {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 120px;
    height: auto;
  }
`

const TopContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  z-index: 2;
`

const TopLeft = styled.div`
  display: flex;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  color: ${({ theme }) => theme.black0};
`

const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.brand100};
  > span:first-child {
    height: 64px;
    text-align: right;
    span:first-child {
      font-size: 56px;
      font-style: italic;
      font-weight: 700;
      line-height: 64px;
    }
    span:last-child {
      font-size: 20px;
      font-style: italic;
      font-weight: 700;
      line-height: 56px;
    }
  }
  > span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    text-align: right;
  }
`

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 32px;
  .bottom-content-text {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.black300};
  }
`

const ButtonCreate = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  width: 130px;
  height: 32px;
  gap: 4px;
  white-space: nowrap;
  .icon-create-strategy {
    font-size: 18px;
    color: ${({ theme }) => theme.black1000};
  }
`

export default memo(function CreateStrategy() {
  const setCurrentRouter = useSetCurrentRouter()
  const goCreateStrategyPage = useCallback(() => {
    setCurrentRouter(ROUTER.CHAT)
  }, [setCurrentRouter])
  return (
    <CreateStrategyWrapper>
      <img src={createStrategyBg} alt='create-strategy-bg' />
      <TopContent>
        <TopLeft>
          <Trans>
            Launch your
            <br /> Strategy Agent
          </Trans>
        </TopLeft>
        <TopRight>
          <span>
            <span>10</span>
            <span>%</span>
          </span>
          <span>
            <Trans>Commission</Trans>
          </span>
        </TopRight>
      </TopContent>
      <BottomContent>
        <span className='bottom-content-text'>
          <Trans>How to create a strategy?</Trans>
        </span>
        <ButtonCreate onClick={goCreateStrategyPage}>
          <IconBase className='icon-create-strategy' />
          <span>
            <Trans>Create strategies</Trans>
          </span>
        </ButtonCreate>
      </BottomContent>
    </CreateStrategyWrapper>
  )
})
