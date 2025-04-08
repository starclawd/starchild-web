import Markdown from 'react-markdown'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import TransitionWrapper from 'components/TransitionWrapper'
import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ANI_DURATION } from 'constants/index'
import { useIsLoadingData } from 'store/tradeai/hooks'
import styled, { css } from 'styled-components'

const ThoughtListWrapper = styled.div<{ isShowThought: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  ${({ isShowThought }) => !isShowThought && css`
    margin-bottom: 0;
  `}
`
const ThoughtHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 28px;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text4};
`

const Left = styled.div<{ isShowThought: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  .icon-arrow {
    transition: all ${ANI_DURATION}s;
    display: inline-block;
    transform: rotate(-90deg);
  }
  ${({ isShowThought }) => !isShowThought && css`
    .icon-arrow {
      transform: rotate(90deg);
    }
  `}
`

const Right = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px; 
  height: 28px;
  padding: 0 8px;
  border-radius: 8px;
  color: ${({ theme }) => theme.text3};
  background-color: ${({ theme }) => theme.bg10};
`

const ArrowWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 100%;
  .icon-arrow {
    transition: all ${ANI_DURATION}s;
    cursor: pointer;
    font-size: 10px;
  }
  &:first-child {
    .icon-arrow {
      transform: rotate(180deg);
    }
  }
  &:hover {
    .icon-arrow {
      color: ${({ theme }) => theme.green};
    }
  }
`

const ThoughtListContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 8px 10px 14px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg10};
`

const ThoughtList = styled.div`
  display: flex;
  flex-direction: column;
`

const ThoughtItem = styled.div`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${({ theme }) => theme.text4};
  pre {
    padding: 0 !important;
    margin-top: 0 !important;
    white-space: break-spaces;
    background-color: unset !important;
  }
`

export default memo(function ThoughtContent({
  content,
  thoughtContent,
  observationContent,
  isTempAiContent,
  contentInnerRef,
  shouldAutoScroll,
}: {
  content: string
  thoughtContent: string
  isTempAiContent: boolean
  observationContent: string
  contentInnerRef?: RefObject<HTMLDivElement>
  shouldAutoScroll?: boolean
}) {
  const thoughtListWrapperRef = useRef<HTMLDivElement>(null)
  const [stepIndex, setStepIndex] = useState(1)
  const [isShowThought, setIsShowThought] = useState(false)
  const [isLoading] = useIsLoadingData()
  const keys = useMemo(() => {
    return ['news_agent', 'price_agent', 'technical_agent', 'education_agent', 'twitter_sentiment_agent', 'product_agent']
  }, [])
  const agentNameList = useMemo(() => {
    return {
      news_agent: 'News Agent',
      price_agent: 'Price Agent',
      technical_agent: 'Technical Agent', 
      education_agent: 'Education Agent',
      twitter_sentiment_agent: 'Twitter Sentiment Agent',
      product_agent: 'Product Agent'
    }
  }, [])
  const thoughtContentList = useMemo(() => {
    if (observationContent) {
      return observationContent.split('\nPREFIX\n').map((item, index) => {
        try {
          const parsed = JSON.parse(item)
          if (Array.isArray(parsed)) {
            return parsed.map((text, i) => (
              <Markdown key={`${index}-${i}`}>{text}</Markdown>
            ))
          } else if (typeof parsed === 'object') {
            return Object.entries(parsed).map(([key, value], i) => (
              <div key={`${index}-${i}`}>
                <span>{key}: </span>
                {typeof value === 'object' ? <pre>{JSON.stringify(value, null, 2).replace(/[{}"]/g, '')}</pre> : <Markdown>{String(value)}</Markdown>}
              </div>
            ))
          }
        } catch (error) {
          return item ? <Markdown key={index}>{item}</Markdown> : ''
        }
        return ''
      }).filter(item => !!item)
    }
    return thoughtContent.split('\nPREFIX\n')
  }, [thoughtContent, observationContent])
  const changeThoughtState = useCallback(() => {
    setIsShowThought(!isShowThought)
  }, [isShowThought])
  const lastAgent = useMemo(() => {
    const foundAgents: string[] = []
    let pos = 0
    while (pos < thoughtContent.length) {
      const nextAgent = keys.find(key => (thoughtContent.toLowerCase()).indexOf(key, pos) === pos)
      if (nextAgent) {
        foundAgents.push(nextAgent)
        pos += nextAgent.length
      } else {
        pos++
      }
    }
    if (foundAgents.length > 0 && (isLoading || !content)) {
      const text = [...new Set(foundAgents.map(key => key.toLowerCase()))].map((key) => agentNameList[key as keyof typeof agentNameList]).join(', ')
      return <Trans>Running the {text}</Trans>
    }
    return ''
  }, [keys, agentNameList, isLoading, content, thoughtContent])
  const goPrevStep = useCallback(() => {
    setStepIndex(Math.max(1, stepIndex - 1))
  }, [stepIndex])
  const goNextStep = useCallback(() => {
    setStepIndex(Math.min(thoughtContentList.length, stepIndex + 1))
  }, [stepIndex, thoughtContentList])
  useEffect(() => {
    setStepIndex(thoughtContentList.length)
  }, [thoughtContentList])

  useEffect(() => {
    if (contentInnerRef?.current) {
      const observer = new ResizeObserver(() => {
        if (shouldAutoScroll) {
          requestAnimationFrame(() => {
            contentInnerRef.current?.scrollTo(0, contentInnerRef.current.scrollHeight)
          })
        }
      })
      if (thoughtListWrapperRef.current) {
        observer.observe(thoughtListWrapperRef.current)
      }
      return () => {
        observer.disconnect()
      }
    }
    return
  }, [contentInnerRef, shouldAutoScroll])

  return <ThoughtListWrapper ref={thoughtListWrapperRef as any} isShowThought={isShowThought}>
    <ThoughtHandle>
      <Left isShowThought={isShowThought} onClick={changeThoughtState}>
        <span>{lastAgent ? lastAgent : <Trans>Thoughts</Trans>}</span>
        <IconBase className="icon-arrow" />
      </Left>
      {(isShowThought && observationContent) && <Right>
        <ArrowWrapper onClick={goPrevStep}>
          <IconBase className="icon-arrow" />
        </ArrowWrapper>
        <span>Step {stepIndex}/{thoughtContentList.length}</span>
        <ArrowWrapper onClick={goNextStep}>
          <IconBase className="icon-arrow" />
        </ArrowWrapper>
      </Right>}
    </ThoughtHandle>
    <TransitionWrapper visible={isShowThought}>
      <ThoughtListContentWrapper>
        <ThoughtList>
          {thoughtContentList.map((item, index) => (
            <ThoughtItem style={{ display: (stepIndex === index + 1 || !observationContent) ? 'inline-block' : 'none' }} key={index}>{item}</ThoughtItem>
          ))}
        </ThoughtList>
      </ThoughtListContentWrapper>
    </TransitionWrapper>
    {/* <TransitionWrapper visible={isShowLatestThought}>
      <ThoughtListContentWrapper>
        <ThoughtList ref={thoughtList1Ref as any} className="ai-thought-list scroll-style">
          <ThoughtListContent ref={thoughtListContent1Ref as any}>
            {[latestThoughtContent].map((item, index) => (
              <ThoughtItem key={index}>{item}</ThoughtItem>
            ))}
          </ThoughtListContent>
        </ThoughtList>
      </ThoughtListContentWrapper>
    </TransitionWrapper> */}
  </ThoughtListWrapper>
})
