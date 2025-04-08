// import styled from 'styled-components'
// import IdeaItem from '../IdeaItem'
// import { useMemo, useState } from 'react'
// import Pagination from 'components/Pagination'

// const FollowingWrapper = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   width: 100%;
//   height: calc(100% - 72px);
//   padding-right: 4px;
//   gap: 20px;
// `

// export default function Following() {
//   const pageSize = 4
//   const [pageIndex, setPageIndex] = useState(1)
//   const followingList = useMemo(() => {
//     return [
//       {
//         id: 1,
//       },
//       {
//         id: 2,
//       },
//       {
//         id: 3,
//       },
//       {
//         id: 4,
//       },
//     ]
//   }, [])
//   return <>
//     <FollowingWrapper className='scroll-style'>
//       {followingList.map((following, index) => (
//         <IdeaItem key={following.id} index={index} />
//       ))}
//     </FollowingWrapper>
//     <Pagination
//       usePropsControl
//       pageSize={pageSize}
//       pageIndex={pageIndex}
//       setPageIndex={setPageIndex}
//       totalSize={followingList.length}
//     />
//   </>

// }
