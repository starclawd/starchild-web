import { ANI_DURATION } from 'constants/index'
import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import styled, { css } from 'styled-components'

// 占位符样式
const PlaceholderContainer = styled.div<{ $width?: string | number; $height?: string | number }>`
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || '100%')};
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '100%')};
  background: ${({ theme }) => theme.black900};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`

const ImageElement = styled.img<{ $isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity ${ANI_DURATION}s ease-in-out;
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
`

const BackgroundContainer = styled.div<{
  $backgroundImage?: string
  $width?: string | number
  $height?: string | number
  $isLoaded: boolean
}>`
  width: ${({ $width }) => (typeof $width === 'number' ? `${$width}px` : $width || '100%')};
  height: ${({ $height }) => (typeof $height === 'number' ? `${$height}px` : $height || '100%')};
  background-image: ${({ $backgroundImage }) => ($backgroundImage ? `url(${$backgroundImage})` : 'none')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity ${ANI_DURATION}s ease-in-out;
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
  position: relative;
`

// Loading骨架屏动画
const SkeletonAnimation = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, ${({ theme }) => theme.bgT20}, transparent);
  animation: skeleton-loading 1.5s infinite;

  @keyframes skeleton-loading {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(200%);
    }
  }
`

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  fallbackSrc?: string
  placeholder?: React.ReactNode
  width?: string | number
  height?: string | number
  threshold?: number // 触发加载的阈值（距离视口的像素）
  rootMargin?: string // IntersectionObserver的rootMargin
  asBackground?: boolean // 是否作为背景图片
  onLoad?: () => void
  onError?: () => void
  showSkeleton?: boolean // 是否显示骨架屏动画
}

const LazyImage = memo(function LazyImage({
  src,
  fallbackSrc,
  placeholder,
  width,
  height,
  threshold = 100,
  rootMargin = `${threshold}px`,
  asBackground = false,
  onLoad,
  onError,
  showSkeleton = true,
  className,
  style,
  ...rest
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // 处理图片加载成功
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // 处理图片加载失败
  const handleError = useCallback(() => {
    setIsError(true)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
    onError?.()
  }, [fallbackSrc, imageSrc, onError])

  // 使用IntersectionObserver检测元素是否进入视口
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
          // 一旦进入视口就停止观察
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold: 0,
      },
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, isInView])

  // 当元素进入视口时开始加载图片
  useEffect(() => {
    if (isInView && src && !imageSrc) {
      // 预加载图片
      const img = new Image()
      img.src = src
      img.onload = () => {
        setImageSrc(src)
        handleLoad()
      }
      img.onerror = () => {
        handleError()
      }
    }
  }, [isInView, src, imageSrc, handleLoad, handleError])

  // 如果是背景图片模式
  if (asBackground) {
    return (
      <BackgroundContainer
        ref={containerRef}
        $backgroundImage={imageSrc}
        $width={width}
        $height={height}
        $isLoaded={isLoaded}
        className={className}
        style={style}
      >
        {!isLoaded && showSkeleton && <SkeletonAnimation />}
        {!isLoaded && placeholder}
      </BackgroundContainer>
    )
  }

  // 普通img标签模式
  return (
    <PlaceholderContainer ref={containerRef} $width={width} $height={height} className={className} style={style}>
      {!isLoaded && showSkeleton && <SkeletonAnimation />}
      {!isLoaded && placeholder}
      {imageSrc && (
        <ImageElement
          ref={imageRef}
          src={imageSrc}
          $isLoaded={isLoaded}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      )}
    </PlaceholderContainer>
  )
})

export default LazyImage
