import { MouseEventHandler } from "react"
import { useTheme } from "store/themecache/hooks"
import styled from "styled-components"

export const IconBase = styled.i`
  font-size: 0.16rem;
`

export const IconAiMessageSend = function ({
  color1,
  color2,
}: {
  color1: string
  color2: string
}) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill={color1} />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.8001 10.3031L9.4545 11.6486C8.98587 12.1172 8.22607 12.1172 7.75744 11.6486C7.28881 11.18 7.28881 10.4202 7.75744 9.95156L11.1475 6.56146L11.1515 6.55744C11.398 6.31096 11.7251 6.19412 12.0479 6.20692C12.1854 6.21237 12.3222 6.24134 12.4516 6.29384C12.5961 6.35242 12.7315 6.44029 12.8486 6.55745L12.8517 6.56051L16.2427 9.95155C16.7113 10.4202 16.7113 11.18 16.2427 11.6486C15.7741 12.1172 15.0143 12.1172 14.5457 11.6486L13.2001 10.303L13.2001 16.8001C13.2001 17.4628 12.6628 18.0001 12.0001 18.0001C11.3373 18.0001 10.8001 17.4628 10.8001 16.8001L10.8001 10.3031Z" fill={color2} />
    </svg>
  )
}


export const IconDepPending = styled(IconBase)`
  font-size: 16px;
  animation: rotates 1s linear infinite;
  @keyframes rotates {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const IconAssetsShare = function ({
  color,
  width = 14,
  height = 14,
  onClick,
}: {
  width?: number | string
  height?: number | string
  color: string
  onClick?: MouseEventHandler<SVGSVGElement>
}) {
  return (
    <svg onClick={onClick} className="icon-assets-share" width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 7L12 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 1H12C12.5523 1 13 1.44772 13 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export const IconFullScreen = function ({
  color,
  width = 14,
  height = 14,
  isFullScreen,
  onClick,
}: {
  width?: number
  height?: number
  isFullScreen: boolean
  color: string
  onClick?: MouseEventHandler<SVGSVGElement>
}) {
  return !isFullScreen
    ? <svg className="icon-fullscreen" onClick={onClick} width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 3C0 1.34315 1.34315 0 3 0H5V2H3C2.44772 2 2 2.44772 2 3V5H0V3Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 0H10C9.44772 0 9 0.447715 9 1V1C9 1.55228 9.44772 2 10 2H12V4C12 4.55228 12.4477 5 13 5V5C13.5523 5 14 4.55228 14 4V0Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00001 6.00001C7.60949 5.60949 7.60949 4.97632 8.00002 4.5858L11.5858 1.00001C11.9763 0.60949 12.6095 0.60949 13 1.00001V1.00001C13.3905 1.39054 13.3905 2.0237 13 2.41423L9.41423 6.00001C9.0237 6.39054 8.39054 6.39054 8.00001 6.00001V6.00001Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 11C14 12.6569 12.6569 14 11 14H9V12H11C11.5523 12 12 11.5523 12 11V9H14V11Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 14H4C4.55228 14 5 13.5523 5 13V13C5 12.4477 4.55228 12 4 12H2V10C2 9.44772 1.55228 9 1 9V9C0.447715 9 0 9.44772 0 10V14Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M5.99999 7.99999C6.39051 8.39051 6.39051 9.02368 5.99998 9.4142L2.4142 13C2.02368 13.3905 1.39051 13.3905 0.999986 13V13C0.609462 12.6095 0.609462 11.9763 0.999987 11.5858L4.58577 7.99999C4.9763 7.60946 5.60946 7.60946 5.99999 7.99999V7.99999Z" fill={color} />
    </svg>
    : <svg className="icon-fullscreen" onClick={onClick} width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 3C0 1.34315 1.34315 0 3 0H5V2H3C2.44772 2 2 2.44772 2 3V5H0V3Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.29291 6.70712H11.2929C11.8452 6.70712 12.2929 6.25941 12.2929 5.70712C12.2929 5.15484 11.8452 4.70712 11.2929 4.70712H9.29291V2.70712C9.29291 2.15484 8.84519 1.70712 8.29291 1.70712C7.74062 1.70712 7.29291 2.15484 7.29291 2.70712V6.70712Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M13.2929 0.707109C13.6834 1.09763 13.6834 1.7308 13.2929 2.12132L9.70711 5.70711C9.31658 6.09763 8.68342 6.09763 8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289L11.8787 0.707108C12.2692 0.316585 12.9024 0.316585 13.2929 0.707109Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 11C14 12.6569 12.6569 14 11 14H9V12H11C11.5523 12 12 11.5523 12 11V9H14V11Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M6.70709 7.29288H2.70709C2.15481 7.29288 1.70709 7.74059 1.70709 8.29288C1.70709 8.84516 2.15481 9.29288 2.70709 9.29288H4.70709V11.2929C4.70709 11.8452 5.15481 12.2929 5.70709 12.2929C6.25938 12.2929 6.70709 11.8452 6.70709 11.2929V7.29288Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M0.707107 13.2929C0.316582 12.9024 0.316583 12.2692 0.707107 11.8787L4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289C6.09763 8.68342 6.09763 9.31658 5.70711 9.70711L2.12132 13.2929C1.7308 13.6834 1.09763 13.6834 0.707107 13.2929Z" fill={color} />
    </svg>
}