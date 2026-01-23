import styled, { css } from 'styled-components'
import { memo, useMemo, useRef } from 'react'
import Markdown from 'components/Markdown'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { LOCAL_TEXT } from 'constants/locales'
import productInfoEn from 'assets/documents/product_info.md?raw'
import productInfoCn from 'assets/documents/product_info_cn.md?raw'
import { vm } from 'pages/helper'

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const ContentContainer = styled.div`
  max-width: 1080px;
  margin: 0 auto;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      max-width: 100%;
      margin-bottom: ${vm(20)};
    `}
`

function Content() {
  const activeLocale = useActiveLocale()
  const scrollRef = useRef<HTMLDivElement>(null)

  const documentContent = useMemo(() => {
    return activeLocale === LOCAL_TEXT.CN ? productInfoCn : productInfoEn
  }, [activeLocale])

  return (
    <ContentWrapper ref={scrollRef} className='scroll-style'>
      <ContentContainer>
        <Markdown>{documentContent}</Markdown>
      </ContentContainer>
    </ContentWrapper>
  )
}

export default memo(Content)
