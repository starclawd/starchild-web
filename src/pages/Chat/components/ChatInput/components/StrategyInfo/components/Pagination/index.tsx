import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 18px;
`

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
    color: ${({ theme }) => theme.black300};
  }
`

const Operator = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
`

const GoPrevious = styled.div<{ $disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  cursor: pointer;
  .icon-arrow {
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black100};
    transform: rotate(-90deg);
  }

  ${({ $disabled, theme }) =>
    $disabled
      ? css`
          cursor: not-allowed;
          .icon-arrow {
            color: ${theme.black600};
          }
        `
      : css`
          &:hover {
            .icon-arrow {
              color: ${({ theme }) => theme.black0};
            }
          }
        `}
`

const GoNext = styled(GoPrevious)<{ $disabled?: boolean }>`
  border-left: none;
  border-right: none;
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
  const goPrevious = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setCurrentIndex(Math.max(0, currentIndex - 1))
    },
    [currentIndex, setCurrentIndex],
  )

  const goNext = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setCurrentIndex(Math.min(total - 1, currentIndex + 1))
    },
    [total, currentIndex, setCurrentIndex],
  )
  return (
    <PaginationWrapper>
      <IndexInfo>
        <span>{(currentIndex + 1).toString().padStart(2, '0')}&nbsp;</span>
        <span>/&nbsp;{total.toString().padStart(2, '0')}</span>
      </IndexInfo>
      <Operator>
        <GoPrevious $disabled={currentIndex === 0} onClick={goPrevious}>
          <IconBase className='icon-arrow' />
        </GoPrevious>
        <GoNext $disabled={currentIndex === total - 1} onClick={goNext}>
          <IconBase className='icon-arrow' />
        </GoNext>
      </Operator>
    </PaginationWrapper>
  )
})
