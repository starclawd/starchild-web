import styled from 'styled-components'
import { Dispatch, SetStateAction, ChangeEvent, useCallback } from 'react'

const EditContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const ContentText = styled.div`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

const ContentTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 0;
  &::placeholder {
    color: ${({ theme }) => theme.textL4};
  }
`

export default function EditContent({
  content,
  isEdit,
  updateContent,
}: {
  content: string
  isEdit: boolean
  updateContent: Dispatch<SetStateAction<string>>
}) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateContent(e.target.value)
    },
    [updateContent],
  )

  return (
    <EditContentWrapper>
      {isEdit ? (
        <ContentTextarea value={content} onChange={handleChange} placeholder='Enter content...' />
      ) : (
        <ContentText>{content}</ContentText>
      )}
    </EditContentWrapper>
  )
}
