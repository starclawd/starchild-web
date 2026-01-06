import { IconBase } from 'components/Icons'
import { memo, useMemo } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'

const TagItemWrapper = styled.div<{ $size: 'big' | 'small'; $color: string; $backgroundColor: string }>`
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
    background-color: ${({ $backgroundColor }) => $backgroundColor};
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

export default memo(function TagItem({
  colorType,
  text,
  size,
}: {
  colorType: 'brand' | 'blue' | 'purple'
  text: string
  size: 'big' | 'small'
}) {
  const theme = useTheme()
  const dataMap = useMemo(() => {
    return {
      brand: {
        color: theme.brand100,
        backgroundColor: '#27130c',
      },
      blue: {
        color: theme.blue100,
        backgroundColor: '#002713',
      },
      purple: {
        color: theme.purple100,
        backgroundColor: '#271300',
      },
    }
  }, [theme])
  return (
    <TagItemWrapper
      $size={size}
      $color={dataMap[colorType].color}
      $backgroundColor={dataMap[colorType].backgroundColor}
    >
      {size === 'small' && <IconBase className='icon-tag-border small' />}
      <IconBase className='icon-tag-border' />
      <span className='tag-text'>{text}</span>
    </TagItemWrapper>
  )
})
