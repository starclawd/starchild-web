import { IconBase } from 'components/Icons'
import { memo } from 'react'
import styled, { css } from 'styled-components'

const TagItemWrapper = styled.div<{ $size: 'big' | 'small'; $color: string }>`
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  ${({ $size }) =>
    $size === 'small' &&
    css`
      height: 20px;
    `}

  .icon-tag-border {
    font-size: 20px;
    color: ${({ $color }) => $color};
    &.small {
      position: absolute;
      left: -5px;
      top: 0;
    }
  }
  .tag-text {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 6px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ $color }) => $color};
    background-color: #27130c;
  }
  ${({ $size }) =>
    $size === 'big' &&
    css`
      height: 32px;
      .icon-tag-border {
        font-size: 32px;
      }
      .tag-text {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        padding: 0 12px;
      }
    `}
`

export default memo(function TagItem({ color, text, size }: { color: string; text: string; size: 'big' | 'small' }) {
  return (
    <TagItemWrapper $size={size} $color={color}>
      {size === 'small' && <IconBase className='icon-tag-border small' />}
      <IconBase className='icon-tag-border' />
      <span className='tag-text'>{text}</span>
    </TagItemWrapper>
  )
})
