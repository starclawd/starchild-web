import { ANI_DURATION } from 'constants/index'
import styled, { css } from 'styled-components'

const CheckedLogsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  gap: 20px;
`

const LogItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  transition: background-color ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.black800};
  ${({ theme }) =>
    theme.isMobile
      ? css`
          &:active {
            background-color: ${({ theme }) => theme.black700};
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.black700};
          }
        `}
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.lineDark8};
  &:last-child {
    display: none;
  }
`

export default function CheckedLogs() {
  const logs: any[] = [1, 2, 3]
  return (
    <CheckedLogsWrapper>
      {logs.map((log) => {
        return (
          <>
            <LogItem></LogItem>
            <Line />
          </>
        )
      })}
    </CheckedLogsWrapper>
  )
}
