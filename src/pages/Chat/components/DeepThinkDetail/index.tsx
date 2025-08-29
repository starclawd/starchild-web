import styled, { css } from 'styled-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { IconBase } from 'components/Icons'
import { useCurrentAiContentDeepThinkData, useIsShowDeepThink, useIsShowDeepThinkSources } from 'store/chat/hooks'
import ThinkList from '../DeepThink/components/ThinkList'
import Sources from '../DeepThink/components/Sources'
import { Trans } from '@lingui/react/macro'
import MoveTabList from 'components/MoveTabList'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'

const DeepThinkInnerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  .think-list-wrapper {
    height: calc(100% - 64px);
  }
  .sources-wrapper {
    height: calc(100% - 64px);
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      height: 100%;
      gap: ${vm(20)};
      padding: 0;
      .think-list-wrapper {
        height: calc(100% - ${vm(64)});
      }
      .sources-wrapper {
        height: calc(100% - ${vm(64)});
      }
    `}
`

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 44px;
  .tab-list-wrapper {
    flex: 1;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(36)};
      .tab-list-wrapper {
        width: 100%;
        .move-tab-item {
          font-size: 0.13rem;
          line-height: 0.2rem;
        }
      }
    `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  .icon-chat-delete {
    font-size: 24px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.textL3};
  }
  &:hover {
    background-color: ${({ theme }) => theme.bgT20};
    .icon-chat-delete {
      color: ${({ theme }) => theme.textL1};
    }
  }
`

export default function DeepThinkDetail() {
  const isMobile = useIsMobile()
  const [tabIndex, setTabIndex] = useState(0)
  const [, setIsShowDeepThink] = useIsShowDeepThink()
  const [isShowDeepThinkSources] = useIsShowDeepThinkSources()
  const [{ thoughtContentList, sourceListDetails }] = useCurrentAiContentDeepThinkData()
  const changeTabIndex = useCallback(
    (index: number) => {
      return () => {
        setTabIndex(index)
      }
    },
    [setTabIndex],
  )

  const tabList = useMemo(() => {
    const sourceListLength = sourceListDetails.length
    return [
      {
        key: 0,
        text: <Trans>Activity</Trans>,
        clickCallback: changeTabIndex(0),
      },
      {
        key: 1,
        text: <Trans>{sourceListLength} sources</Trans>,
        clickCallback: changeTabIndex(1),
      },
    ]
  }, [sourceListDetails.length, changeTabIndex])

  useEffect(() => {
    if (isShowDeepThinkSources) {
      setTabIndex(1)
    } else {
      setTabIndex(0)
    }
  }, [isShowDeepThinkSources])
  return (
    <DeepThinkInnerContent>
      <TabWrapper>
        <MoveTabList borderRadius={isMobile ? 8 : 12} tabIndex={tabIndex} tabList={tabList} />
        {!isMobile && (
          <IconWrapper onClick={() => setIsShowDeepThink(false)}>
            <IconBase className='icon-chat-delete' />
          </IconWrapper>
        )}
      </TabWrapper>
      {tabIndex === 0 && <ThinkList thoughtList={thoughtContentList} />}
      {tabIndex === 1 && <Sources sourceList={sourceListDetails} />}
    </DeepThinkInnerContent>
  )
}
