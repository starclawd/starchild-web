import { Trans } from '@lingui/react/macro';
import { IconBase, IconToolShape } from 'components/Icons';
import styled, { css } from 'styled-components'

// 样式化的Tooltip组件
const TooltipWrapper = styled.div<{ $isLong: boolean, $isTop: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1002;
  white-space: nowrap;
  transform: translateX(-50%);
  .tooltip-text {
    width: auto;
    text-align: center;
    padding: 2px 6px;
    background-color: ${({ theme }) => theme.textL6};
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;
    span {
      color: ${({ theme, $isLong }) => $isLong ? theme.jade10 : theme.ruby50};
    }
  }
  .tooltip-shape {
    position: relative;
    display: flex;
    justify-content: center;
    width: 20px;
    height: 14px;
    background-color: ${({ theme }) => theme.textL6};
    .tooltip-shape-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${({ $isLong, theme }) => $isLong ? theme.jade10 : theme.ruby50};
    }
    svg {
      position: absolute;
      &:nth-child(2) {
        left: -6.5px;
      }
      &:nth-child(3) {
        right: -6.5px;
      }
    }
  }
  ${({ $isTop }) => $isTop
  ? css`
    flex-direction: column-reverse;
    bottom: -6px;
    .tooltip-shape {
      align-items: flex-start;
      border-radius: 0 0 16px 16px;
      svg {
        &:nth-child(3) {
          transform: rotate(270deg)
        }
      }
    }
  ` : css`
    top: -6px;
    .tooltip-shape {
      align-items: flex-end;
      border-radius: 16px 16px 0 0;
      svg {
        &:nth-child(2) {
          transform: rotate(90deg);
        }
        &:nth-child(3) {
          transform: rotate(180deg);
        }
      }
    }
  `}
`;

export default function Tooltip({
  isLong,
  isTop = true,
}: {
  isLong: boolean
  isTop?: boolean
}) {
  return <TooltipWrapper $isLong={isLong} $isTop={isTop}>
    <span className="tooltip-shape">
      <span className="tooltip-shape-dot"></span>
      <IconToolShape />
      <IconToolShape />
    </span>
    <span className="tooltip-text">
      Price action - <span>{isLong ? <Trans>Pump</Trans> : <Trans>Dump</Trans>}</span>
    </span>
  </TooltipWrapper>
}
