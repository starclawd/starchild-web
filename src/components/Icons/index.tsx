import { MouseEventHandler } from "react"
import { useTheme } from "store/theme/hooks"
import styled from "styled-components"

export const IconBase = styled.i`
  font-size: 0.16rem;
`

export const IconImgUpload = function ({
  width = 20,
  height = 20,
  onClick
}: {
  width?: number
  height?: number
  onClick?: MouseEventHandler<SVGElement>
}) {
  const theme = useTheme()
  return (
    <svg onClick={onClick} className="icon-img-upload" width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="2" width="18.5" height="16" rx="4.25" stroke={theme.text4} strokeWidth="1.5" />
      <path d="M1.58521 14.8032L6.90788 9.48049C7.2984 9.08997 7.93156 9.08997 8.32209 9.48049L11.7696 12.928C12.1601 13.3185 12.7933 13.3185 13.1838 12.928L18.5065 7.60531" stroke={theme.text4} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="11.75" y="5.5" width="2.75" height="2.75" rx="1.375" stroke={theme.text4} />
    </svg>
  )
}

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

export const IconAiDislike = function ({
  width = 18,
  height = 18,
  onClick
}: {
  width?: number
  height?: number
  onClick?: MouseEventHandler<SVGSVGElement>
}) {
  const theme = useTheme()
  return (
    <svg className="icon-ai-dislike" style={{ transform: 'rotate(180deg)' }} onClick={onClick} width={width} height={width} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.06509 2.0913C8.20299 1.87321 8.47248 1.75144 8.74822 1.78259L9.06067 1.81789C10.7593 2.00977 11.8548 3.54086 11.3513 5.01951L10.9721 6.13332H11.4666C13.2825 6.13332 14.6014 7.6938 14.1236 9.2771L13.1848 12.3882C12.858 13.471 11.7697 14.2222 10.5277 14.2222H3.84329C2.70254 14.2222 1.77777 13.3864 1.77777 12.3555V7.99999C1.77777 6.96903 2.70254 6.13332 3.84329 6.13332H5.22031C5.39899 6.13332 5.56397 6.0468 5.65262 5.90659L8.06509 2.0913ZM6.59733 12.9778H10.5277C11.1487 12.9778 11.6928 12.6022 11.8562 12.0607L12.7951 8.94963C13.034 8.15798 12.3746 7.37777 11.4666 7.37777H10.0399C9.8214 7.37777 9.61581 7.28406 9.48603 7.12521C9.35625 6.96636 9.31755 6.76127 9.38179 6.57256L10.0352 4.65353C10.2729 3.95545 9.79779 3.23399 9.02907 3.0749L6.84822 6.52401C6.63327 6.86394 6.29914 7.12011 5.90882 7.25942V12.3555C5.90882 12.6992 6.21708 12.9778 6.59733 12.9778ZM4.5318 7.37777V12.3555C4.5318 12.5737 4.57322 12.7831 4.64934 12.9778H3.84329C3.46305 12.9778 3.15479 12.6992 3.15479 12.3555V7.99999C3.15479 7.65634 3.46305 7.37777 3.84329 7.37777H4.5318Z" fill={theme.text4}/>
    </svg>    
  )
}

export const IconAiLike = function ({
  width = 18,
  height = 18,
  onClick
}: {
  width?: number
  height?: number
  onClick?: MouseEventHandler<SVGSVGElement>
}) {
  const theme = useTheme()
  return (
    <svg className="icon-ai-like" onClick={onClick} width={width} height={width} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.06509 2.0913C8.20299 1.87321 8.47248 1.75144 8.74822 1.78259L9.06067 1.81789C10.7593 2.00977 11.8548 3.54086 11.3513 5.01951L10.9721 6.13332H11.4666C13.2825 6.13332 14.6014 7.6938 14.1236 9.2771L13.1848 12.3882C12.858 13.471 11.7697 14.2222 10.5277 14.2222H3.84329C2.70254 14.2222 1.77777 13.3864 1.77777 12.3555V7.99999C1.77777 6.96903 2.70254 6.13332 3.84329 6.13332H5.22031C5.39899 6.13332 5.56397 6.0468 5.65262 5.90659L8.06509 2.0913ZM6.59733 12.9778H10.5277C11.1487 12.9778 11.6928 12.6022 11.8562 12.0607L12.7951 8.94963C13.034 8.15798 12.3746 7.37777 11.4666 7.37777H10.0399C9.8214 7.37777 9.61581 7.28406 9.48603 7.12521C9.35625 6.96636 9.31755 6.76127 9.38179 6.57256L10.0352 4.65353C10.2729 3.95545 9.79779 3.23399 9.02907 3.0749L6.84822 6.52401C6.63327 6.86394 6.29914 7.12011 5.90882 7.25942V12.3555C5.90882 12.6992 6.21708 12.9778 6.59733 12.9778ZM4.5318 7.37777V12.3555C4.5318 12.5737 4.57322 12.7831 4.64934 12.9778H3.84329C3.46305 12.9778 3.15479 12.6992 3.15479 12.3555V7.99999C3.15479 7.65634 3.46305 7.37777 3.84329 7.37777H4.5318Z" fill={theme.text4}/>
    </svg>    
  )
}

export const IconAiRefresh = function ({
  width = 18,
  height = 18,
  onClick
}: {
  width?: number
  height?: number
  onClick?: MouseEventHandler<SVGSVGElement>
}) {
  const theme = useTheme()
  return (
  <svg className="icon-ai-refresh" onClick={onClick} width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.67132 7.33412C3.00173 4.70262 5.26101 2.66669 8.00001 2.66669C9.36189 2.66669 10.6271 3.17079 11.5872 4.00262V3.25928C11.5872 2.932 11.8543 2.66669 12.1839 2.66669C12.5134 2.66669 12.7806 2.932 12.7806 3.25928V5.62965C12.7806 5.95693 12.5134 6.22224 12.1839 6.22224H9.79008C9.46053 6.22224 9.19339 5.95693 9.19339 5.62965C9.19339 5.30237 9.46053 5.03706 9.79008 5.03706H10.9579C10.1933 4.30449 9.13975 3.85187 8.00001 3.85187C5.87047 3.85187 4.11238 5.43513 3.85553 7.48073C3.81475 7.80553 3.5166 8.03599 3.18959 7.99546C2.86258 7.95498 2.63054 7.65886 2.67132 7.33412ZM12.8104 8.00458C13.1374 8.04506 13.3695 8.34118 13.3287 8.66592C12.9983 11.2974 10.739 13.3334 8.00001 13.3334C6.64148 13.3334 5.37912 12.8317 4.41987 12.0035V12.7408C4.41987 13.068 4.15273 13.3334 3.82318 13.3334C3.49364 13.3334 3.22649 13.068 3.22649 12.7408V10.3704C3.22649 10.0431 3.49364 9.7778 3.82318 9.7778H6.20994C6.53948 9.7778 6.80663 10.0431 6.80663 10.3704C6.80663 10.6977 6.53948 10.963 6.20994 10.963H5.04213C5.80678 11.6955 6.86027 12.1482 8.00001 12.1482C10.1295 12.1482 11.8876 10.5649 12.1445 8.51931C12.1852 8.19451 12.4834 7.96405 12.8104 8.00458Z" fill={theme.text4}/>
  </svg>
  )
}

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

export const IconAiHis = function ({
  width = 16,
  height = 16,
  onClick
}: {
  width?: number
  height?: number
  onClick: MouseEventHandler<SVGSVGElement>
}) {
  const theme = useTheme()
  return (
    <svg className="icon-ai-his" onClick={onClick} width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.25 8C14.25 11.4518 11.4518 14.25 8 14.25C4.54822 14.25 1.75 11.4518 1.75 8C1.75 4.54822 4.54822 1.75 8 1.75C11.4518 1.75 14.25 4.54822 14.25 8Z" stroke={theme.text4} strokeWidth="1.5"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.79996 7.67466L10.4896 9.09248C10.807 9.35873 10.8483 9.8318 10.5821 10.1491C10.3158 10.4664 9.84277 10.5078 9.52547 10.2415L7.61036 8.63458C7.41851 8.4736 7.32752 8.23701 7.34442 8.00496C7.31564 7.92535 7.29996 7.83949 7.29996 7.74996L7.29996 5.24996C7.29996 4.83575 7.63574 4.49996 8.04996 4.49996C8.46417 4.49996 8.79996 4.83575 8.79996 5.24996L8.79996 7.67466Z" fill={theme.text4}/>
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