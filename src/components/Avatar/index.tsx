/**
 * 头像组件
 *
 * 功能:
 * 1. 支持显示自定义头像图片
 * 2. 当无头像时显示基于用户名的生成式头像
 * 3. 支持自定义大小
 * 4. 支持暗色/亮色主题切换
 *
 * Props:
 * - size: 头像大小(px),默认28px
 * - name: 用户名(用于生成默认头像)
 * - avatar: 自定义头像图片URL(可选)
 *
 * 使用示例:
 * ```jsx
 * // 使用自定义头像
 * <Avatar
 *   size={40}
 *   name="John Doe"
 *   avatar="https://example.com/avatar.jpg"
 * />
 *
 * // 使用生成式头像
 * <Avatar
 *   name="John Doe"
 * />
 * ```
 */

import { memo } from 'react'
import styled from 'styled-components'
import Avatar from 'boring-avatars'
import { useIsDarkMode } from 'store/themecache/hooks'
import LazyImage from 'components/LazyImage'

// 类型定义
interface AvatarProps {
  size?: number
  name: string
  avatar?: string
}

interface AvatarWrapperProps {
  size: number
}

// 主题颜色配置
const AVATAR_COLORS = {
  dark: ['#5b1d99', '#0074b4', '#00b34c', '#ffd41f', '#fc6e3d'],
  light: ['#5b1d99', '#0074b4', '#00b34c', '#ffd41f', '#fc6e3d'],
}

// 根容器样式
const AvatarWrapper = styled.div<AvatarWrapperProps>`
  display: flex;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
`

// 图片容器样式
const AvatarImgWrapper = styled.div<AvatarWrapperProps>`
  display: flex;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const AvatarComponent = memo(({ size = 28, name, avatar }: AvatarProps) => {
  // 获取当前主题模式
  const isDark = useIsDarkMode()

  // 如果有自定义头像,显示图片
  if (avatar) {
    return (
      <AvatarImgWrapper size={size} className='avatar-img'>
        <LazyImage src={avatar} alt={`${name}'s avatar`} />
      </AvatarImgWrapper>
    )
  }

  // 否则显示生成式头像
  return (
    <AvatarWrapper size={size} className='avatar-wrapper'>
      <Avatar size={size} name={name} variant='beam' colors={isDark ? AVATAR_COLORS.dark : AVATAR_COLORS.light} />
    </AvatarWrapper>
  )
})

AvatarComponent.displayName = 'Avatar'

export default AvatarComponent
