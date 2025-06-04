import styled, { css } from 'styled-components'
import TabList from '../DeepThink/components/TabList'
import { useEffect, useState } from 'react'
import { IconBase } from 'components/Icons'
import { useCurrentAiContentDeepThinkData, useIsShowDeepThink } from 'store/tradeai/hooks'
import ThinkList from '../DeepThink/components/ThinkList'
import Sources from '../DeepThink/components/Sources'
import Markdown from 'components/Markdown'

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
  useEffect(() => {
    if (isBackTest) {
      setTabIndex(2)
    } else {
      setTabIndex(0)
    }
  }, [isBackTest])
  return <DeepThinkInnerContent>
    <TabWrapper $isBackTest={isBackTest}>
      <TabList
        isBackTest={isBackTest}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        sourceListDetailsLength={sourceListDetails.length}
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
