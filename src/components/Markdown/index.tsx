import styled, { css } from 'styled-components'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { RefObject } from 'react'
import { ANI_DURATION } from 'constants/index'
import { getDomain } from 'utils/common'
import { goOutPageDirect } from 'utils/url'
import { vm } from 'pages/helper'

const LinkWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  > span {
    color: ${({ theme }) => theme.textL3};
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
      color: ${({ theme }) => theme.textL2};
      background: ${({ theme }) => theme.text20};
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
  color: ${({ theme }) => theme.textL2};
  a {
    color: ${({ theme }) => theme.textL2};
    transition: background ${ANI_DURATION}s;
  }
  h4 {
    margin: 10px 0;
    &:first-child {
      margin-top: 0;
    }
  }
  hr {
    margin: 20px 0;
    border: 1px solid ${({ theme }) => theme.lineDark8};
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
      background: ${({ theme }) => theme.textL1};
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.textL4};
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
      color: ${({ theme }) => theme.textL1};
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
        border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
      }

      td {
        font-size: 13px;
        font-weight: 400;
        line-height: 20px;
        color: ${({ theme }) => theme.textL2};
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
                  background-color: ${({ theme }) => theme.bgT10};
                }
              }
            `
          : css`
              &:hover {
                td {
                  background-color: ${({ theme }) => theme.bgT10};
                }
              }
            `}
    }
  }

  strong {
    color: ${({ theme }) => theme.textL1};
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
  return (
    <MarkdownWrapper ref={ref} className='markdown-wrapper'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => {
            const domain = getDomain(props.href)

            const handleDomainClick = () => {
              if (props.href) {
                goOutPageDirect(props.href)
              }
            }

            return (
              <LinkWrapper>
                <a target='_blank' rel='noopener noreferrer' {...props} />
                {domain && <span onClick={handleDomainClick}>{domain}</span>}
              </LinkWrapper>
            )
          },
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
