import styled, { css } from 'styled-components'
import { useEffect, useRef } from 'react'
import { vm } from 'pages/helper'

const ArcBgWrapper = styled.div`
  position: absolute;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${vm(157)};
  `}
`

const ArcLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  svg {
    width: 100%;
    height: auto;
    aspect-ratio: 399 / 142;
  }
`

const ArcFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  svg {
    width: 100%;
    height: auto;
    aspect-ratio: 399 / 157;
  }
`

export default function ArcBg({ isLong = true }: { isLong?: boolean }) {
  const lineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (lineRef.current) {
      const gradientId = isLong ? '#paint0_linear_arc' : '#paint0_linear_arc_short';
      const gradient = lineRef.current.querySelector(gradientId);
      if (gradient) {
        // 初始设置渐变位置，确保亮点立即可见
        if (isLong) {
          gradient.setAttribute('x1', '0');
          gradient.setAttribute('x2', '100');
        } else {
          // 确保初始位置的亮点大小与最终一致且立即可见
          const distance = 392.931 - 0.998966; // 最终x1和x2之间的距离
          gradient.setAttribute('x1', '0');
          gradient.setAttribute('x2', String(0 - distance));
        }

        // 创建动画，移动亮色部分，立即开始动画
        // 动画效果，慢慢移动到最终位置
        let startTime: number;
        const duration = 1500; // 动画持续时间 (ms)

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = (timestamp - startTime) / duration;
          
          if (progress < 1) {
            if (isLong) {
              // 计算动画总路径长度
              const totalDistanceX1 = 6.07385 - 0;
              const totalDistanceX2 = 398.006 - 100;
              
              const currentX1 = 0 + progress * totalDistanceX1;
              const currentX2 = 100 + progress * totalDistanceX2;
              
              gradient.setAttribute('x1', String(currentX1));
              gradient.setAttribute('x2', String(currentX2));
            } else {
              // 保持亮点大小相对稳定，与图1使用相同的动画路径长度
              const distance = 392.931 - 0.998966; // 最终x1和x2之间的距离
              const totalDistance = 392.931 - 0;
              
              const currentX1 = 0 + progress * totalDistance;
              const currentX2 = currentX1 - distance; // 保持与x1的固定距离
              
              gradient.setAttribute('x1', String(currentX1));
              gradient.setAttribute('x2', String(currentX2));
            }
            
            requestAnimationFrame(animate);
          } else {
            // 确保最终位置是准确的
            if (isLong) {
              gradient.setAttribute('x1', '6.07385');
              gradient.setAttribute('x2', '398.006');
            } else {
              // 使用原始SVG中的精确值
              gradient.setAttribute('x1', '392.931');
              gradient.setAttribute('x2', '0.998966');
            }
          }
        };

        requestAnimationFrame(animate);
      }
    }
  }, [isLong]);

  return (
    <ArcBgWrapper>
      {isLong ? (
        <>
          <ArcFill>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 399 157" fill="none" preserveAspectRatio="xMidYMid meet">
              <path fillRule="evenodd" clipRule="evenodd" d="M399.004 0V121C399.004 140.882 382.887 157 363.004 157H29.0872C17.1336 157 6.54068 151.174 -0.00683594 142.206C128.319 140.221 340.286 108.711 399.004 0Z" fill="url(#paint0_linear_fill)"/>
              <defs>
                <linearGradient id="paint0_linear_fill" x1="199.499" y1="0" x2="199.499" y2="157" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2FF582" stopOpacity="0.2"/>
                  <stop offset="1" stopColor="#1B8F4C" stopOpacity="0.04"/>
                </linearGradient>
              </defs>
            </svg>
          </ArcFill>
          <ArcLine>
            <svg ref={lineRef} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 399 142" fill="none" preserveAspectRatio="xMidYMid meet">
              <path d="M398.006 1C338.853 106.999 128.125 138.507 1.00586 141" stroke="url(#paint0_linear_arc)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear_arc" x1="6.07385" y1="71" x2="398.006" y2="71" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#131519"/>
                  <stop offset="0.574858" stopColor="#193E29"/>
                  <stop offset="0.716346" stopColor="#2FF582"/>
                  <stop offset="0.889423" stopColor="#131519"/>
                </linearGradient>
              </defs>
            </svg>
          </ArcLine>
        </>
      ) : (
        <>
          <ArcFill>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 157" fill="none" preserveAspectRatio="xMidYMid meet">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.000427246 0V121C0.000427246 140.882 16.1182 157 36.0004 157H369.918C381.871 157 392.464 151.174 399.012 142.206C270.686 140.221 58.7193 108.711 0.000427246 0Z" fill="url(#paint0_linear_short_fill)"/>
              <defs>
                <linearGradient id="paint0_linear_short_fill" x1="199.506" y1="0" x2="199.506" y2="157" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E93E71" stopOpacity="0.2"/>
                  <stop offset="1" stopColor="#E93E71" stopOpacity="0.04"/>
                </linearGradient>
              </defs>
            </svg>
          </ArcFill>
          <ArcLine>
            <svg ref={lineRef} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 399 142" fill="none" preserveAspectRatio="xMidYMid meet">
              <path d="M0.999012 1C60.1518 106.999 270.88 138.507 397.999 141" stroke="url(#paint0_linear_arc_short)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear_arc_short" x1="392.931" y1="71" x2="0.998966" y2="71" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#131519"/>
                  <stop offset="0.574858" stopColor="#3C1621"/>
                  <stop offset="0.716346" stopColor="#E93E71"/>
                  <stop offset="0.889423" stopColor="#131519"/>
                </linearGradient>
              </defs>
            </svg>
          </ArcLine>
        </>
      )}
    </ArcBgWrapper>
  )
}
