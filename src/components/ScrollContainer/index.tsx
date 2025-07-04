import React, { useRef, ReactNode, RefObject } from 'react';
import styled, { css } from 'styled-components';
import { useScrollDetection } from '../../hooks/useScrollDetection';

interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const StyledScrollContainer = styled.div<{ 
  $hasVerticalScroll: boolean; 
  $hasHorizontalScroll: boolean;
}>`
  overflow: auto;
  
  ${({ theme, $hasVerticalScroll }) => !theme.isMobile && $hasVerticalScroll && css`
    padding-right: 14px;
    margin-right: 4px;
  `}
  
  &:hover {
    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.text10};
    }
  }

  ${({ theme }) => theme.isMobile
    ? css`
      scrollbar-width: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    `
    : css`
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: transparent;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-track {
        -webkit-border-radius: 0px;
        border-radius: 0px;
        background: transparent;
      }
      &::-webkit-scrollbar-corner {
        background: ${({ theme }) => theme.text10};
      }
    `}
`;

export const ScrollContainer: React.FC<ScrollContainerProps> = ({ 
  children, 
  className, 
  style 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasVerticalScroll, hasHorizontalScroll } = useScrollDetection(containerRef as RefObject<HTMLDivElement>);

  return (
    <StyledScrollContainer
      ref={containerRef}
      className={className}
      style={style}
      $hasVerticalScroll={hasVerticalScroll}
      $hasHorizontalScroll={hasHorizontalScroll}
    >
      {children}
    </StyledScrollContainer>
  );
}; 