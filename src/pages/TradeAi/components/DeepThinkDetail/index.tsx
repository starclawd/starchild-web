import styled, { css } from 'styled-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { IconBase } from 'components/Icons'
import { useCurrentAiContentDeepThinkData, useIsShowDeepThink } from 'store/tradeai/hooks'
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
  width: 360px;
  height: 100%;
  padding: 16px;
  .think-list-wrapper {
    height: calc(100% - 64px);
  }
  .sources-wrapper {
    height: calc(100% - 64px);
  }
  ${({ theme }) => theme.isMobile && css`
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
  height: 44px;
  .tab-list-wrapper {
    width: 240px;
  }
  .icon-chat-close {
    font-size: 28px;
    color: ${({ theme }) => theme.textL4};
    cursor: pointer;
  }
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(44)};
    .tab-list-wrapper {
      width: 100%;
    }
  `}
`

export default function DeepThinkDetail() {
  const isMobile = useIsMobile()
  const [tabIndex, setTabIndex] = useState(0)
  const [, setIsShowDeepThink] = useIsShowDeepThink()
  const [{ thoughtContentList, sourceListDetails }] = useCurrentAiContentDeepThinkData()
  const changeTabIndex = useCallback((index: number) => {
    return () => {
      setTabIndex(index)
    }
  }, [setTabIndex])
  
  const tabList = useMemo(() => {
    const sourceListLength = sourceListDetails.length
    return [
      {
        key: 0,
        text: <Trans>Activity</Trans>,
        clickCallback: changeTabIndex(0)
      },
      {
        key: 1,
        text: <Trans>{sourceListLength} sources</Trans>,
        clickCallback: changeTabIndex(1)
      },
    ]
  }, [sourceListDetails.length, changeTabIndex])

  useEffect(() => {
    setTabIndex(0)
  }, [])
  return <DeepThinkInnerContent>
    <TabWrapper>
      <MoveTabList
        tabIndex={tabIndex}
        tabList={tabList}
      />
      {!isMobile && <IconBase onClick={() => setIsShowDeepThink(false)} className="icon-chat-close" />}
    </TabWrapper>
    {tabIndex === 0 && <ThinkList thoughtList={thoughtContentList} />}
    {tabIndex === 1 && <Sources sourceList={sourceListDetails} />}
  </DeepThinkInnerContent>
}
