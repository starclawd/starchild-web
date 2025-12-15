import ImgLoad from 'components/ImgLoad'
import Select, { TriggerMethod } from 'components/Select'
import { memo, useMemo } from 'react'
import { useGetTokenImg } from 'store/application/hooks'
import { SymbolDataType } from 'store/createstrategy/createstrategy'
import styled from 'styled-components'

const SymbolSelectWrapper = styled.div`
  display: flex;
  .select-border-wrapper {
    background-color: transparent;
    border-radius: 4px;
    width: 280px;
    height: 40px;
  }
`

const SymbolItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  span:nth-child(2) {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  span:nth-child(3) {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL4};
  }
`

export default memo(function SymbolSelect({
  symbols,
  currentSymbolData,
  setCurrentSymbolData,
}: {
  symbols: SymbolDataType[]
  currentSymbolData: SymbolDataType
  setCurrentSymbolData: (symbolData: SymbolDataType) => void
}) {
  const { symbol, base, name } = currentSymbolData
  const getTokenImg = useGetTokenImg()
  const selectDataList = useMemo(() => {
    return symbols.map((data) => {
      const { symbol, base, name } = data
      return {
        key: symbol,
        text: (
          <SymbolItemWrapper>
            <ImgLoad src={getTokenImg(base)} alt={base} />
            <span>{base}</span>
            <span>{name}</span>
          </SymbolItemWrapper>
        ),
        value: symbol,
        clickCallback: () => {
          setCurrentSymbolData(data)
        },
      }
    })
  }, [symbols, getTokenImg, setCurrentSymbolData])
  return (
    <SymbolSelectWrapper>
      <Select
        usePortal
        triggerMethod={TriggerMethod.CLICK}
        placement='bottom-start'
        value={symbol}
        dataList={selectDataList}
        popStyle={{
          width: '280px',
          borderRadius: '4px',
        }}
        popItemStyle={{
          borderRadius: '4px',
        }}
      >
        <SymbolItemWrapper>
          <ImgLoad src={getTokenImg(base)} alt={base} />
          <span>{base}</span>
          <span>{name}</span>
        </SymbolItemWrapper>
      </Select>
    </SymbolSelectWrapper>
  )
})
