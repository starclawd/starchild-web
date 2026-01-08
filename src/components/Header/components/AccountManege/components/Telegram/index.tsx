import styled, { css } from 'styled-components'
import { useUserInfo } from 'store/login/hooks'
import { useCallback } from 'react'
import { openTelegramLoginWindow } from 'store/login/utils'
import { useCurrentRouter } from 'store/application/hooks'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'

const TelegramWrapper = styled.div`
  display: flex;
  .icon-menu-chat {
    cursor: pointer;
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
    &:hover {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const TgName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

export default function Telegram() {
  const currentRouter = useCurrentRouter()
  const [{ telegramUserId, telegramUsername }] = useUserInfo()
  const handleTelegramBind = useCallback(() => {
    try {
      if (!telegramUserId) {
        // 在新窗口中打开 Telegram 绑定页面
        openTelegramLoginWindow(currentRouter, 'telegram-bind')
      }
    } catch (error) {
      console.error('Telegram 绑定错误:', error)
    }
  }, [telegramUserId, currentRouter])
  return (
    <TelegramWrapper onClick={handleTelegramBind}>
      {!telegramUserId ? (
        <IconBase className='icon-menu-chat' />
      ) : (
        <TgName>
          @{telegramUsername}({telegramUserId})
        </TgName>
      )}
    </TelegramWrapper>
  )
}
