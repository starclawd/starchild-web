import styled, { css } from 'styled-components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { RefObject } from 'react'
import { ANI_DURATION } from 'constants/index'
import { getDomain } from 'utils/common'
import { goOutPageDirect } from 'utils/url'
import { vm } from 'pages/helper'

// 生成标题的 slug，支持中文
function generateSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 只保留字母、数字、中文字符和连字符
    .replace(/--+/g, '-') // 多个连字符合并为一个
    .replace(/^-+|-+$/g, '') // 去掉开头和结尾的连字符
}

const LinkWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  > span {
    color: ${({ theme }) => theme.black200};
    margin-left: 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${({ theme }) => theme.bgT20};
    transition: color ${ANI_DURATION}s;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: 0.12rem;
        line-height: 0.18rem;
        padding: ${vm(2)} ${vm(6)};
        border-radius: ${vm(4)};
      `}
  }

  &:hover {
    a {
      background: ${({ theme }) => theme.brand300};
    }

    > span {
      color: ${({ theme }) => theme.black100};
      background: ${({ theme }) => theme.black500};
    }
  }
`

const MarkdownWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black100};
  a {
    color: ${({ theme }) => theme.black100};
    transition: background ${ANI_DURATION}s;
  }

  /* 带锚点的标题样式（仅 h1-h3）*/
  h1,
  h2,
  h3 {
    scroll-margin-top: 80px; /* 锚点跳转时的偏移量 */

    /* 锚点链接图标 */
    .anchor-link {
      opacity: 0;
      margin-left: 8px;
      color: ${({ theme }) => theme.black200};
      text-decoration: none;
      transition: opacity ${ANI_DURATION}s;

      &:hover {
        color: ${({ theme }) => theme.black100};
        text-decoration: none;
      }
    }

    &:hover .anchor-link {
      opacity: 1;
    }
  }

  h4 {
    margin: 10px 0;
    &:first-child {
      margin-top: 0;
    }
  }
  hr {
    margin: 20px 0;
    border: 1px solid ${({ theme }) => theme.black800};
  }
  img {
    width: 100%;
  }
  ul,
  dl {
    list-style: revert;
    padding-left: 30px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        padding-left: ${vm(30)};
      `}
  }

  /* 嵌套在ul li中的ul使用outside样式 */
  ul li ul {
    list-style: outside;
  }
  ol {
    list-style: decimal;
    padding-left: 30px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        padding-left: ${vm(30)};
      `}
  }
  li,
  p {
    list-style: revert;
    padding: revert;
  }
  p,
  ol,
  ul {
    margin-bottom: 14px;
  }
  li {
    margin-bottom: 0;
  }
  p {
    &:last-child {
      margin-bottom: 0;
    }
  }
  pre {
    padding: 12px;
    border-radius: 12px;
    overflow: auto;
    margin: 8px 0;
    &::-webkit-scrollbar {
      width: auto;
      height: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      -webkit-border-radius: 0px;
      border-radius: 0px;
      background: transparent;
    }
    &::-webkit-scrollbar-corner {
      background: ${({ theme }) => theme.black0};
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.black300};
        border-radius: 3px;
      }
    }
  }

  /* 表格样式 - 参考 Table 组件 */
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin: 16px 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .table-container {
    overflow-x: auto;
    overflow-y: visible;
    margin: 16px 0;
    border-radius: 6px;
    /* 关键：设置固定宽度为0，让它完全依赖父容器 */
    width: 0;
    min-width: 100%;

    table {
      width: max-content;
      margin: 0;
      table-layout: auto;
      min-width: 100%;
    }
  }

  thead {
    th {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: ${({ theme }) => theme.black0};
      text-align: left;
      padding: 5px 12px;
      margin: 0;
      white-space: nowrap;
      background-color: ${({ theme }) => theme.black700};

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }
  }

  tbody {
    tr {
      transition: all ${ANI_DURATION}s;

      /* 添加行间分隔线，除了最后一行 */
      &:not(:last-child) td {
        border-bottom: 1px solid ${({ theme }) => theme.black800};
      }

      td {
        font-size: 13px;
        font-weight: 400;
        line-height: 20px;
        color: ${({ theme }) => theme.black100};
        text-align: left;
        padding: 10px 12px;
        margin: 0;
        vertical-align: middle;
        transition: all ${ANI_DURATION}s;
      }

      ${({ theme }) =>
        theme.isMobile
          ? css`
              &:active {
                td {
                  background-color: ${({ theme }) => theme.black900};
                }
              }
            `
          : css`
              &:hover {
                td {
                  background-color: ${({ theme }) => theme.black900};
                }
              }
            `}
    }
  }

  strong {
    color: ${({ theme }) => theme.black0};
    font-weight: 500;
  }

  em strong {
    font-style: normal;
    color: ${({ theme }) => theme.brand100};
  }
  code {
    font-family: unset;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;

      /* 移动端带锚点的标题样式（仅 h1-h3）*/
      h1,
      h2,
      h3 {
        scroll-margin-top: ${vm(60)};

        .anchor-link {
          margin-left: ${vm(6)};
        }
      }

      .table-container {
        margin: 0.16rem 0;
        width: 0;
        min-width: 100%;

        table {
          min-width: 100%;
          table-layout: auto;
          width: max-content;
        }
      }

      table {
        thead th {
          font-size: 0.16rem;
          font-weight: 400;
          line-height: 0.24rem;
          padding: 0.05rem 0.12rem;
        }

        tbody td {
          font-size: 0.13rem;
          font-weight: 400;
          line-height: 0.2rem;
          padding: 0.1rem 0.12rem;
        }
      }
    `}
`

export default function Markdown({ children, ref }: { children: string; ref?: RefObject<HTMLDivElement> }) {
  // 平滑滚动到锚点的函数
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      // 对 URL 编码的锚点进行解码，以匹配实际的元素 ID
      const decodedTargetId = decodeURIComponent(targetId)

      // 先尝试使用解码后的 ID 查找元素
      let targetElement = document.getElementById(decodedTargetId)

      // 如果找不到，尝试使用原始 ID 查找（兼容英文锚点）
      if (!targetElement) {
        targetElement = document.getElementById(targetId)
      }

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
        // 更新 URL 但不触发页面跳转
        window.history.pushState(null, '', href)
      }
    }
  }

  // 创建带锚点的标题组件的函数（仅用于 h1、h2、h3）
  const createHeadingWithAnchor = (level: number) => {
    return ({ node, children, ...props }: any) => {
      const text = children?.toString() || ''
      const id = generateSlug(text)
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

      return (
        <HeadingTag id={id} {...props}>
          {children}
          <a href={`#${id}`} className='anchor-link' onClick={(e) => handleAnchorClick(e, `#${id}`)}>
            #
          </a>
        </HeadingTag>
      )
    }
  }

  return (
    <MarkdownWrapper ref={ref} className='markdown-wrapper'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 标题组件 - h1-h3 带锚点，h4-h6 普通标题
          h1: createHeadingWithAnchor(1),
          h2: createHeadingWithAnchor(2),
          h3: createHeadingWithAnchor(3),

          // 链接组件
          a: ({ node, ...props }) => {
            const href = props.href || ''

            // 处理内部锚点链接
            if (href.startsWith('#')) {
              return <a {...props} onClick={(e) => handleAnchorClick(e, href)} style={{ cursor: 'pointer' }} />
            }

            // 处理外部链接
            const domain = getDomain(href)
            const handleDomainClick = () => {
              if (href) {
                goOutPageDirect(href)
              }
            }

            return (
              <LinkWrapper>
                <a target='_blank' rel='noopener noreferrer' {...props} />
                {domain && <span onClick={handleDomainClick}>{domain}</span>}
              </LinkWrapper>
            )
          },

          // 表格组件
          table: ({ node, ...props }) => {
            return (
              <div className='table-container scroll-style'>
                <table {...props} />
              </div>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </MarkdownWrapper>
  )
}
