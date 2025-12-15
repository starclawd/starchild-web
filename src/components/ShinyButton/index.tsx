import { memo, ReactNode } from 'react'
import styled from 'styled-components'

interface ShinyButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

const StyledSpan = styled.span`
  z-index: 1;

  &::before {
    content: '';
    pointer-events: none;
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    translate: -50% -50%;
    z-index: -1;
    --size: calc(100% + 1rem);
    width: var(--size);
    height: var(--size);
    box-shadow: inset 0 -1ex 1rem 4px var(--shiny-cta-highlight);
    opacity: 0;
    transition: opacity var(--shiny-transition);
    animation: calc(var(--shiny-duration) * 1.5) breathe linear infinite;
  }
`

const StyledButton = styled.button`
  @property --gradient-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @property --gradient-angle-offset {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  @property --gradient-percent {
    syntax: '<percentage>';
    initial-value: 5%;
    inherits: false;
  }
  @property --gradient-shine {
    syntax: '<color>';
    initial-value: white;
    inherits: false;
  }

  @keyframes gradient-angle {
    to {
      --gradient-angle: 360deg;
    }
  }
  @keyframes shimmer {
    to {
      rotate: 360deg;
    }
  }
  @keyframes breathe {
    from,
    to {
      scale: 1;
    }
    50% {
      scale: 1.2;
    }
  }
  --shiny-cta-bg: #000000;
  --shiny-cta-bg-subtle: #1a1818;
  --shiny-cta-fg: #ffffff;
  --shiny-cta-highlight: #f84600;
  --shiny-cta-highlight-subtle: #ff6b33;
  --shiny-animation: gradient-angle linear infinite;
  --shiny-duration: 3s;
  --shiny-shadow-size: 2px;
  --shiny-transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);

  isolation: isolate;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  outline-offset: 4px;
  border: 1px solid transparent;
  border-radius: 360px;
  color: var(--shiny-cta-fg);
  background:
    linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg)) padding-box,
    conic-gradient(
        from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
        transparent,
        var(--shiny-cta-highlight) var(--gradient-percent),
        var(--gradient-shine) calc(var(--gradient-percent) * 2),
        var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
        transparent calc(var(--gradient-percent) * 4)
      )
      border-box;
  box-shadow: inset 0 0 0 1px var(--shiny-cta-bg-subtle);
  transition: var(--shiny-transition);
  transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;

  &::before,
  &::after {
    content: '';
    pointer-events: none;
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    translate: -50% -50%;
    z-index: -1;
  }

  &:active {
    translate: 0 1px;
  }

  /* Dots pattern */
  &::before {
    --size: calc(100% - var(--shiny-shadow-size) * 3);
    --position: 2px;
    --space: calc(var(--position) * 2);
    width: var(--size);
    height: var(--size);
    background: radial-gradient(
        circle at var(--position) var(--position),
        white calc(var(--position) / 4),
        transparent 0
      )
      padding-box;
    background-size: var(--space) var(--space);
    background-repeat: space;
    mask-image: conic-gradient(from calc(var(--gradient-angle) + 45deg), black, transparent 10% 90%, black);
    border-radius: inherit;
    opacity: 0.4;
    z-index: -1;
  }

  /* Inner shimmer */
  &::after {
    --shiny-animation: shimmer linear infinite;
    width: 100%;
    aspect-ratio: 1;
    background: linear-gradient(-50deg, transparent, var(--shiny-cta-highlight), transparent);
    mask-image: radial-gradient(circle at bottom, transparent 40%, black);
    opacity: 0.6;
  }

  /* Animate */
  &,
  &::before,
  &::after {
    animation:
      var(--shiny-animation) var(--shiny-duration),
      var(--shiny-animation) calc(var(--shiny-duration) / 0.4) reverse paused;
    animation-composition: add;
  }

  &:is(:hover, :focus-visible) {
    --gradient-percent: 20%;
    --gradient-angle-offset: 95deg;
    --gradient-shine: var(--shiny-cta-highlight-subtle);
  }

  &:is(:hover, :focus-visible),
  &:is(:hover, :focus-visible)::before,
  &:is(:hover, :focus-visible)::after {
    animation-play-state: running;
  }

  &:is(:hover, :focus-visible) ${StyledSpan}::before {
    opacity: 1;
  }
`

export default memo(function ShinyButton({ children, onClick, className = '' }: ShinyButtonProps) {
  return (
    <StyledButton className={className} onClick={onClick}>
      <StyledSpan>{children}</StyledSpan>
    </StyledButton>
  )
})
