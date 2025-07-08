import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

const PreferenceWrapper = styled.div`
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

const BottomContent = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 20px 20px;
`

const ButtonCancel = styled(ButtonBorder)`
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

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .input-area {
    height: 120px !important;
    max-height: 120px !important;
    border-radius: 24px;
    border: 1px solid ${({ theme }) => theme.bgT30};
    backdrop-filter: blur(8px);
    padding: 12px 16px;
  }
`

const ContentTitle = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

export default function Preference() {
  const [aboutYou, setAboutYou] = useState('')
  const [longTermMemory, setLongTermMemory] = useState('')
  const changeAboutYou = useCallback((value: string) => {
    setAboutYou(value)
  }, [])
  const changeLongTermMemory = useCallback((value: string) => {
    setLongTermMemory(value)
  }, [])
  const contentList = [
    {
      key: 'tell-us-about-you',
      title: <Trans>Tell us about you</Trans>,
      content: aboutYou,
      placeholder: t`Anything`,
      setValue: changeAboutYou
    },
    {
      key: 'long-term-memory-for-you',
      title: <Trans>Long term memory for you</Trans>,
      content: longTermMemory,
      placeholder: t`Describe`,
      setValue: changeLongTermMemory
    },
  ]
  return <PreferenceWrapper>
    <TopContent>
      {contentList.map((data) => {
        const { key, title, content, placeholder, setValue } = data
        return <ContentItem key={key}>
          <ContentTitle>{title}</ContentTitle>
          <InputArea disabledUpdateHeight placeholder={placeholder} value={content} setValue={setValue} />
        </ContentItem>
      })}
    </TopContent>
    <BottomContent>
      <ButtonCancel><Trans>Cancel</Trans></ButtonCancel>
      <ButtonConfirm><Trans>Confirm</Trans></ButtonConfirm>
    </BottomContent>
  </PreferenceWrapper>
}
