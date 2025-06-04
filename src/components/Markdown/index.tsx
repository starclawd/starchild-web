import styled, { css } from 'styled-components'
import ReactMarkdown from 'react-markdown'

const MarkdownWrapper = styled.div`
  width: fit-content;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.textL2};
  a {
    color: ${({ theme }) => theme.brand6};
    &:hover {
      color: ${({ theme }) => theme.brand6};
    }
  }
  h4 {
    margin: 10px 0;
    &:first-child {
      margin-top: 0;
    }
  }
  ol, ul, dl, li, p {
    list-style: revert;
    padding: revert;
  }
  p, li, ol, ul {
    margin-bottom: 14px;
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
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.16rem;
    font-weight: 500;
    line-height: 0.24rem;
  `}
`

export default function Markdown({
  children,
}: {
  children: string
}) {
  return <MarkdownWrapper className="markdown-wrapper">
    <ReactMarkdown
      components={{
        a: ({node, ...props}) => {
          return <a target="_blank" rel="noopener noreferrer" {...props}/>
        }
      }}
    >
      {children}
    </ReactMarkdown>
  </MarkdownWrapper>
}
