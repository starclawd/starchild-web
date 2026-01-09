import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Popover from 'components/Popover'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { useAiStyleType, useGetAiStyleType, useUpdateAiStyleType } from 'store/shortcuts/hooks'
import { AI_STYLE_TYPE } from 'store/shortcuts/shortcuts'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'

const TypeSelectWrapper = styled.div`
  display: flex;
`

const ValueWrapper = styled.div<{ $showSelect: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 32px;
  cursor: pointer;
  .icon-style-type {
    font-size: 18px;
    color: ${({ theme }) => theme.black200};
  }
  span {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.black200};
  }
  .icon-chat-expand {
    font-size: 14px;
    transform: rotate(90deg);
    color: ${({ theme }) => theme.black200};
    transition: transform ${ANI_DURATION}s;
  }
  ${({ $showSelect }) =>
    $showSelect &&
    css`
      .icon-chat-expand {
        transform: rotate(270deg);
        color: ${({ theme }) => theme.black0};
      }
      .icon-style-type {
        color: ${({ theme }) => theme.black0};
      }
      span {
        color: ${({ theme }) => theme.black0};
      }
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
      padding: ${vm(3)} ${vm(12)};
      height: ${vm(40)};
      .icon-style-type {
        font-size: 0.18rem;
      }
      span {
        font-size: 0.14rem;
        line-height: 0.2rem;
      }
      .icon-chat-expand {
        font-size: 0.14rem;
      }
    `}
`

const TypeSelectContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  height: auto;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.black800};
  background-color: ${({ theme }) => theme.bgL0};
  ${({ theme }) =>
    theme.isMobile &&
    css`
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
  color: ${({ theme }) => theme.black0};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(20)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const DataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 20px 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
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
    color: ${({ theme }) => theme.black0};
  }
  .icon-chat-complete {
    font-size: 14px;
    color: ${({ theme }) => theme.jade10};
  }
  ${({ theme }) =>
    theme.isMobile
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
        `
      : css`
          cursor: pointer;
        `}
  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: ${({ theme }) => theme.bgL2};
    `}
`

export function TypeSelectContent({ onClose }: { onClose?: () => void }) {
  const theme = useTheme()
  const toast = useToast()
  const [{ userInfoId }] = useUserInfo()
  const [aiStyleType, setAiStyleType] = useAiStyleType()
  const triggerUpdateAiStyleType = useUpdateAiStyleType()
  const dataList = useMemo(() => {
    return [
      {
        label: <Trans>Explanatory</Trans>,
        value: AI_STYLE_TYPE.EXPLANATORY,
      },
      {
        label: <Trans>Concise</Trans>,
        value: AI_STYLE_TYPE.CONCISE,
      },
    ]
  }, [])
  const handleClick = useCallback(
    (value: AI_STYLE_TYPE) => {
      return async () => {
        if (userInfoId) {
          const data = await triggerUpdateAiStyleType({
            aiStyleType: value,
          })
          if ((data as any).isSuccess) {
            toast({
              title: <Trans>Setting successfully</Trans>,
              status: TOAST_STATUS.SUCCESS,
              typeIcon: 'icon-style-type',
              iconTheme: theme.black0,
              description: value === AI_STYLE_TYPE.EXPLANATORY ? <Trans>Explanatory</Trans> : <Trans>Concise</Trans>,
            })
            setAiStyleType(value)
          }
        }
        onClose?.()
      }
    },
    [onClose, setAiStyleType, triggerUpdateAiStyleType, userInfoId, toast, theme],
  )
  return (
    <TypeSelectContentWrapper>
      <Title>
        <Trans>Setting</Trans>
      </Title>
      <DataList>
        {dataList.map((item) => {
          const { label, value } = item
          const isActive = aiStyleType === value
          return (
            <DataItem $isActive={isActive} key={value} onClick={handleClick(value)}>
              <span>{label}</span>
              {isActive && <IconBase className='icon-chat-complete' />}
            </DataItem>
          )
        })}
      </DataList>
    </TypeSelectContentWrapper>
  )
}

export default function TypeSelect() {
  const [{ userInfoId }] = useUserInfo()
  const triggerGetAiStyleType = useGetAiStyleType()
  const [showSelect, setShowSelect] = useState(false)
  const [aiStyleType] = useAiStyleType()
  const styleMap = useMemo(() => {
    return {
      [AI_STYLE_TYPE.CONCISE]: <Trans>Concise</Trans>,
      [AI_STYLE_TYPE.EXPLANATORY]: <Trans>Explanatory</Trans>,
    }
  }, [])
  const changeShowSelect = useCallback(() => {
    setShowSelect(!showSelect)
  }, [showSelect])
  useEffect(() => {
    if (userInfoId) {
      triggerGetAiStyleType()
    }
  }, [triggerGetAiStyleType, userInfoId])
  return (
    <TypeSelectWrapper onClick={changeShowSelect}>
      <Popover
        placement='top-end'
        show={showSelect}
        onClickOutside={() => setShowSelect(false)}
        offsetTop={14}
        offsetLeft={16}
        content={<TypeSelectContent />}
      >
        <ValueWrapper $showSelect={showSelect}>
          <IconBase className='icon-style-type' />
          <span>{styleMap[aiStyleType]}</span>
          <IconBase className='icon-chat-expand' />
        </ValueWrapper>
      </Popover>
    </TypeSelectWrapper>
  )
}
