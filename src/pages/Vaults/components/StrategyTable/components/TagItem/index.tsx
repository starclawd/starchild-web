import { IconBase } from 'components/Icons'
import { memo } from 'react'
import styled from 'styled-components'

const TagItemWrapper = styled.div<{ $color: string }>`
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  height: 20px;

  .icon-tag-border {
    font-size: 20px;
    color: ${({ $color }) => $color};
    &.big {
      position: absolute;
      left: -5px;
      top: 0;
    }
  }
  .tag-text {
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
`

export default memo(function TagItem({ color, text, size }: { color: string; text: string; size: 'big' | 'small' }) {
  return (
    <TagItemWrapper $color={color}>
      {size === 'big' && <IconBase className='icon-tag-border big' />}
      <IconBase className='icon-tag-border' />
      <span className='tag-text'>{text}</span>
    </TagItemWrapper>
  )
})
