import styled, { css } from 'styled-components'
import { memo, useRef, useEffect, useState, ReactNode } from 'react'
import { vm } from 'pages/helper'

interface AdaptiveTextContentProps {
  title: ReactNode
  description: ReactNode
  titleComponent?: any
  descriptionComponent?: any
  className?: string
}

const DefaultContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DefaultTitle = styled.h4`
  font-size: 18px;
  line-height: 26px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-align: left;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
      line-height: ${vm(26)};
    `}
`

const DefaultDescription = styled.p<{ $lineClamp?: number }>`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL3};
  margin: 0;
  text-align: left;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: ${({ $lineClamp = 2 }) => $lineClamp};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
    `}
`

export default memo(function AdaptiveTextContent({
  title,
  description,
  titleComponent: TitleComponent = DefaultTitle,
  descriptionComponent: DescriptionComponent = DefaultDescription,
  className,
}: AdaptiveTextContentProps) {
  const titleRef = useRef<HTMLElement>(null)
  const [descriptionLineClamp, setDescriptionLineClamp] = useState(2)

  useEffect(() => {
    // Check title line count and adjust description line clamp accordingly
    if (titleRef.current) {
      const checkTitleLines = () => {
        const element = titleRef.current
        if (element) {
          const lineHeight = parseInt(window.getComputedStyle(element).lineHeight)
          const height = element.scrollHeight
          const lines = Math.round(height / lineHeight)

          // If title shows 2 lines, description should only show 1 line
          if (lines >= 2) {
            setDescriptionLineClamp(1)
          } else {
            setDescriptionLineClamp(2)
          }
        }
      }

      // Initial check
      checkTitleLines()
    }
  }, [title])

  return (
    <DefaultContainer className={className}>
      <TitleComponent ref={titleRef}>{title}</TitleComponent>
      <DescriptionComponent $lineClamp={descriptionLineClamp}>{description}</DescriptionComponent>
    </DefaultContainer>
  )
})
