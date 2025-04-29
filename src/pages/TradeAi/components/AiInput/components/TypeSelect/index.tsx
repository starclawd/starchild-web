import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Popover from 'components/Popover'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useCallback, useMemo, useState } from 'react'
import { useAiStyleType } from 'store/tradeaicache/hooks'
import { AI_STYLE_TYPE } from 'store/tradeaicache/tradeaicache.d'
import styled, { css } from 'styled-components'

const TypeSelectWrapper = styled.div`
  display: flex;
  height: 24px;
`

const ValueWrapper = styled.div<{ $showSelect: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.textL5};
  cursor: pointer;
  .icon-style-type {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  span {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  .icon-chat-expand-down {
    font-size: 14px;
    color: ${({ theme }) => theme.textL1};
    transform: rotate(180deg);
    transition: transform ${ANI_DURATION}s;
    ${({ $showSelect }) => $showSelect && css`
      transform: rotate(0);
    `}
  }
`

const TypeSelectContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  height: auto;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL0};
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    border: none;
    background-color: transparent;
  `}
`

const Title = styled.div`
  display: flex;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px; 
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(8)} ${vm(20)};
    font-size: 0.20rem;
    line-height: 0.28rem; 
  `}
`

const DataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    padding: ${vm(12)} ${vm(20)} ${vm(20)};
  `}
`

const DataItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 6px 12px;
  border-radius: 12px;
  span {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px; 
    color: ${({ theme }) => theme.textL1};
  }
  .icon-chat-complete {
    font-size: 14px;
    color: ${({ theme }) => theme.jade10};
  }
  ${({ theme }) => theme.isMobile
  ? css`
    height: ${vm(36)};
    padding: ${vm(6)} ${vm(12)};
    span {
      font-size: 0.16rem;
      line-height: 0.24rem;
    }
    .icon-chat-complete {
      font-size: 0.14rem;
    }
  ` : css`
    cursor: pointer;
  `}
  ${({ $isActive }) => $isActive && css`
    background-color: ${({ theme }) => theme.bgL2};
  `}
`

export function TypeSelectContent({ onClose }: { onClose?: () => void }) {
  const [aiStyleType, setAiStyleType] = useAiStyleType()
  const dataList = useMemo(() => {
    return [
      {
        label: t`Normal`,
        value: AI_STYLE_TYPE.NORMAL,
      },
      {
        label: t`Concise`,
        value: AI_STYLE_TYPE.CONCISE,
      },
      {
        label: t`Explanatory`,
        value: AI_STYLE_TYPE.EXPLANATORY,
      },
    ]
  }, [])
  const handleClick = useCallback((value: AI_STYLE_TYPE) => {
    return () => {
      setAiStyleType(value)
      onClose?.()
    }
  }, [onClose, setAiStyleType])
  return <TypeSelectContentWrapper>
    <Title><Trans>Setting</Trans></Title>
    <DataList>
      {dataList.map((item) => {
        const { label, value } = item
        const isActive = aiStyleType === value
        return <DataItem $isActive={isActive} key={value} onClick={handleClick(value)}>
          <span>{label}</span>
          {isActive && <IconBase className="icon-chat-complete" />}
        </DataItem>
      })}
    </DataList>
  </TypeSelectContentWrapper>
}

export default function TypeSelect() {
  const [showSelect, setShowSelect] = useState(false)
  const [aiStyleType] = useAiStyleType()
  const styleMap = useMemo(() => {
    return {
      [AI_STYLE_TYPE.NORMAL]: t`Normal`,
      [AI_STYLE_TYPE.CONCISE]: t`Concise`,
      [AI_STYLE_TYPE.EXPLANATORY]: t`Explanatory`,
    }
  }, [])  
  const changeShowSelect = useCallback(() => {
    setShowSelect(!showSelect)
  }, [showSelect])
  return <TypeSelectWrapper onClick={changeShowSelect}>
    <Popover
      placement="top-end"
      show={showSelect}
      onClickOutside={() => setShowSelect(false)}
      offsetTop={0}
      offsetLeft={0}
      content={<TypeSelectContent />}
    >
      <ValueWrapper $showSelect={showSelect}>
        <IconBase className="icon-style-type" />
        <span>{styleMap[aiStyleType]}</span>
        <IconBase className="icon-chat-expand-down" />
      </ValueWrapper>
    </Popover>
  </TypeSelectWrapper>
}
