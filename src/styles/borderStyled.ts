
import { ANI_DURATION } from 'constants/index';
import { vm } from 'pages/helper';
import styled, { css } from 'styled-components';
import { isIos } from 'utils/userAgent';

interface BorderBoxProps {
  $borderColor?: string
  $borderRadius?: number | string
  $borderTop?: boolean
  $borderRight?: boolean
  $borderBottom?: boolean
  $borderLeft?: boolean
  $hideBorder?: boolean
}

export const Border1PxBox = styled.div<BorderBoxProps>`
  display: flex;
  align-items: center;
  position: relative;
  /* overflow: hidden; */
  ${({ theme, $borderRadius }) => theme.isMobile
    ? css`
      border-radius: ${`${String($borderRadius).includes('%') ? $borderRadius : vm(Number($borderRadius) || 0)}`};
    `
    : css`
      border-radius: ${`${String($borderRadius).includes('%') ? $borderRadius : `${$borderRadius || 0}px`}`};
    `
  }

  ${({ theme, $borderRadius, $borderColor, $borderTop, $borderRight, $borderBottom, $borderLeft, $hideBorder }) => isIos && theme.isMobile && css`
    &::after {
      content: '';
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      transform-origin: 0 0;
      box-sizing: border-box;
      border-radius: ${`${$borderRadius ? Number($borderRadius) * 2 : '0'}${String($borderRadius).includes('%') ? '' : 'px'}`};
      border-style: solid;
      border-color: ${$hideBorder ? 'transparent' : $borderColor || '#ccc'};
      transition: border-color ${ANI_DURATION}s;
      z-index: 2;

      ${() => {
        const borderWidths = {
          top: $borderTop ? '1px' : '0',
          right: $borderRight ? '1px' : '0',
          bottom: $borderBottom ? '1px' : '0',
          left: $borderLeft ? '1px' : '0',
        };
        return css`
          border-width: ${borderWidths.top} ${borderWidths.right} ${borderWidths.bottom} ${borderWidths.left};
        `;
      }}
    }
  `}

  ${({ theme, $borderColor, $borderTop, $borderRight, $borderBottom, $borderLeft, $hideBorder }) => !(isIos && theme.isMobile) && css`
    border-style: solid;
    border-color: ${$hideBorder ? 'transparent' : $borderColor || '#ccc'};
    transition: border-color ${ANI_DURATION}s;
    
    ${() => {
      const borderWidths = {
        top: $borderTop ? '1px' : '0',
        right: $borderRight ? '1px' : '0',
        bottom: $borderBottom ? '1px' : '0',
        left: $borderLeft ? '1px' : '0',
      };
      return css`
        border-width: ${borderWidths.top} ${borderWidths.right} ${borderWidths.bottom} ${borderWidths.left};
      `;
    }}
  `}
`

export const BorderAllSide1PxBox = styled(Border1PxBox).attrs({
  $borderBottom: true,
  $borderRight: true,
  $borderLeft: true,
  $borderTop: true,
})``

export const BorderTop1PxBox = styled(Border1PxBox).attrs({
  $borderTop: true,
})``

export const BorderBottom1PxBox = styled(Border1PxBox).attrs({
  $borderBottom: true,
})``

export const BorderRight1PxBox = styled(Border1PxBox).attrs({
  $borderRight: true,
})``

export const BorderLeft1PxBox = styled(Border1PxBox).attrs({
  $borderLeft: true,
})``