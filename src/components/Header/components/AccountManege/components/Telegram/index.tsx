import styled, { css } from 'styled-components'
import Icon from '../Icon'
import { useUserInfo } from 'store/login/hooks'
import { useCallback } from 'react'
import { getTgLoginUrl } from 'store/login/utils'
import { useCurrentRouter } from 'store/application/hooks'

const TelegramWrapper = styled.div`
  display: flex;
`

const TgName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

export default function Telegram() {
  const [currentRouter] = useCurrentRouter()
  const [{ telegramUserName }] = useUserInfo()
  const telegramUserId = ''
  const handleTelegramBind = useCallback(() => {
    try {
      if (!telegramUserId) {
        window.location.href = getTgLoginUrl(currentRouter)
      }
    } catch (error) {
      console.error('Telegram 绑定错误:', error)
    }
  }, [telegramUserId, currentRouter])
  return (
    <TelegramWrapper onClick={handleTelegramBind}>
      {!telegramUserId ? (
        <Icon iconName='icon-chat-upload' />
      ) : (
        <TgName>
          @{telegramUserName}({telegramUserId})
        </TgName>
      )}
    </TelegramWrapper>
  )
}
