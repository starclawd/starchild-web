import { IconBase } from 'components/Icons';
import { vm } from 'pages/helper';
import React, { ReactNode, useCallback } from 'react';
import { toast, ToastOptions, Id, ToastContentProps, ToastContainer } from 'react-toastify';
import { useIsMobile } from 'store/application/hooks';
import styled, { css } from 'styled-components';

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
  .holominds-toast {
    width: auto;
    background-color: transparent;
    padding: 0;
    margin-bottom: 12px;
    min-height: unset;
  }
  ${({ theme }) => theme.isMobile && css`
    top: 0;
    .holominds-toast {
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
  min-height: 68px;
  border-radius: 36px;
  padding: 12px;
  background-color: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.bgT30};
  box-shadow: 0px 4px 4px 0px  ${({ theme }) => theme.systemShadow};
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    width: ${vm(406)};
    min-height: ${vm(68)};
    border-radius: ${vm(36)};
    padding: ${vm(12)};
  `}
`

const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  margin-right: 4px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bgT20};
  i {
    font-size: 24px;
  }
  ${({ theme }) => theme.isMobile && css`
    margin-right: ${vm(4)};
    width: ${vm(44)};
    height: ${vm(44)};
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
  width: 300px;
  .title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  .description {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(300)};
    .title {
      font-size: 0.16rem;
      line-height: 0.24rem;
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
  }
  .icon-chat-complete {
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-close {
    color: ${({ theme }) => theme.ruby50};
  }
  ${({ theme }) => theme.isMobile && css`
    i {
      font-size: 0.18rem;
    }
  `}
`

function ToastContent({ data }: { data: {
  title: ReactNode,
  description: ReactNode,
  status: TOAST_STATUS,
  typeIcon: string,
  iconTheme: string
} }) {
  const { title, description, status, typeIcon, iconTheme } = data
  return <ToastContentWrapper>
    <TypeWrapper>
      <IconBase className={typeIcon} style={{ color: iconTheme }} />
    </TypeWrapper>
    <Content>
      <span className='title'>{title}</span>
      <span className='description'>{description}</span>
    </Content>
    <StatusWrapper>
    {
      status === TOAST_STATUS.LOADING
      ? <IconBase className='icon-loading' />
      : status === TOAST_STATUS.SUCCESS
      ? <IconBase className='icon-chat-complete' />
      : <IconBase className='icon-chat-close' />
    }
    </StatusWrapper>
  </ToastContentWrapper>
}

export default function useToast () {
  const isMobile = useIsMobile()
  return useCallback(({
    title,
    description,
    status,
    typeIcon,
    iconTheme
  }: {
    title: ReactNode,
    description: ReactNode,
    status: TOAST_STATUS,
    typeIcon: string
    iconTheme: string
  }
  ): Id => {
    return toast(ToastContent, {
      data: {
        title,
        description,
        status,
        typeIcon,
        iconTheme
      },
      position: isMobile ? 'top-center' : 'top-right',
      autoClose: 3000,
      closeButton: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      className: 'holominds-toast',
    });
  }, [isMobile])
}
// Toast函数