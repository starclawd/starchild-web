import { memo, useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { SourceListDetailsDataType } from 'store/chat/chat.d'
import { getFaviconUrl } from 'utils/common'
import { vm } from 'pages/helper'

const FaviconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const FaviconIcon = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  flex-shrink: 0;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(18)};
      height: ${vm(18)};
      border-radius: ${vm(4)};
    `}
`

interface FaviconListProps {
  sourceList: SourceListDetailsDataType[]
  maxCount?: number
}

const FaviconList = memo(function FaviconList({ sourceList, maxCount = 3 }: FaviconListProps) {
  const [loadedFavicons, setLoadedFavicons] = useState<string[]>([])

  const handleImageLoad = useCallback(
    (url: string) => {
      setLoadedFavicons((prev) => {
        if (!prev.includes(url) && prev.length < maxCount) {
          return [...prev, url]
        }
        return prev
      })
    },
    [maxCount],
  )

  const handleImageError = useCallback((url: string) => {
    // 如果图标加载失败，从列表中移除
    setLoadedFavicons((prev) => prev.filter((item) => item !== url))
  }, [])

  useEffect(() => {
    // 重置已加载的 favicon 列表
    setLoadedFavicons([])

    // 获取所有不重复的 favicon URL，作为候选列表
    const uniqueUrls = Array.from(new Set(sourceList.map((item) => getFaviconUrl(item.id)).filter((url) => url !== '')))

    // 预加载图标，直到加载成功 maxCount 个为止
    uniqueUrls.forEach((url) => {
      const img = new Image()
      img.onload = () => handleImageLoad(url)
      img.onerror = () => handleImageError(url)
      img.src = url
    })
  }, [sourceList, maxCount, handleImageLoad, handleImageError])

  if (loadedFavicons.length === 0) {
    return null
  }

  return (
    <FaviconWrapper>
      {loadedFavicons.map((url) => (
        <FaviconIcon key={url} src={url} alt='' />
      ))}
    </FaviconWrapper>
  )
})

export default FaviconList
