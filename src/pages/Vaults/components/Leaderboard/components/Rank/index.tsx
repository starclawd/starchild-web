import { memo, useMemo } from 'react'
import styled from 'styled-components'
import RankRedBg from 'assets/vaults/rank-red-bg.svg'
import { css } from 'styled-components'

export enum RANK_TYPE {
  LEADERBOARD = 'leaderboard',
  TABLE = 'table',
  CHAT = 'chat',
}

const RankWrapper = styled.div<{ $type: RANK_TYPE }>`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  ${({ $type }) =>
    $type === RANK_TYPE.LEADERBOARD &&
    css`
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
    `}

  ${({ $type }) =>
    $type === RANK_TYPE.TABLE &&
    css`
      width: 32px;
      height: 23px;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 12px;
        height: 12px;
      }
      span {
        position: relative;
        width: 26px;
        font-size: 20px;
        font-style: italic;
        font-weight: 700;
        line-height: 100%;
        z-index: 2;
      }
    `}

  ${({ $type }) =>
    $type === RANK_TYPE.CHAT &&
    css`
      width: 15px;
      height: 17px;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 12px;
        height: 12px;
      }
      span {
        position: relative;
        width: 10px;
        font-size: 13px;
        font-style: italic;
        font-weight: 700;
        line-height: 100%; /* 13px */
        z-index: 2;
      }
    `}
`

export default memo(function Rank({ rank, type }: { rank: number; type: RANK_TYPE }) {
  const colorMap = useMemo(() => {
    return ['#f90', '#888', '#AF3C1F']
  }, [])
  return (
    <RankWrapper $type={type}>
      <img src={RankRedBg} alt='rank' />
      <span style={{ color: 'rgba(255, 255, 255, 1)' }}>{rank}</span>
    </RankWrapper>
  )
})
