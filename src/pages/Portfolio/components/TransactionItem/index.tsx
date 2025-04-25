import { IconBase } from 'components/Icons'
import { useCallback } from 'react'
import styled from 'styled-components'


const TransactionItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
`

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bgL2};
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
`

const TypeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  .type-info-top {
    display: flex;
    align-items: center;
    gap: 2px;
    > span:first-child {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      span:first-child {
        color: ${({ theme }) => theme.textL3}
      }
      span:last-child {
        color: ${({ theme }) => theme.textL1}
      }
    }
    > span:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 18px;
      border-radius: 4px;
      padding: 0 6px;
      font-size: 10px;
      font-weight: 500;
      line-height: 14px; 
      color: ${({ theme }) => theme.textL2};
      background-color: ${({ theme }) => theme.textL6};
    }
    
  }
  .status-info {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
`

const ItemRight = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 2px;
  .tx-amount {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    span:first-child {
      color: ${({ theme }) => theme.textL1}
    }
    span:last-child {
      color: ${({ theme }) => theme.textL3}
    }
  }
  .tx-time {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4}
  }
`

export default function TransactionItem({
  data,
  onClick
}: {
  data: any
  onClick: (tx: string) => void
}) {
  const handleClick = useCallback(() => {
    onClick('23223')
  }, [onClick])
  return  <TransactionItemWrapper
    key={data.id}
    onClick={handleClick}
  >
    <ItemLeft>
      <IconWrapper>
        <IconBase className="icon-send" />
      </IconWrapper>
      <TypeInfo>
        <span className="type-info-top">
          <span>
            <span>Send</span>
            <span>ETH</span>
          </span>
          <span>Ethereum</span>
        </span>
        <span className="status-info">Confirmed</span>
      </TypeInfo>
    </ItemLeft>
    <ItemRight>
      <span className="tx-amount">
        <span>-1.08</span>
        <span>ETH</span>
      </span>
      <span className="tx-time">2025-04-03 12:43:59</span>
    </ItemRight>
  </TransactionItemWrapper>
}
