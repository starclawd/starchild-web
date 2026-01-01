import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

const IndexInfo = styled.div`
  position: relative;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  z-index: 2;
  span:first-child {
    color: ${({ theme }) => theme.brand100};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL4};
  }
`

const Operator = styled.div`
  position: relative;
  position: absolute;
  display: flex;
  align-items: center;
  right: 0;
  bottom: 0;
  z-index: 2;
`

const GoPrevious = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  .icon-arrow {
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.textL3};
    transform: rotate(-90deg);
  }
  &:hover {
    .icon-arrow {
      color: ${({ theme }) => theme.textL1};
    }
  }
  border-left: 1px solid ${({ theme }) => theme.black600};
  border-top: 1px solid ${({ theme }) => theme.black600};
  border-right: 1px solid ${({ theme }) => theme.black600};
`

const GoNext = styled(GoPrevious)`
  border-left: none;
  border-right: none;
  border-top: 1px solid ${({ theme }) => theme.black600};
  .icon-arrow {
    transform: rotate(90deg);
  }
`

export default memo(function Pagination({
  currentIndex,
  setCurrentIndex,
  total,
}: {
  currentIndex: number
  setCurrentIndex: (index: number) => void
  total: number
}) {
  const goPrevious = useCallback(() => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }, [currentIndex, setCurrentIndex])

  const goNext = useCallback(() => {
    setCurrentIndex(Math.min(total - 1, currentIndex + 1))
  }, [total, currentIndex, setCurrentIndex])
  return (
    <>
      <IndexInfo>
        <span>{currentIndex + 1}&nbsp;</span>
        <span>/&nbsp;{total}</span>
      </IndexInfo>
      <Operator>
        <GoPrevious onClick={goPrevious}>
          <IconBase className='icon-arrow' />
        </GoPrevious>
        <GoNext onClick={goNext}>
          <IconBase className='icon-arrow' />
        </GoNext>
      </Operator>
    </>
  )
})
