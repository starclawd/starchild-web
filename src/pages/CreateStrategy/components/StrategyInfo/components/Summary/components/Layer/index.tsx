import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import styled, { css } from 'styled-components'

const LayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: 100%;
`

const Title = styled.div<{ $isLoading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  border-bottom: none;
  background: ${({ theme }) => theme.black700};
  border-radius: 8px 8px 0 0;
  ${({ $isLoading, theme }) =>
    $isLoading &&
    css`
      background: ${theme.brand100};
      border: none;
      .icon-loading {
        color: ${theme.black1000};
      }
    `}
`

const TitleLeft = styled.div<{ $isLoading: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme, $isLoading }) => ($isLoading ? theme.black1000 : theme.textL2)};
  i {
    font-size: 18px;
    color: ${({ theme, $isLoading }) => ($isLoading ? theme.black1000 : theme.textL2)};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  border-top: none;
  border-radius: 0 0 8px 8px;
`

export default function Layer({
  iconCls,
  title,
  children,
  isLoading,
}: {
  iconCls: string
  title: React.ReactNode
  isLoading: boolean
  children: React.ReactNode
}) {
  return (
    <LayerWrapper>
      <Title $isLoading={isLoading}>
        <TitleLeft $isLoading={isLoading}>
          <IconBase className={iconCls} />
          <span>{title}</span>
        </TitleLeft>
        {isLoading && <Pending />}
      </Title>
      <Content>{children}</Content>
    </LayerWrapper>
  )
}
