import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { ReactNode, useCallback } from 'react'
import { toast, Id, ToastContainer } from 'react-toastify'
import { useIsMobile } from 'store/application/hooks'
import styled, { css } from 'styled-components'
import { rotate } from 'styles/animationStyled'

export enum TOAST_STATUS {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
}

export enum TOAST_TYPE {
  OPEN_NOTIFICATION = 'OPEN_NOTIFICATION',
  CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION',
}

export const StyledToastContent = styled(ToastContainer)`
  top: 88px;
  right: 20px;
  .starchild-toast {
    width: auto;
    background-color: transparent;
    padding: 0;
    margin-bottom: 12px;
    min-height: unset;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      top: 0;
      .starchild-toast {
        width: 100%;
        justify-content: center;
      }
    `}
`

const ToastContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 406px;
  min-height: 58px;
  border-radius: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.black700};
  border: 1px solid ${({ theme }) => theme.bgT20};
  box-shadow: 0px 4px 4px 0px ${({ theme }) => theme.systemShadow};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      width: ${vm(350)};
      min-height: ${vm(58)};
      border-radius: ${vm(12)};
      padding: ${vm(12)};
    `}
`

const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 4px;
  i {
    font-size: 24px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-right: ${vm(4)};
      width: ${vm(24)};
      height: ${vm(24)};
      i {
        font-size: 0.24rem;
      }
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex-grow: 1;
  width: 300px;
  gap: 4px;
  .title {
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  .description {
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      width: ${vm(244)};
      .title {
        font-size: 0.14rem;
        line-height: 0.2rem;
      }
      .description {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  i {
    font-size: 18px;
  }
  .icon-loading {
    color: ${({ theme }) => theme.brand6};
    animation: ${rotate} 1s linear infinite;
  }
  .icon-chat-complete {
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-close {
    color: ${({ theme }) => theme.ruby50};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      i {
        font-size: 0.18rem;
      }
    `}
`

function ToastContent({
  data,
}: {
  data: {
    title: ReactNode
    description: ReactNode
    status: TOAST_STATUS
    typeIcon: string
    iconTheme: string
  }
}) {
  const { title, description, status, typeIcon, iconTheme } = data
  return (
    <ToastContentWrapper>
      <TypeWrapper>
        <IconBase className={typeIcon} style={{ color: iconTheme }} />
      </TypeWrapper>
      <Content>
        <span className='title'>{title}</span>
        <span className='description'>{description}</span>
      </Content>
      <StatusWrapper>
        {status === TOAST_STATUS.LOADING ? (
          <IconBase className='icon-loading' />
        ) : status === TOAST_STATUS.SUCCESS ? (
          <IconBase className='icon-chat-complete' />
        ) : (
          <IconBase className='icon-chat-close' />
        )}
      </StatusWrapper>
    </ToastContentWrapper>
  )
}

export default function useToast() {
  const isMobile = useIsMobile()
  return useCallback(
    ({
      title,
      description,
      status,
      typeIcon,
      iconTheme,
      autoClose = 3000,
    }: {
      title: ReactNode
      description: ReactNode
      status: TOAST_STATUS
      typeIcon: string
      iconTheme: string
      autoClose?: number
    }): Id => {
      return toast(ToastContent, {
        data: {
          title,
          description,
          status,
          typeIcon,
          iconTheme,
        },
        position: isMobile ? 'top-center' : 'top-right',
        autoClose,
        closeButton: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        className: 'starchild-toast',
      })
    },
    [isMobile],
  )
}
// Toast函数
