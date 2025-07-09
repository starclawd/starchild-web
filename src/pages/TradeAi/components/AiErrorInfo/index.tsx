// import styled, { css } from 'styled-components'
// import { memo, ReactNode } from 'react'
// // import AssistantIcon from '../AssistantIcon'

// const ErrorWrapper = styled.div<{ isTradeAiPage: boolean }>`
//   display: flex;
//   font-size: 14px;
//   font-weight: 600;
//   line-height: 18px;
//   margin-bottom: 14px;
//   ${({ isTradeAiPage }) =>
//     isTradeAiPage &&
//     css`
//       font-size: 16px;
//       line-height: 20px;
//     `
//   }
// `

// const ErrorContent = styled.div`
//   display: flex;
//   padding-top: 6px;
// `

// export default memo(function AiErrorInfo({
//   errorInfo,
// }: {
//   errorInfo: ReactNode
// }) {
//   return <ErrorWrapper isTradeAiPage={true}>
//     {/* <AssistantIcon /> */}
//     <ErrorContent>{errorInfo}</ErrorContent>
//   </ErrorWrapper>
// })
