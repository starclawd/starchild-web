import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Input, { InputType } from 'components/Input'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useState } from 'react'
import { useGetTokenImg } from 'store/application/hooks'
import styled from 'styled-components'

const WatchlistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
`

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

const TokenItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 48px;
  padding: 8px 12px 8px 8px;
  border-radius: 36px;
  > span:first-child {
    display: flex;
    align-items: center;
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 8px;
    }
    span:nth-child(2) {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      margin-right: 4px;
      color: ${({ theme }) => theme.textL1};
    }
    span:nth-child(3) {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.textL3};
    }
  }
  .icon-check {
    font-size: 24px;
    color: ${({ theme }) => theme.jade10};
  }
`

const BottomContent = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 20px 20px;
`

const ButtonSelectAll = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`

const ButtonConfirm = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`

export default function Watchlist() {
  const [value, setValue] = useState('')
  const getTokenImage = useGetTokenImg()
  const scrollRef = useScrollbarClass<HTMLDivElement>();
  const tokenList: any[] = []
  const inputChange = useCallback((e: any) => {
    setValue(e.target.value)
  }, [])
  return <WatchlistWrapper>
    <TopContent>
      <Input
        inputValue={value}
        placeholder="Search Token"
        inputType={InputType.SEARCH}
        onChange={inputChange}
        onResetValue={() => setValue('')}
      />
      <TokenList ref={scrollRef} className="scroll-style">
        {tokenList.map(token => {
          const { symbol, des } = token
          return <TokenItem key={token.id}>
          <span>
            <img src={getTokenImage(symbol)} alt={token.name} />
            <span>{symbol}</span>
            <span>{des}</span>
          </span>
          <IconBase className="icon-check" />
        </TokenItem>
        })}
      </TokenList>
    </TopContent>
    <BottomContent>
      <ButtonSelectAll><Trans>Select All</Trans></ButtonSelectAll>
      <ButtonConfirm><Trans>Select (8)</Trans></ButtonConfirm>
    </BottomContent>
  </WatchlistWrapper>
}
