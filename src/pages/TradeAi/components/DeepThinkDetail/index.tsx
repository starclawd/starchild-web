import styled, { css } from 'styled-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { IconBase } from 'components/Icons'
import { useCurrentAiContentDeepThinkData, useIsShowDeepThink } from 'store/tradeai/hooks'
import ThinkList from '../DeepThink/components/ThinkList'
import Sources from '../DeepThink/components/Sources'
import Markdown from 'components/Markdown'
import { Trans } from '@lingui/react/macro'
import MoveTabList from 'components/MoveTabList'

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
`

const TabWrapper = styled.div<{ $isBackTest?: boolean }>`
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
  ${({ $isBackTest }) => $isBackTest && css`
    .tab-list-wrapper {
      width: 288px;
      .move-tab-item {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }
    }
  `}
`

const Highlights = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 64px);
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};
`


export default function DeepThinkDetail() {
  const isBackTest = false
  const [tabIndex, setTabIndex] = useState(0)
  const [, setIsShowDeepThink] = useIsShowDeepThink()
  const [{ thoughtContentList, sourceListDetails, content }] = useCurrentAiContentDeepThinkData()
  const changeTabIndex = useCallback((index: number) => {
    return () => {
      setTabIndex(index)
    }
  }, [setTabIndex])
  
  const tabList = useMemo(() => {
    const sourceListLength = sourceListDetails.length
    if (isBackTest) {
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
        {
          key: 2,
          text: <Trans>Highlights</Trans>,
          clickCallback: changeTabIndex(2)
        },
      ]
    }
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
  }, [sourceListDetails.length, changeTabIndex, isBackTest])

  useEffect(() => {
    if (isBackTest) {
      setTabIndex(2)
    } else {
      setTabIndex(0)
    }
  }, [isBackTest])
  return <DeepThinkInnerContent>
    <TabWrapper $isBackTest={isBackTest}>
      <MoveTabList
        tabIndex={tabIndex}
        tabList={tabList}
      />
      <IconBase onClick={() => setIsShowDeepThink(false)} className="icon-chat-close" />
    </TabWrapper>
    {tabIndex === 0 && <ThinkList thoughtList={thoughtContentList} />}
    {tabIndex === 1 && <Sources sourceList={sourceListDetails} />}
    {tabIndex === 2 && <Highlights className="scroll-style">
      <Markdown>
        {content}
      </Markdown>
    </Highlights>}
  </DeepThinkInnerContent>
}
