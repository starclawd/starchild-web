import { ANI_DURATION } from 'constants/index'
import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'

import defaultImg from 'assets/png/default.png'
import type { LazyImageProps, ObjectFitType, ObjectPositionType } from './types'

export type { LazyImageProps, ObjectFitType, ObjectPositionType }

// ==================== 样式定义 ====================

const skeletonLoading = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200%);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

interface ContainerStyleProps {
  $width?: string | number
  $height?: string | number
  $aspectRatio?: string
  $borderRadius?: string | number
  $skeletonColor?: string
}

const formatSize = (size?: string | number) => {
  if (typeof size === 'number') return `${size}px`
  return size || '100%'
}

const formatBorderRadius = (radius?: string | number) => {
  if (typeof radius === 'number') return `${radius}px`
  return radius || '0'
}

// 占位符容器
const PlaceholderContainer = styled.div<ContainerStyleProps>`
  flex-shrink: 0;
  width: ${({ $width }) => formatSize($width)};
  height: ${({ $height }) => formatSize($height)};
  ${({ $aspectRatio }) =>
    $aspectRatio &&
    css`
      aspect-ratio: ${$aspectRatio};
      height: auto;
    `}
  background: ${({ theme, $skeletonColor }) => $skeletonColor || theme.black900};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: ${({ $borderRadius }) => formatBorderRadius($borderRadius)};
`

interface ImageStyleProps {
  $isLoaded: boolean
  $objectFit?: ObjectFitType
  $objectPosition?: ObjectPositionType
  $transitionDuration?: number
  $transitionTimingFunction?: string
  $blurPreview?: boolean
  $showLowQuality?: boolean
}

const ImageElement = styled.img<ImageStyleProps>`
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit || 'cover'};
  object-position: ${({ $objectPosition }) => $objectPosition || 'center'};
  transition:
    opacity ${({ $transitionDuration }) => $transitionDuration ?? ANI_DURATION}s
      ${({ $transitionTimingFunction }) => $transitionTimingFunction || 'ease-in-out'},
    filter ${({ $transitionDuration }) => $transitionDuration ?? ANI_DURATION}s
      ${({ $transitionTimingFunction }) => $transitionTimingFunction || 'ease-in-out'};
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
  ${({ $blurPreview, $showLowQuality, $isLoaded }) =>
    $blurPreview &&
    $showLowQuality &&
    !$isLoaded &&
    css`
      filter: blur(20px);
      opacity: 1;
    `}
  position: absolute;
  top: 0;
  left: 0;
`

interface BackgroundStyleProps {
  $backgroundImage?: string
  $width?: string | number
  $height?: string | number
  $aspectRatio?: string
  $isLoaded: boolean
  $objectFit?: ObjectFitType
  $objectPosition?: ObjectPositionType
  $borderRadius?: string | number
  $transitionDuration?: number
  $transitionTimingFunction?: string
  $blurPreview?: boolean
  $showLowQuality?: boolean
  $skeletonColor?: string
}

const BackgroundContainer = styled.div<BackgroundStyleProps>`
  flex-shrink: 0;
  width: ${({ $width }) => formatSize($width)};
  height: ${({ $height }) => formatSize($height)};
  ${({ $aspectRatio }) =>
    $aspectRatio &&
    css`
      aspect-ratio: ${$aspectRatio};
      height: auto;
    `}
  background-image: ${({ $backgroundImage }) => ($backgroundImage ? `url(${$backgroundImage})` : 'none')};
  background-size: ${({ $objectFit }) => ($objectFit === 'contain' ? 'contain' : 'cover')};
  background-position: ${({ $objectPosition }) => $objectPosition || 'center'};
  background-repeat: no-repeat;
  background-color: ${({ theme, $skeletonColor }) => $skeletonColor || theme.black900};
  transition:
    opacity ${({ $transitionDuration }) => $transitionDuration ?? ANI_DURATION}s
      ${({ $transitionTimingFunction }) => $transitionTimingFunction || 'ease-in-out'},
    filter ${({ $transitionDuration }) => $transitionDuration ?? ANI_DURATION}s
      ${({ $transitionTimingFunction }) => $transitionTimingFunction || 'ease-in-out'};
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
  ${({ $blurPreview, $showLowQuality, $isLoaded }) =>
    $blurPreview &&
    $showLowQuality &&
    !$isLoaded &&
    css`
      filter: blur(20px);
      opacity: 1;
    `}
  position: relative;
  border-radius: ${({ $borderRadius }) => formatBorderRadius($borderRadius)};
  overflow: hidden;
`

interface SkeletonStyleProps {
  $skeletonHighlightColor?: string
}

// Loading 骨架屏动画
const SkeletonAnimation = styled.div<SkeletonStyleProps>`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme, $skeletonHighlightColor }) => $skeletonHighlightColor || theme.black800},
    transparent
  );
  animation: ${skeletonLoading} 1.5s infinite;
`

// Shimmer 效果
const ShimmerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, ${({ theme }) => theme.black700}40 50%, transparent 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`

// Pulse 效果
const PulseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.black800};
  animation: ${pulse} 2s ease-in-out infinite;
`

// 默认加载组件
const DefaultLoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.black700};
  border-top-color: ${({ theme }) => theme.black400};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

// 默认错误组件
const DefaultErrorComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${({ theme }) => theme.black400};
  font-size: 12px;
  padding: 8px;
  text-align: center;
`

const ErrorIcon = styled.span`
  font-size: 24px;
  opacity: 0.5;
`

// ==================== 组件实现 ====================

const LazyImage = memo(function LazyImage({
  src,
  fallbackSrc = defaultImg,
  placeholder,
  width,
  height,
  aspectRatio,
  threshold = 100,
  rootMargin,
  asBackground = false,
  onLoad,
  onError,
  showSkeleton = true,
  skeletonColor,
  skeletonHighlightColor,
  objectFit = 'cover',
  objectPosition = 'center',
  borderRadius,
  eager = false,
  retryCount = 0,
  retryDelay = 1000,
  loadingTimeout,
  errorComponent,
  transitionDuration,
  transitionTimingFunction,
  blurPreview = false,
  lowQualitySrc,
  srcSet,
  sizes,
  crossOrigin,
  showLoading = false,
  loadingComponent,
  children,
  className,
  style,
  alt,
  ...rest
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(eager)
  const [showLowQuality, setShowLowQuality] = useState(false)
  const [currentRetry, setCurrentRetry] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSrcRef = useRef<string | undefined>(undefined)

  // 计算 rootMargin，确保格式正确
  const computedRootMargin = useMemo(() => {
    if (rootMargin) {
      // 如果传入了 rootMargin，验证格式
      const isValidFormat = /^-?\d+(\.\d+)?(px|%)(\s+-?\d+(\.\d+)?(px|%)){0,3}$/.test(rootMargin.trim())
      if (isValidFormat) {
        return rootMargin
      }
      // 如果格式无效，尝试添加 px 单位
      const numValue = parseFloat(rootMargin)
      if (!isNaN(numValue)) {
        return `${numValue}px`
      }
    }
    // 使用 threshold 默认值
    return `${threshold}px`
  }, [rootMargin, threshold])

  // 清理定时器
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  // 处理图片加载成功
  const handleLoad = useCallback(() => {
    clearTimeouts()
    setIsLoaded(true)
    setIsError(false)
    onLoad?.()
  }, [onLoad, clearTimeouts])

  // 处理图片加载失败
  const handleError = useCallback(() => {
    clearTimeouts()

    // 重试逻辑
    if (currentRetry < retryCount && imageSrc !== fallbackSrc) {
      retryTimeoutRef.current = setTimeout(() => {
        setCurrentRetry((prev) => prev + 1)
        // 强制重新加载
        setImageSrc(undefined)
        setTimeout(() => {
          setImageSrc(src)
        }, 50)
      }, retryDelay)
      return
    }

    setIsError(true)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
    onError?.(new Error('Image failed to load'))
  }, [fallbackSrc, imageSrc, onError, clearTimeouts, currentRetry, retryCount, retryDelay, src])

  // 当 src 改变时，重置状态以重新加载新图片
  useEffect(() => {
    if (prevSrcRef.current !== undefined && prevSrcRef.current !== src) {
      setIsLoaded(false)
      setIsError(false)
      setCurrentRetry(0)
      setShowLowQuality(false)
      setImageSrc(undefined)
    }
    prevSrcRef.current = src
  }, [src])

  // 加载低质量占位图
  useEffect(() => {
    if (blurPreview && lowQualitySrc && isInView && !showLowQuality) {
      const img = new Image()
      img.src = lowQualitySrc
      img.onload = () => {
        setShowLowQuality(true)
        setImageSrc(lowQualitySrc)
      }
    }
  }, [blurPreview, lowQualitySrc, isInView, showLowQuality])

  // 使用 IntersectionObserver 检测元素是否进入视口
  useEffect(() => {
    if (eager || !containerRef.current) return

    let observer: IntersectionObserver | null = null

    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true)
            observer?.disconnect()
          }
        },
        {
          rootMargin: computedRootMargin,
          threshold: 0,
        },
      )

      observer.observe(containerRef.current)
    } catch (error) {
      // 如果 IntersectionObserver 创建失败（例如 rootMargin 格式无效），直接设置为可见
      console.warn('LazyImage: IntersectionObserver creation failed, loading immediately', error)
      setIsInView(true)
    }

    return () => {
      observer?.disconnect()
    }
  }, [computedRootMargin, isInView, eager])

  // 当元素进入视口时开始加载图片
  useEffect(() => {
    if (!isInView || !src) return

    // 如果已经加载完成或者正在显示低质量图，且不是高清图源，跳过
    if (isLoaded && imageSrc === src) return

    // 如果正在显示低质量占位图，继续加载高清图
    const shouldLoadHighQuality = showLowQuality || !imageSrc || imageSrc === fallbackSrc

    if (shouldLoadHighQuality) {
      // 预加载图片
      const img = new Image()

      if (crossOrigin) {
        img.crossOrigin = crossOrigin
      }

      // 设置加载超时
      if (loadingTimeout) {
        timeoutRef.current = setTimeout(() => {
          img.src = '' // 取消加载
          handleError()
        }, loadingTimeout)
      }

      img.onload = () => {
        setImageSrc(src)
        setShowLowQuality(false)
        handleLoad()
      }

      img.onerror = () => {
        handleError()
      }

      img.src = src
    }
  }, [
    isInView,
    src,
    imageSrc,
    handleLoad,
    handleError,
    showLowQuality,
    fallbackSrc,
    isLoaded,
    crossOrigin,
    loadingTimeout,
  ])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [clearTimeouts])

  // 渲染骨架屏/加载状态
  const renderLoadingState = () => {
    if (isLoaded) return null

    return (
      <>
        {showSkeleton && <SkeletonAnimation $skeletonHighlightColor={skeletonHighlightColor} />}
        {showLoading && (loadingComponent || <DefaultLoadingSpinner />)}
        {placeholder}
      </>
    )
  }

  // 渲染错误状态
  const renderErrorState = () => {
    if (!isError || imageSrc === fallbackSrc) return null

    if (errorComponent) {
      return errorComponent
    }

    return (
      <DefaultErrorComponent>
        <ErrorIcon>⚠️</ErrorIcon>
        <span>加载失败</span>
      </DefaultErrorComponent>
    )
  }

  // 背景图片模式
  if (asBackground) {
    return (
      <BackgroundContainer
        ref={containerRef}
        $backgroundImage={imageSrc}
        $width={width}
        $height={height}
        $aspectRatio={aspectRatio}
        $isLoaded={isLoaded}
        $objectFit={objectFit}
        $objectPosition={objectPosition}
        $borderRadius={borderRadius}
        $transitionDuration={transitionDuration}
        $transitionTimingFunction={transitionTimingFunction}
        $blurPreview={blurPreview}
        $showLowQuality={showLowQuality}
        $skeletonColor={skeletonColor}
        className={className}
        style={style}
      >
        {renderLoadingState()}
        {renderErrorState()}
        {children}
      </BackgroundContainer>
    )
  }

  // 普通 img 标签模式
  return (
    <PlaceholderContainer
      ref={containerRef}
      $width={width}
      $height={height}
      $aspectRatio={aspectRatio}
      $borderRadius={borderRadius}
      $skeletonColor={skeletonColor}
      className={className}
      style={style}
    >
      {renderLoadingState()}
      {renderErrorState()}
      {imageSrc && (
        <ImageElement
          ref={imageRef}
          src={imageSrc}
          srcSet={isLoaded ? srcSet : undefined}
          sizes={isLoaded ? sizes : undefined}
          crossOrigin={crossOrigin}
          $isLoaded={isLoaded}
          $objectFit={objectFit}
          $objectPosition={objectPosition}
          $transitionDuration={transitionDuration}
          $transitionTimingFunction={transitionTimingFunction}
          $blurPreview={blurPreview}
          $showLowQuality={showLowQuality}
          onLoad={handleLoad}
          onError={handleError}
          alt={alt}
          {...rest}
        />
      )}
      {children}
    </PlaceholderContainer>
  )
})

export default LazyImage
