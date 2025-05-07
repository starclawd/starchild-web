import { keyframes } from "styled-components";
import { vm } from "pages/helper";
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 淡入动画
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

// 淡出动画
export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

export const marquee = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

export const opacityTopShow = keyframes`
  0% {
    opacity: 0;
    bottom: -10px;
  }
  100% {
    opacity: 1;
    bottom: 0;
  }
`
export const opacityLeftShow = keyframes`
  0% {
    opacity: 0;
    right: -10px;
  }
  100% {
    opacity: 1;
    right: 0;
  }
`
export const opacityRightShow = keyframes`
  0% {
    opacity: 0;
    left: -10px;
  }
  100% {
    opacity: 1;
    left: 0;
  }
`
export const opacityBottomShow = keyframes`
  0% {
    opacity: 0;
    top: -10px;
  }
  100% {
    opacity: 1;
    top: 0;
  }
`
export const opacityDisappear = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

export const breathe = keyframes`
  0% {
    box-shadow: 0px 0px 4px ${({ theme }) => theme.jade10};
  }
  50% {
    box-shadow: 0px 0px 15px ${({ theme }) => theme.jade10};
  }
  100% {
    box-shadow: 0px 0px 4px ${({ theme }) => theme.jade10};
  }
`

export const mobileBreathe = keyframes`
  0% {
    box-shadow: 0px 0px ${vm(4)} ${({ theme }) => theme.jade10};
  }
  50% {
    box-shadow: 0px 0px ${vm(15)} ${({ theme }) => theme.jade10};
  }
  100% {
    box-shadow: 0px 0px ${vm(4)} ${({ theme }) => theme.jade10};
  }
`

export const colorChange = keyframes`
  0%, 100% {
    background-color: #46DBAF;
  }
  25% {
    background-color: #A7DE40;
  }
  50% {
    background-color: #FFA800;
  }
  75% {
    background-color: #FF6A68;
  }
`

export const gradientFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`
