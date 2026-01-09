import React, { useMemo, useState, useEffect, memo, useCallback } from 'react'
import styled, { useTheme } from 'styled-components'
import useToast, { TOAST_STATUS } from 'components/Toast'
import Input, { InputType } from 'components/Input'

const IconsWrapper = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.bgL1};
  min-height: 100vh;
`

const Header = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.black0};
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.black200};
    margin: 0;
  }
`

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  background: ${({ theme }) => theme.bgL2};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.brand100};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.brand100}20;
  }
`

const IconDisplay = styled.i`
  font-size: 32px;
  color: ${({ theme }) => theme.black0};
  margin-bottom: 12px;
`

const IconName = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.black100};
  text-align: center;
  word-break: break-all;
`

const IconCount = styled.div`
  color: ${({ theme }) => theme.black200};
  font-size: 14px;
  margin-top: 16px;
  margin-bottom: 16px;
`

// 获取当前CSS文件路径
const getIconCSSPath = (): string => {
  // 尝试从页面上找到实际加载的CSS文件
  const linkElements = document.querySelectorAll('link[rel="stylesheet"]')
  for (const link of linkElements) {
    const href = (link as HTMLLinkElement).href
    if (href.includes('/icon_fonts/') && href.includes('style')) {
      // 提取相对路径
      const url = new URL(href)
      return url.pathname
    }
  }
  // 开发环境或找不到时的回退
  return '/icon_fonts/style.css'
}

// Extract icon names from CSS file via fetch
const extractIconNamesFromCSS = async (): Promise<string[]> => {
  try {
    const cssPath = getIconCSSPath()
    const response = await fetch(cssPath)
    const cssText = await response.text()

    const iconNames: string[] = []
    const iconRegex = /\.icon-([^:]+):before/g
    let match

    while ((match = iconRegex.exec(cssText)) !== null) {
      if (match[1]) {
        iconNames.push(match[1])
      }
    }
    return [...new Set(iconNames)].sort()
  } catch (error) {
    console.error('Failed to extract icon names via fetch:', error)
    return []
  }
}

// Static fallback list
const getStaticIconNames = (): string[] => {
  return [
    'approve',
    'chart-tool',
    'chat-agent-planing',
    'chat-analyze-agent',
    'chat-arrow-long',
    'chat-arrow-short',
    'chat-back',
    'chat-border-close',
    'chat-close',
    'chat-complete',
    'chat-copy',
    'chat-default-ui',
    'chat-delete',
    'chat-dislike-fill',
    'chat-dislike',
    'chat-expand-down',
    'chat-expand',
    'chat-file',
    'chat-hammer',
    'chat-history',
    'chat-like-fill',
    'chat-like',
    'chat-more',
    'chat-new',
    'chat-noti-disable',
    'chat-noti-enable',
    'chat-other',
    'chat-process',
    'chat-refresh',
    'chat-robot',
    'chat-rubbish',
    'chat-send',
    'chat-share',
    'chat-shortcuts',
    'chat-star-empty',
    'chat-star',
    'chat-stop-play',
    'chat-stop-voice',
    'chat-switch',
    'chat-tell-more',
    'chat-thinking',
    'chat-unselected',
    'chat-upload',
    'chat-useless',
    'chat-voice',
    'check',
    'coinmarketcap',
    'disconnect',
    'discord',
    'download',
    'exit-fullscreen',
    'eye',
    'fullscreen',
    'github',
    'header-mobile',
    'header-noti',
    'header-pc',
    'header-qrcode',
    'header-setting',
    'language',
    'liquidity',
    'loading',
    'play',
    'receive',
    'required',
    'scan',
    'search',
    'selected',
    'send',
    'stake',
    'style-type',
    'task-detail-his',
    'task-detail',
    'task-list',
    'tooltip-arrow',
    'twitter',
    'unselected',
    'warn',
    'watch-list',
  ]
}

function IconsDemo() {
  const [searchTerm, setSearchTerm] = useState('')
  const [iconNames, setIconNames] = useState<string[]>([])
  const theme = useTheme()
  const toast = useToast()

  useEffect(() => {
    const loadIconNames = async () => {
      // Extract from stylesheet
      let icons = await extractIconNamesFromCSS()

      // Fallback to static list if extraction fails
      if (icons.length === 0) {
        console.log('All auto-extraction methods failed, using static list')
        icons = getStaticIconNames()
      }

      setIconNames(icons)
    }

    loadIconNames()
  }, [])

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return iconNames

    const searchTermLower = searchTerm.toLowerCase()

    return iconNames.filter((icon: string) => {
      // Can search both icon name and full class name (icon-xxx)
      const iconName = icon.toLowerCase()
      const fullClassName = `icon-${iconName}`

      return fullClassName.includes(searchTermLower)
    })
  }, [iconNames, searchTerm])

  const handleIconClick = useCallback(
    (iconName: string) => {
      const className = `icon-${iconName}`
      navigator.clipboard
        .writeText(className)
        .then(() => {
          toast({
            title: '复制成功',
            description: `已复制 ${className} 到剪贴板`,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-copy',
            iconTheme: theme.jade10,
            autoClose: 2000,
          })
        })
        .catch((err) => {
          console.error('Failed to copy icon name:', err)
          toast({
            title: '复制失败',
            description: '无法复制到剪贴板，请手动复制',
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-chat-close',
            iconTheme: theme.ruby50,
            autoClose: 3000,
          })
        })
    },
    [toast, theme.jade10, theme.ruby50],
  )

  return (
    <IconsWrapper>
      <Header>
        <h2>Icon 图标库</h2>
        <p>点击任意图标可复制类名到剪贴板</p>
      </Header>

      <Input
        placeholder='搜索图标名称...'
        inputType={InputType.SEARCH}
        onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
        inputValue={searchTerm}
        onResetValue={() => setSearchTerm('')}
      />

      <IconCount>
        共 {filteredIcons.length} 个图标
        {searchTerm && ` (从 ${iconNames.length} 个中筛选)`}
      </IconCount>

      <IconGrid>
        {filteredIcons.map((iconName) => (
          <IconItem key={iconName} onClick={() => handleIconClick(iconName)} title={`点击复制: icon-${iconName}`}>
            <IconDisplay className={`icon-${iconName}`} />
            <IconName>icon-{iconName}</IconName>
          </IconItem>
        ))}
      </IconGrid>

      {filteredIcons.length === 0 && searchTerm && (
        <div
          style={{
            textAlign: 'center',
            color: '#666',
            marginTop: '48px',
            fontSize: '16px',
          }}
        >
          未找到匹配的图标
        </div>
      )}
    </IconsWrapper>
  )
}

export default memo(IconsDemo)
