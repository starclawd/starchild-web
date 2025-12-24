import styled, { css } from 'styled-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useIsShowDeepThink,
  useIsShowDeepThinkSources,
  useCurrentAiContentDeepThinkData,
} from 'store/usecases/hooks/useChatContentHooks'
import ThinkList from '../DeepThink/components/ThinkList'
import Sources from '../DeepThink/components/Sources'
import { Trans } from '@lingui/react/macro'
import MoveTabList from 'components/MoveTabList'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'

const DeepThinkInnerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: 20px 20px 80px;
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
    if (sourceListLength === 0) {
      return [
        {
          key: 0,
          text: <Trans>Activity</Trans>,
          clickCallback: changeTabIndex(0),
        },
      ]
    }
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
    <DeepThinkInnerContent className='deep-think-inner-content'>
      <TabWrapper>
        <MoveTabList tabKey={tabIndex} tabList={tabList} />
      </TabWrapper>
      {tabIndex === 0 && <ThinkList thoughtList={thoughtContentList} />}
      {tabIndex === 1 && <Sources sourceList={sourceListDetails} />}
    </DeepThinkInnerContent>
  )
}
