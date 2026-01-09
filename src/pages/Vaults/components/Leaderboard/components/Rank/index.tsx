import { memo, useMemo } from 'react'
import styled from 'styled-components'
import RankBg from 'assets/vaults/rank-bg.svg'
import RankRedBg from 'assets/vaults/rank-red-bg.svg'
import { css } from 'styled-components'

const RankWrapper = styled.div<{ $isLeaderboard: boolean }>`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 34px;
  height: 32px;
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 22px;
    height: 22px;
  }
  span {
    position: relative;
    width: 26px;
    font-size: 33.255px;
    font-style: italic;
    font-weight: 700;
    line-height: 30px;
    z-index: 2;
  }
  ${({ $isLeaderboard }) =>
    !$isLeaderboard &&
    css`
      width: 32px;
      height: 23px;
      img {
        width: 12px;
        height: 12px;
      }
      span {
        font-size: 20px;
        font-style: italic;
        font-weight: 700;
        line-height: 100%;
      }
    `}
`

export default memo(function Rank({ rank, isLeaderboard }: { rank: number; isLeaderboard: boolean }) {
  const colorMap = useMemo(() => {
    return ['#f90', '#888', '#AF3C1F']
  }, [])
  return (
    <RankWrapper $isLeaderboard={isLeaderboard}>
      <img src={isLeaderboard ? RankRedBg : RankBg} alt='rank' />
      <span style={{ color: isLeaderboard ? '#FFF' : colorMap[rank - 1] || 'rgba(255, 255, 255, 0.80)' }}>{rank}</span>
    </RankWrapper>
  )
})
